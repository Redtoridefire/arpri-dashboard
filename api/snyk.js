/**
 * Snyk API Integration
 *
 * Setup:
 * 1. Go to https://app.snyk.io/account → API Token section
 * 2. Copy your token
 * 3. In Vercel dashboard → Project Settings → Environment Variables
 *    Add: SNYK_API_TOKEN = <your-token>
 *    Add: SNYK_ORG_ID = <your-org-id>  (find in Snyk Settings → General)
 *
 * Auth header: "Authorization: token <SNYK_API_TOKEN>"
 * REST API base: https://api.snyk.io/rest
 * V1 API base:   https://snyk.io/api/v1
 * API version param: ?version=2024-06-10
 *
 * Docs: https://docs.snyk.io/snyk-api
 */

const SNYK_REST_BASE = 'https://api.snyk.io/rest';
const SNYK_V1_BASE = 'https://snyk.io/api/v1';
const SNYK_API_VERSION = '2024-06-10';

// AI/ML package purls to check via Snyk
const AI_PACKAGE_PURLS = [
  'pkg:pypi/torch',
  'pkg:pypi/tensorflow',
  'pkg:pypi/transformers',
  'pkg:pypi/langchain',
  'pkg:pypi/openai',
  'pkg:pypi/scikit-learn',
  'pkg:pypi/keras',
  'pkg:pypi/numpy',
  'pkg:pypi/pillow',
  'pkg:npm/langchain'
];

function snykHeaders() {
  const token = process.env.SNYK_API_TOKEN;
  if (!token) throw new Error('SNYK_API_TOKEN environment variable not set');
  return {
    'Authorization': `token ${token}`,
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json'
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    if (response.status === 401) throw new Error('Invalid Snyk API token');
    if (response.status === 403) throw new Error('Snyk token lacks required permissions');
    if (response.status === 404) throw new Error('Snyk org/resource not found — check SNYK_ORG_ID');
    if (!response.ok) throw new Error(`Snyk API HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Get Snyk org info and verify token works
 */
async function getOrgInfo() {
  const data = await fetchWithTimeout(
    `${SNYK_REST_BASE}/self?version=${SNYK_API_VERSION}`,
    { headers: snykHeaders() }
  );
  return {
    username: data.data?.attributes?.username,
    name: data.data?.attributes?.name,
    email: data.data?.attributes?.email,
    orgs: data.data?.relationships?.orgs?.data?.map(o => o.id) || []
  };
}

/**
 * List all projects in the org
 */
async function listProjects(orgId) {
  const data = await fetchWithTimeout(
    `${SNYK_REST_BASE}/orgs/${orgId}/projects?version=${SNYK_API_VERSION}&limit=100`,
    { headers: snykHeaders() }
  );
  return (data.data || []).map(p => ({
    id: p.id,
    name: p.attributes?.name,
    type: p.attributes?.type,
    status: p.attributes?.status,
    issueCount: p.attributes?.issue_counts_by_severity,
    created: p.attributes?.created,
    lastTestedAt: p.attributes?.last_tested_at
  }));
}

/**
 * Get vulnerabilities for a specific package via purl
 * Uses REST API: GET /orgs/{org_id}/packages/{purl}/issues
 */
async function getPackageIssues(orgId, purl) {
  const encodedPurl = encodeURIComponent(purl);
  try {
    const data = await fetchWithTimeout(
      `${SNYK_REST_BASE}/orgs/${orgId}/packages/${encodedPurl}/issues?version=${SNYK_API_VERSION}&limit=20`,
      { headers: snykHeaders() }
    );

    return (data.data || []).map(issue => ({
      id: issue.id,
      type: issue.attributes?.type,
      title: issue.attributes?.title,
      severity: issue.attributes?.effective_severity_level,
      cvssScore: issue.attributes?.coordinates?.[0]?.representations?.[0]?.remedies?.[0]?.details?.cvssScore,
      cves: issue.attributes?.coordinates?.flatMap(c =>
        c.representations?.map(r => r.cve?.id).filter(Boolean) || []
      ) || [],
      isFixable: issue.attributes?.coordinates?.some(c =>
        c.representations?.some(r => r.remedies?.some(rem => rem.type === 'indeterminate'))
      ),
      purl
    }));
  } catch (err) {
    return { purl, error: err.message };
  }
}

/**
 * Get aggregated issues for a project (V1 API)
 */
async function getProjectIssues(orgId, projectId) {
  const data = await fetchWithTimeout(
    `${SNYK_V1_BASE}/org/${orgId}/project/${projectId}/aggregated-issues`,
    {
      method: 'POST',
      headers: {
        'Authorization': `token ${process.env.SNYK_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filters: {
          severities: ['critical', 'high', 'medium'],
          exploitMaturity: ['mature', 'proof-of-concept', 'no-known-exploit'],
          types: ['vuln'],
          ignored: false,
          patched: false
        }
      })
    }
  );

  const issues = data.issues || [];
  return {
    projectId,
    total: issues.length,
    critical: issues.filter(i => i.issueData?.severity === 'critical').length,
    high: issues.filter(i => i.issueData?.severity === 'high').length,
    medium: issues.filter(i => i.issueData?.severity === 'medium').length,
    fixable: issues.filter(i => i.isUpgradable || i.isPatchable).length,
    issues: issues.slice(0, 10).map(i => ({
      id: i.id,
      title: i.issueData?.title,
      severity: i.issueData?.severity,
      cvssScore: i.issueData?.cvssScore,
      isUpgradable: i.isUpgradable,
      isPatchable: i.isPatchable,
      fixedIn: i.fixInfo?.fixedIn || []
    }))
  };
}

