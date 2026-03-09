/**
 * Real-Time Intelligence API
 *
 * Free APIs (no cost, no card):
 * - NVD CVE API v2  → https://nvd.nist.gov/developers/vulnerabilities
 *   Optional free key (higher rate limit): https://nvd.nist.gov/developers/request-an-api-key
 *   Set env: NVD_API_KEY=<your-key>
 *
 * - CISA KEV Catalog → https://www.cisa.gov/known-exploited-vulnerabilities-catalog
 *   No auth required, updated daily.
 *
 * - OSV.dev → https://osv.dev
 *   No auth required, covers PyPI/npm/GitHub packages.
 *
 * Paid / token-required:
 * - Snyk API → https://docs.snyk.io/snyk-api
 *   Set env: SNYK_API_TOKEN=<your-token>  (see api/snyk.js)
 */

const NVD_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
const CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const OSV_QUERY_URL = 'https://api.osv.dev/v1/query';

const AI_KEYWORDS = [
  'pytorch', 'tensorflow', 'transformers', 'langchain', 'llm',
  'machine learning', 'artificial intelligence', 'huggingface',
  'openai', 'scikit-learn', 'keras', 'onnx', 'mlflow'
];

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
 * Parse a single NVD CVE v2 entry into a flat object
 * Schema: vulnerabilities[].cve.{id, descriptions, metrics.cvssMetricV31, published, references}
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
 * Fetch recent AI/ML CVEs from NVD (last 30 days)
 */
async function fetchNVDAICVEs() {
  const headers = {};
  if (process.env.NVD_API_KEY) headers['apiKey'] = process.env.NVD_API_KEY;

  const pubStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().replace(/\.\d{3}Z$/, '.000');
  const pubEndDate = new Date().toISOString().replace(/\.\d{3}Z$/, '.000');

  // Two queries: general AI keywords + critical severity recent CVEs
  const [aiData, criticalData] = await Promise.allSettled([
    fetchWithTimeout(
      `${NVD_BASE}?keywordSearch=machine+learning+AI&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=20&noRejected`,
      { headers }
    ),
    fetchWithTimeout(
      `${NVD_BASE}?cvssV3Severity=CRITICAL&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=1`,
      { headers }
    )
  ]);

  const aiVulns = aiData.status === 'fulfilled'
    ? (aiData.value.vulnerabilities || []).map(parseNVDCVE)
    : [];

  return {
    aiCVEs: aiVulns,
    totalAIResults: aiData.status === 'fulfilled' ? aiData.value.totalResults : 0,
    criticalLast30Days: criticalData.status === 'fulfilled' ? criticalData.value.totalResults : 0,
    apiKeyConfigured: !!process.env.NVD_API_KEY,
    errors: [
      aiData.status === 'rejected' ? `AI query: ${aiData.reason?.message}` : null,
      criticalData.status === 'rejected' ? `Critical query: ${criticalData.reason?.message}` : null
    ].filter(Boolean)
  };
}

/**
 * Fetch CISA Known Exploited Vulnerabilities catalog
 */
async function fetchCISAKEV() {
  const data = await fetchWithTimeout(CISA_KEV_URL);
  const vulns = data.vulnerabilities || [];

  const aiRelated = vulns.filter(v => {
    const text = `${v.vendorProject} ${v.product} ${v.vulnerabilityName} ${v.shortDescription}`.toLowerCase();
    return AI_KEYWORDS.some(kw => text.includes(kw));
  });

  const now = Date.now();
  const ms30d = 30 * 24 * 60 * 60 * 1000;
  const ms7d = 7 * 24 * 60 * 60 * 1000;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const recentlyAdded = vulns.filter(v => v.dateAdded && (now - new Date(v.dateAdded)) < ms30d);
  const addedThisWeek = vulns.filter(v => v.dateAdded && (now - new Date(v.dateAdded)) < ms7d);
  const addedToday = vulns.filter(v => v.dateAdded && new Date(v.dateAdded) >= today);

  return {
    total: vulns.length,
    addedToday: addedToday.length,
    addedThisWeek: addedThisWeek.length,
    addedLast30Days: recentlyAdded.length,
    ransomwareAssociated: vulns.filter(v => v.knownRansomwareCampaignUse === 'Known').length,
    aiRelated: aiRelated.length,
    recentEntries: recentlyAdded.slice(0, 5).map(v => ({
      id: v.cveID,
      name: v.vulnerabilityName,
      vendor: v.vendorProject,
      product: v.product,
      dateAdded: v.dateAdded,
      dueDate: v.dueDate,
      ransomware: v.knownRansomwareCampaignUse === 'Known',
      requiredAction: v.requiredAction
    })),
    catalogVersion: data.catalogVersion,
    dateReleased: data.dateReleased
  };
}

/**
 * Fetch OSV.dev data for AI/ML Python packages
 */
async function fetchOSVData() {
  const packages = [
    { name: 'torch', ecosystem: 'PyPI' },
    { name: 'tensorflow', ecosystem: 'PyPI' },
    { name: 'transformers', ecosystem: 'PyPI' },
    { name: 'langchain', ecosystem: 'PyPI' },
    { name: 'openai', ecosystem: 'PyPI' }
  ];

  const results = await Promise.allSettled(
    packages.map(pkg =>
      fetchWithTimeout(OSV_QUERY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: pkg })
      }, 8000)
    )
  );

  const byPackage = {};
  results.forEach((result, i) => {
    byPackage[packages[i].name] = result.status === 'fulfilled'
      ? (result.value.vulns || []).length
      : null;
  });

  return {
    byPackage,
    totalKnownVulns: Object.values(byPackage).filter(v => v !== null).reduce((a, b) => a + b, 0)
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { type } = req.query;

  try {
    switch (type) {
      case 'nvd': {
        const data = await fetchNVDAICVEs();
        return res.status(200).json({ ...data, timestamp: new Date().toISOString(), source: 'NIST NVD CVE API v2' });
      }
      case 'cisa': {
        const data = await fetchCISAKEV();
        return res.status(200).json({ ...data, timestamp: new Date().toISOString(), source: 'CISA KEV Catalog' });
      }
      case 'osv': {
        const data = await fetchOSVData();
        return res.status(200).json({ ...data, timestamp: new Date().toISOString(), source: 'OSV.dev' });
      }
      case 'status': {
        return res.status(200).json({
          integrations: {
            NVD: { status: 'active', freeApiKey: 'https://nvd.nist.gov/developers/request-an-api-key', apiKeyConfigured: !!process.env.NVD_API_KEY },
            CISA_KEV: { status: 'active', authRequired: false },
            OSV: { status: 'active', authRequired: false },
            Snyk: { status: process.env.SNYK_API_TOKEN ? 'active' : 'token_missing', endpoint: '/api/snyk' }
          },
          timestamp: new Date().toISOString()
        });
      }
      default: {
        const [nvd, cisa, osv] = await Promise.allSettled([
          fetchNVDAICVEs(),
          fetchCISAKEV(),
          fetchOSVData()
        ]);
        return res.status(200).json({
          timestamp: new Date().toISOString(),
          nvd: nvd.status === 'fulfilled' ? nvd.value : { error: nvd.reason?.message },
          cisa: cisa.status === 'fulfilled' ? cisa.value : { error: cisa.reason?.message },
          osv: osv.status === 'fulfilled' ? osv.value : { error: osv.reason?.message }
        });
      }
    }
  } catch (error) {
    console.error('Realtime API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
