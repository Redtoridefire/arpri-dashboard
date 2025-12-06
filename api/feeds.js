/**
 * External Feeds API Endpoint
 * Returns aggregated data from public security feeds
 * PHASE 5: Real external feed integration
 */

// Import feedAggregator logic (inline for Vercel compatibility)
class FeedAggregator {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes
  }

  async getCachedOrFetch(key, fetchFn, fallbackFn) {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return { data: cached.data, source: 'cache' };
    }

    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: Date.now() });
      return { data, source: 'external' };
    } catch (error) {
      console.warn(`Failed to fetch ${key}, using fallback:`, error.message);
      const fallbackData = fallbackFn();
      return { data: fallbackData, source: 'fallback' };
    }
  }

  async getNVDData() {
    return this.getCachedOrFetch(
      'nvd',
      async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(
            'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=artificial+intelligence&resultsPerPage=10',
            {
              headers: { 'User-Agent': 'ARPRI-Dashboard/1.0' },
              signal: controller.signal
            }
          );

          clearTimeout(timeout);

          if (!response.ok) throw new Error(`NVD API error: ${response.status}`);

          const json = await response.json();
          const cves = json.vulnerabilities || [];

          return cves.slice(0, 10).map(vuln => ({
            id: vuln.cve?.id || 'N/A',
            description: (vuln.cve?.descriptions?.[0]?.value || 'No description').substring(0, 200),
            severity: vuln.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'MEDIUM',
            score: vuln.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 5.0,
            published: vuln.cve?.published || new Date().toISOString(),
            source: 'NVD'
          }));
        } catch (error) {
          clearTimeout(timeout);
          throw error;
        }
      },
      () => this.generateFallbackCVEs()
    );
  }

  async getCISAAdvisories() {
    return this.getCachedOrFetch(
      'cisa',
      async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(
            'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
            {
              signal: controller.signal
            }
          );

          clearTimeout(timeout);

          if (!response.ok) throw new Error(`CISA API error: ${response.status}`);

          const json = await response.json();
          const vulnerabilities = json.vulnerabilities || [];

          return vulnerabilities.slice(0, 10).map(vuln => ({
            cveID: vuln.cveID || 'N/A',
            vendorProject: vuln.vendorProject || 'Unknown',
            product: vuln.product || 'Unknown',
            vulnerabilityName: vuln.vulnerabilityName || 'N/A',
            dateAdded: vuln.dateAdded || new Date().toISOString(),
            shortDescription: (vuln.shortDescription || 'N/A').substring(0, 150),
            requiredAction: (vuln.requiredAction || 'N/A').substring(0, 150),
            source: 'CISA KEV'
          }));
        } catch (error) {
          clearTimeout(timeout);
          throw error;
        }
      },
      () => this.generateFallbackCISA()
    );
  }

  generateFallbackCVEs() {
    return [
      { id: 'CVE-2024-1234', description: 'AI model vulnerability in inference pipeline', severity: 'HIGH', score: 7.5, published: new Date().toISOString(), source: 'Synthetic' },
      { id: 'CVE-2024-5678', description: 'Prompt injection vulnerability in LLM system', severity: 'CRITICAL', score: 9.1, published: new Date().toISOString(), source: 'Synthetic' },
      { id: 'CVE-2024-9012', description: 'Data leakage in ML training pipeline', severity: 'MEDIUM', score: 5.3, published: new Date().toISOString(), source: 'Synthetic' }
    ];
  }

  generateFallbackCISA() {
    return [
      { cveID: 'CVE-2024-0001', vendorProject: 'AI Vendor', product: 'ML Platform', vulnerabilityName: 'Model Poisoning', dateAdded: new Date().toISOString(), shortDescription: 'Adversarial manipulation', requiredAction: 'Apply patches', source: 'Synthetic' },
      { cveID: 'CVE-2024-0002', vendorProject: 'Cloud Provider', product: 'AI Service', vulnerabilityName: 'Data Exfiltration', dateAdded: new Date().toISOString(), shortDescription: 'Unauthorized data access', requiredAction: 'Update configuration', source: 'Synthetic' }
    ];
  }

  async aggregateFeeds() {
    const [nvd, cisa] = await Promise.allSettled([
      this.getNVDData(),
      this.getCISAAdvisories()
    ]);

    return {
      nvd: nvd.status === 'fulfilled' ? nvd.value : { data: this.generateFallbackCVEs(), source: 'fallback' },
      cisa: cisa.status === 'fulfilled' ? cisa.value : { data: this.generateFallbackCISA(), source: 'fallback' },
      lastUpdated: new Date().toISOString()
    };
  }
}

const aggregator = new FeedAggregator();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;

    switch (type) {
      case 'nvd':
        const nvdData = await aggregator.getNVDData();
        return res.status(200).json(nvdData);

      case 'cisa':
        const cisaData = await aggregator.getCISAAdvisories();
        return res.status(200).json(cisaData);

      default:
        // Return all feeds
        const allFeeds = await aggregator.aggregateFeeds();
        return res.status(200).json(allFeeds);
    }
  } catch (error) {
    console.error('Feeds API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
