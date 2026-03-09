/**
 * Real-Time Intelligence API
 *
 * Free APIs used (no API key required):
 * - NVD CVE API v2: https://nvd.nist.gov/developers/vulnerabilities
 *   Rate limit: 5 req/30s (unauthenticated), 50 req/30s (with free API key)
 *   Free API key signup: https://nvd.nist.gov/developers/request-an-api-key
 *
 * - CISA KEV Catalog: https://www.cisa.gov/known-exploited-vulnerabilities-catalog
 *   Completely free, no auth needed, updated daily
 *
 * - OSV.dev (Open Source Vulnerabilities): https://osv.dev/
 *   Completely free, no auth needed, covers PyPI/npm/GitHub
 *
 * To add your free NVD API key:
 *   Set env var: NVD_API_KEY=your-key-here
 *   This raises rate limit from 5 to 50 requests per 30 seconds
 */

const NVD_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
const CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const OSV_QUERY_URL = 'https://api.osv.dev/v1/query';

const AI_KEYWORDS = [
  'pytorch', 'tensorflow', 'transformers', 'langchain', 'llm',
  'machine learning', 'artificial intelligence', 'huggingface',
  'openai', 'scikit-learn', 'keras', 'onnx', 'mlflow'
];

/**
 * Fetch with timeout and abort controller
 */
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
 * Fetch recent AI/ML CVEs from NVD
 */
async function fetchNVDAICVEs() {
  const nvdApiKey = process.env.NVD_API_KEY;
  const headers = nvdApiKey ? { 'apiKey': nvdApiKey } : {};

  // Get CVEs from the last 30 days matching AI keywords
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const pubStartDate = thirtyDaysAgo.toISOString().replace(/\.\d{3}Z$/, '.000');
  const pubEndDate = new Date().toISOString().replace(/\.\d{3}Z$/, '.000');

  const url = `${NVD_BASE}?keywordSearch=machine+learning+AI&pubStartDate=${pubStartDate}&pubEndDate=${pubEndDate}&resultsPerPage=20&noRejected`;

  try {
    const data = await fetchWithTimeout(url, { headers });
    return {
      vulnerabilities: data.vulnerabilities || [],
      totalResults: data.totalResults || 0,
      resultsPerPage: data.resultsPerPage || 0
    };
  } catch (err) {
    console.error('NVD fetch error:', err.message);
    return { vulnerabilities: [], totalResults: 0, resultsPerPage: 0, error: err.message };
  }
}

/**
 * Fetch NVD stats for all CVEs (last 30 days)
 */
async function fetchNVDStats() {
  const nvdApiKey = process.env.NVD_API_KEY;
  const headers = nvdApiKey ? { 'apiKey': nvdApiKey } : {};

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Only fetch critical CVEs from last 30 days (smaller request)
  const url = `${NVD_BASE}?cvssV3Severity=CRITICAL&pubStartDate=${thirtyDaysAgo.toISOString().replace(/\.\d{3}Z$/, '.000')}&pubEndDate=${new Date().toISOString().replace(/\.\d{3}Z$/, '.000')}&resultsPerPage=1`;

  try {
    const data = await fetchWithTimeout(url, { headers });
    return {
      criticalLast30Days: data.totalResults || 0
    };
  } catch (err) {
    console.error('NVD stats error:', err.message);
    return { criticalLast30Days: 0, error: err.message };
  }
}

/**
 * Fetch CISA Known Exploited Vulnerabilities catalog
 */
async function fetchCISAKEV() {
  try {
    const data = await fetchWithTimeout(CISA_KEV_URL);
    const vulns = data.vulnerabilities || [];

    // Filter for AI/ML related
    const aiRelated = vulns.filter(v => {
      const text = `${v.vendorProject} ${v.product} ${v.vulnerabilityName} ${v.shortDescription}`.toLowerCase();
      return AI_KEYWORDS.some(kw => text.includes(kw));
    });

    // Get recently added (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentlyAdded = vulns.filter(v => {
      if (!v.dateAdded) return false;
      return new Date(v.dateAdded) > thirtyDaysAgo;
    });

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const addedThisWeek = vulns.filter(v => v.dateAdded && new Date(v.dateAdded) > sevenDaysAgo);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const addedToday = vulns.filter(v => v.dateAdded && new Date(v.dateAdded) >= today);

    // Ransomware-associated
    const ransomwareCount = vulns.filter(v =>
      v.knownRansomwareCampaignUse === 'Known'
    ).length;

    return {
      total: vulns.length,
      addedToday: addedToday.length,
      addedThisWeek: addedThisWeek.length,
      addedLast30Days: recentlyAdded.length,
      ransomwareAssociated: ransomwareCount,
      aiRelated: aiRelated.length,
      recentEntries: recentlyAdded.slice(0, 5).map(v => ({
        id: v.cveID,
        name: v.vulnerabilityName,
        vendor: v.vendorProject,
        product: v.product,
        dateAdded: v.dateAdded,
        ransomware: v.knownRansomwareCampaignUse === 'Known'
      })),
      catalogVersion: data.catalogVersion,
      dateReleased: data.dateReleased
    };
  } catch (err) {
    console.error('CISA KEV fetch error:', err.message);
    return { total: 0, error: err.message };
  }
}