/**
 * Get vulnerability summary across all AI/ML packages
 */
async function getAIPackageSummary(orgId) {
  const results = await Promise.allSettled(
    AI_PACKAGE_PURLS.map(purl => getPackageIssues(orgId, purl))
  );

  const byPackage = {};
  let totalCritical = 0, totalHigh = 0, totalMedium = 0;

  results.forEach((result, i) => {
    const purl = AI_PACKAGE_PURLS[i];
    const pkgName = purl.split('/').pop();

    if (result.status === 'fulfilled') {
      const issues = Array.isArray(result.value) ? result.value : [];
      const critical = issues.filter(i => i.severity === 'critical').length;
      const high = issues.filter(i => i.severity === 'high').length;
      const medium = issues.filter(i => i.severity === 'medium').length;
      totalCritical += critical;
      totalHigh += high;
      totalMedium += medium;
      byPackage[pkgName] = { total: issues.length, critical, high, medium, purl };
    } else {
      byPackage[pkgName] = { error: result.reason?.message, purl };
    }
  });

  return {
    byPackage,
    totals: { critical: totalCritical, high: totalHigh, medium: totalMedium, all: totalCritical + totalHigh + totalMedium },
    packagesScanned: AI_PACKAGE_PURLS.length
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200'); // Cache 10 min

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Check token configured
  if (!process.env.SNYK_API_TOKEN) {
    return res.status(503).json({
      error: 'Snyk API token not configured',
      setup: 'Add SNYK_API_TOKEN to your Vercel environment variables',
      docs: 'https://docs.snyk.io/snyk-api/authentication-for-api'
    });
  }

  const { type, orgId, projectId, purl } = req.query;
  const resolvedOrgId = orgId || process.env.SNYK_ORG_ID;

  try {
    switch (type) {
      case 'self': {
        const info = await getOrgInfo();
        return res.status(200).json({ ...info, timestamp: new Date().toISOString() });
      }

      case 'projects': {
        if (!resolvedOrgId) return res.status(400).json({ error: 'orgId required (or set SNYK_ORG_ID env var)' });
        const projects = await listProjects(resolvedOrgId);
        return res.status(200).json({ projects, count: projects.length, timestamp: new Date().toISOString() });
      }

      case 'project-issues': {
        if (!resolvedOrgId || !projectId) return res.status(400).json({ error: 'orgId and projectId required' });
        const issues = await getProjectIssues(resolvedOrgId, projectId);
        return res.status(200).json({ ...issues, timestamp: new Date().toISOString() });
      }

      case 'package': {
        if (!resolvedOrgId) return res.status(400).json({ error: 'orgId required (or set SNYK_ORG_ID env var)' });
        if (!purl) return res.status(400).json({ error: 'purl required (e.g. pkg:pypi/torch)' });
        const issues = await getPackageIssues(resolvedOrgId, purl);
        return res.status(200).json({ purl, issues, timestamp: new Date().toISOString() });
      }

      case 'ai-packages': {
        if (!resolvedOrgId) return res.status(400).json({ error: 'orgId required (or set SNYK_ORG_ID env var)' });
        const summary = await getAIPackageSummary(resolvedOrgId);
        return res.status(200).json({ ...summary, timestamp: new Date().toISOString() });
      }

      default: {
        // Return summary: org info + AI package scan
        const [selfInfo, pkgSummary] = await Promise.allSettled([
          getOrgInfo(),
          resolvedOrgId ? getAIPackageSummary(resolvedOrgId) : Promise.resolve(null)
        ]);

        return res.status(200).json({
          timestamp: new Date().toISOString(),
          account: selfInfo.status === 'fulfilled' ? selfInfo.value : { error: selfInfo.reason?.message },
          aiPackages: pkgSummary.status === 'fulfilled' ? pkgSummary.value : { error: pkgSummary.reason?.message },
          note: !resolvedOrgId ? 'Set SNYK_ORG_ID env var to enable package scanning' : undefined
        });
      }
    }
  } catch (error) {
    console.error('Snyk API error:', error);
    const status = error.message.includes('token') ? 401 : 500;
    return res.status(status).json({ error: error.message });
  }
}
