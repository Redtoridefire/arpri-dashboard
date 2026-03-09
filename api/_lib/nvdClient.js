/**
 * Shared NVD API Client
 * Used by both /api/realtime and /api/feeds
 */

const NVD_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'ARPRI-Dashboard/3.0 (AI Risk Intelligence Platform)',
        'Accept': 'application/json',
        ...options.headers
      }
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Parse a single NVD CVE v2 entry
 */
function parseNVDCVE(entry) {
  const cve = entry.cve;
  const desc = (cve.descriptions || []).find(d => d.lang === 'en')?.value || '';
  const cvssV31 = cve.metrics?.cvssMetricV31?.[0];
  const cvssV30 = cve.metrics?.cvssMetricV30?.[0];
  const cvss = cvssV31 || cvssV30;

  return {
    id: cve.id,
    published: cve.published,
    lastModified: cve.lastModified,
    status: cve.vulnStatus,
    description: desc,
    cvssScore: cvss?.cvssData?.baseScore ?? null,
    cvssVector: cvss?.cvssData?.vectorString ?? null,
    severity: cvss?.cvssData?.baseSeverity ?? null,
    exploitabilityScore: cvss?.exploitabilityScore ?? null,
    impactScore: cvss?.impactScore ?? null,
    weaknesses: (cve.weaknesses || []).flatMap(w =>
      w.description.map(d => d.value)
    ),
    references: (cve.references || []).map(r => ({ url: r.url, tags: r.tags || [] }))
  };
}

/**
 * Fetch AI/ML CVEs from NVD (last N days)
 */
export async function fetchNVDAICVEs(daysBack = 90) {
  const headers = {};
  if (process.env.NVD_API_KEY) headers['apiKey'] = process.env.NVD_API_KEY;

  const pubStartDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
    .toISOString().replace(/\.\d{3}Z$/, '.000');
  const pubEndDate = new Date().toISOString().replace(/\.\d{3}Z$/, '.000');

  // Try multiple search strategies if first one returns empty
  const searches = [
    `${NVD_BASE}?keywordSearch=artificial+intelligence&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=10`,
    `${NVD_BASE}?keywordSearch=machine+learning&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=10`,
    `${NVD_BASE}?keywordSearch=pytorch&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=10`,
    `${NVD_BASE}?cvssV3Severity=CRITICAL&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=5`
  ];

  let aiVulns = [];
  let totalResults = 0;

  // Try searches until we get some results
  for (const searchUrl of searches) {
    try {
      const data = await fetchWithTimeout(searchUrl, { headers });
      const vulns = (data.vulnerabilities || []).map(parseNVDCVE);
      if (vulns.length > 0) {
        aiVulns = vulns;
        totalResults = data.totalResults || vulns.length;
        break;
      }
    } catch (err) {
      console.warn(`NVD search failed: ${err.message}`);
    }
  }

  // Get critical count separately
  let criticalCount = 0;
  try {
    const critData = await fetchWithTimeout(
      `${NVD_BASE}?cvssV3Severity=CRITICAL&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=1`,
      { headers }
    );
    criticalCount = critData.totalResults || 0;
  } catch (err) {
    console.warn(`Critical count failed: ${err.message}`);
  }

  return {
    aiCVEs: aiVulns,
    totalAIResults: totalResults,
    criticalLast30Days: criticalCount,
    apiKeyConfigured: !!process.env.NVD_API_KEY,
    daysSearched: daysBack
  };
}

/**
 * Fetch simple list of recent CVEs for feed display
 */
export async function fetchNVDForFeed() {
  const headers = {};
  if (process.env.NVD_API_KEY) headers['apiKey'] = process.env.NVD_API_KEY;

  try {
    const data = await fetchNVDAICVEs(90); // Last 90 days
    return data.aiCVEs.slice(0, 10).map(cve => ({
      id: cve.id,
      description: (cve.description || 'No description').substring(0, 200),
      severity: cve.severity || 'MEDIUM',
      score: cve.cvssScore || 5.0,
      published: cve.published || new Date().toISOString(),
      source: 'NVD'
    }));
  } catch (err) {
    throw err;
  }
}