/**
 * Fetch OSV.dev data for AI/ML Python packages
 */
async function fetchOSVData() {
  const aiPackages = ['torch', 'tensorflow', 'transformers', 'langchain', 'openai'];

  const results = await Promise.allSettled(
    aiPackages.map(pkg =>
      fetchWithTimeout(
        OSV_QUERY_URL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ package: { name: pkg, ecosystem: 'PyPI' } })
        },
        8000
      )
    )
  );

  const summary = {};
  results.forEach((result, i) => {
    const pkg = aiPackages[i];
    if (result.status === 'fulfilled') {
      summary[pkg] = result.value.vulns?.length || 0;
    } else {
      summary[pkg] = null;
    }
  });

  const totalKnownVulns = Object.values(summary)
    .filter(v => v !== null)
    .reduce((a, b) => a + b, 0);

  return { byPackage: summary, totalKnownVulns };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600'); // Cache 5 min on CDN

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { type } = req.query;

  try {
    switch (type) {
      case 'nvd': {
        const [aiCVEs, stats] = await Promise.allSettled([
          fetchNVDAICVEs(),
          fetchNVDStats()
        ]);
        return res.status(200).json({
          aiCVEs: aiCVEs.status === 'fulfilled' ? aiCVEs.value : { error: 'Failed' },
          stats: stats.status === 'fulfilled' ? stats.value : { error: 'Failed' },
          timestamp: new Date().toISOString(),
          source: 'NIST NVD CVE API v2 (Free)',
          apiKeyConfigured: !!process.env.NVD_API_KEY
        });
      }

      case 'cisa': {
        const kev = await fetchCISAKEV();
        return res.status(200).json({
          ...kev,
          timestamp: new Date().toISOString(),
          source: 'CISA Known Exploited Vulnerabilities Catalog (Free)'
        });
      }

      case 'osv': {
        const osv = await fetchOSVData();
        return res.status(200).json({
          ...osv,
          timestamp: new Date().toISOString(),
          source: 'OSV.dev Open Source Vulnerabilities (Free)'
        });
      }

      case 'status': {
        return res.status(200).json({
          integrations: {
            NVD: { status: 'active', url: NVD_BASE, authRequired: false, apiKeyOptional: true, freeSignup: 'https://nvd.nist.gov/developers/request-an-api-key' },
            CISA_KEV: { status: 'active', url: CISA_KEV_URL, authRequired: false },
            OSV: { status: 'active', url: 'https://api.osv.dev/v1/query', authRequired: false },
          },
          nvdApiKeyConfigured: !!process.env.NVD_API_KEY,
          timestamp: new Date().toISOString()
        });
      }

      default: {
        // Fetch all in parallel
        const [nvdAI, cisa, osv] = await Promise.allSettled([
          fetchNVDAICVEs(),
          fetchCISAKEV(),
          fetchOSVData()
        ]);

        return res.status(200).json({
          timestamp: new Date().toISOString(),
          nvd: nvdAI.status === 'fulfilled' ? nvdAI.value : { error: nvdAI.reason?.message },
          cisa: cisa.status === 'fulfilled' ? cisa.value : { error: cisa.reason?.message },
          osv: osv.status === 'fulfilled' ? osv.value : { error: osv.reason?.message },
          sources: {
            NVD: 'https://nvd.nist.gov (Free, optional API key for higher rate limits)',
            CISA: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog (Free)',
            OSV: 'https://osv.dev (Free, covers PyPI/npm/GitHub)'
          }
        });
      }
    }
  } catch (error) {
    console.error('Realtime API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
