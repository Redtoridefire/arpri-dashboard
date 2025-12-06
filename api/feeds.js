/**
 * External Feeds API Endpoint
 * Returns aggregated data from public security feeds
 * PHASE 6: Comprehensive Real Intelligence Integration
 *
 * Data Sources:
 * - NIST NVD: National Vulnerability Database
 * - CISA KEV: Known Exploited Vulnerabilities
 * - GitHub Security Advisories: Repository vulnerabilities
 * - CVE Statistics: Industry-wide vulnerability trends
 * - OWASP Top 10 for LLMs: AI/ML security risks
 */

// OWASP Top 10 for LLMs (2023) - Authoritative Static Data
const OWASP_LLM_TOP_10 = [
  {
    rank: 1,
    id: 'LLM01',
    name: 'Prompt Injection',
    severity: 'CRITICAL',
    description: 'Crafted inputs manipulate LLM behavior, bypass safeguards, or extract sensitive information',
    impact: 'Unauthorized data access, malicious code execution, system compromise',
    mitigation: 'Input validation, output filtering, privilege minimization, human oversight',
    cweId: 'CWE-74',
    source: 'OWASP'
  },
  {
    rank: 2,
    id: 'LLM02',
    name: 'Insecure Output Handling',
    severity: 'HIGH',
    description: 'LLM outputs used downstream without validation enable XSS, CSRF, or code injection',
    impact: 'System compromise, data breaches, privilege escalation',
    mitigation: 'Output encoding, content security policies, zero-trust validation',
    cweId: 'CWE-20',
    source: 'OWASP'
  },
  {
    rank: 3,
    id: 'LLM03',
    name: 'Training Data Poisoning',
    severity: 'HIGH',
    description: 'Manipulated training data introduces backdoors, biases, or vulnerabilities',
    impact: 'Model bias, compromised predictions, data exfiltration',
    mitigation: 'Data validation, anomaly detection, secure supply chain',
    cweId: 'CWE-502',
    source: 'OWASP'
  },
  {
    rank: 4,
    id: 'LLM04',
    name: 'Model Denial of Service',
    severity: 'MEDIUM',
    description: 'Resource-intensive operations cause service degradation or financial impact',
    impact: 'Service unavailability, cost escalation, resource exhaustion',
    mitigation: 'Rate limiting, input validation, resource quotas, monitoring',
    cweId: 'CWE-400',
    source: 'OWASP'
  },
  {
    rank: 5,
    id: 'LLM05',
    name: 'Supply Chain Vulnerabilities',
    severity: 'HIGH',
    description: 'Third-party datasets, pre-trained models, or plugins introduce vulnerabilities',
    impact: 'Data breaches, biased outputs, system compromise',
    mitigation: 'Vendor assessment, SBOM tracking, model validation, signing',
    cweId: 'CWE-829',
    source: 'OWASP'
  },
  {
    rank: 6,
    id: 'LLM06',
    name: 'Sensitive Information Disclosure',
    severity: 'CRITICAL',
    description: 'LLMs inadvertently reveal PII, proprietary data, or confidential information',
    impact: 'Privacy violations, regulatory non-compliance, reputation damage',
    mitigation: 'Data sanitization, output filtering, access controls, encryption',
    cweId: 'CWE-200',
    source: 'OWASP'
  },
  {
    rank: 7,
    id: 'LLM07',
    name: 'Insecure Plugin Design',
    severity: 'HIGH',
    description: 'LLM plugins lack input validation, authorization, or access controls',
    impact: 'Remote code execution, unauthorized access, data exfiltration',
    mitigation: 'Strict input validation, least privilege, plugin sandboxing',
    cweId: 'CWE-284',
    source: 'OWASP'
  },
  {
    rank: 8,
    id: 'LLM08',
    name: 'Excessive Agency',
    severity: 'HIGH',
    description: 'LLM systems given unconstrained autonomy make damaging or unintended actions',
    impact: 'Unauthorized transactions, system changes, data loss',
    mitigation: 'Human-in-the-loop, action boundaries, audit logging, rollback',
    cweId: 'CWE-862',
    source: 'OWASP'
  },
  {
    rank: 9,
    id: 'LLM09',
    name: 'Overreliance',
    severity: 'MEDIUM',
    description: 'Users or systems trust LLM outputs without verification',
    impact: 'Misinformation propagation, flawed decisions, hallucination risks',
    mitigation: 'Output validation, cross-referencing, user education, transparency',
    cweId: 'CWE-1021',
    source: 'OWASP'
  },
  {
    rank: 10,
    id: 'LLM10',
    name: 'Model Theft',
    severity: 'MEDIUM',
    description: 'Unauthorized access or extraction of proprietary models',
    impact: 'Intellectual property loss, competitive disadvantage, adversarial analysis',
    mitigation: 'Access controls, model encryption, API rate limiting, watermarking',
    cweId: 'CWE-693',
    source: 'OWASP'
  }
];

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

  // ============================================================================
  // NIST NVD - National Vulnerability Database
  // ============================================================================
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

  // ============================================================================
  // CISA KEV - Known Exploited Vulnerabilities
  // ============================================================================
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

  // ============================================================================
  // GitHub Security Advisories - Repository Vulnerabilities
  // ============================================================================
  async getGitHubAdvisories() {
    return this.getCachedOrFetch(
      'github',
      async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
          const response = await fetch(
            'https://api.github.com/advisories?per_page=10&severity=high,critical',
            {
              headers: {
                'User-Agent': 'ARPRI-Dashboard/1.0',
                'Accept': 'application/vnd.github+json'
              },
              signal: controller.signal
            }
          );

          clearTimeout(timeout);

          if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

          const advisories = await response.json();

          return advisories.slice(0, 10).map(advisory => ({
            id: advisory.ghsa_id || 'N/A',
            cveId: advisory.cve_id || null,
            severity: advisory.severity?.toUpperCase() || 'MEDIUM',
            summary: (advisory.summary || 'No summary').substring(0, 150),
            description: (advisory.description || 'No description').substring(0, 200),
            published: advisory.published_at || new Date().toISOString(),
            updated: advisory.updated_at || new Date().toISOString(),
            ecosystem: advisory.vulnerabilities?.[0]?.package?.ecosystem || 'Unknown',
            package: advisory.vulnerabilities?.[0]?.package?.name || 'Unknown',
            source: 'GitHub'
          }));
        } catch (error) {
          clearTimeout(timeout);
          throw error;
        }
      },
      () => this.generateFallbackGitHub()
    );
  }

  // ============================================================================
  // CVE Statistics - Industry Trends (Calculated from Real Data)
  // ============================================================================
  async getCVEStatistics() {
    return this.getCachedOrFetch(
      'cve-stats',
      async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        try {
          // Fetch recent CVEs to calculate statistics
          const response = await fetch(
            'https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=100',
            {
              headers: { 'User-Agent': 'ARPRI-Dashboard/1.0' },
              signal: controller.signal
            }
          );

          clearTimeout(timeout);

          if (!response.ok) throw new Error(`NVD Stats API error: ${response.status}`);

          const json = await response.json();
          const cves = json.vulnerabilities || [];

          // Calculate statistics
          const stats = {
            total: cves.length,
            bySeverity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNKNOWN: 0 },
            recent30Days: 0,
            withExploits: 0,
            avgCVSS: 0
          };

          let totalScore = 0;
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

          cves.forEach(vuln => {
            const severity = vuln.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'UNKNOWN';
            const score = vuln.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
            const published = new Date(vuln.cve?.published || 0);

            stats.bySeverity[severity] = (stats.bySeverity[severity] || 0) + 1;
            totalScore += score;

            if (published >= thirtyDaysAgo) {
              stats.recent30Days++;
            }
          });

          stats.avgCVSS = (totalScore / cves.length).toFixed(1);

          return {
            statistics: stats,
            timestamp: new Date().toISOString(),
            source: 'NVD'
          };
        } catch (error) {
          clearTimeout(timeout);
          throw error;
        }
      },
      () => this.generateFallbackStats()
    );
  }

  // ============================================================================
  // OWASP Top 10 for LLMs - AI/ML Security Risks (Static Authoritative Data)
  // ============================================================================
  getOWASPTop10() {
    return {
      data: OWASP_LLM_TOP_10,
      source: 'OWASP',
      version: '1.1',
      published: '2023-10-01',
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // Fallback Data Generators
  // ============================================================================
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

  generateFallbackGitHub() {
    return [
      { id: 'GHSA-xxxx-yyyy-zzzz', cveId: 'CVE-2024-1111', severity: 'HIGH', summary: 'Dependency vulnerability in AI package', description: 'Third-party AI library contains security flaw', published: new Date().toISOString(), ecosystem: 'npm', package: 'ai-library', source: 'Synthetic' }
    ];
  }

  generateFallbackStats() {
    return {
      statistics: {
        total: 100,
        bySeverity: { CRITICAL: 12, HIGH: 38, MEDIUM: 35, LOW: 15, UNKNOWN: 0 },
        recent30Days: 23,
        withExploits: 8,
        avgCVSS: 6.2
      },
      timestamp: new Date().toISOString(),
      source: 'Synthetic'
    };
  }

  // ============================================================================
  // Aggregate All Feeds
  // ============================================================================
  async aggregateFeeds() {
    const [nvd, cisa, github, stats] = await Promise.allSettled([
      this.getNVDData(),
      this.getCISAAdvisories(),
      this.getGitHubAdvisories(),
      this.getCVEStatistics()
    ]);

    // OWASP is synchronous static data
    const owasp = this.getOWASPTop10();

    return {
      nvd: nvd.status === 'fulfilled' ? nvd.value : { data: this.generateFallbackCVEs(), source: 'fallback' },
      cisa: cisa.status === 'fulfilled' ? cisa.value : { data: this.generateFallbackCISA(), source: 'fallback' },
      github: github.status === 'fulfilled' ? github.value : { data: this.generateFallbackGitHub(), source: 'fallback' },
      statistics: stats.status === 'fulfilled' ? stats.value : { data: this.generateFallbackStats(), source: 'fallback' },
      owasp: owasp,
      metadata: {
        sources: ['NIST NVD', 'CISA KEV', 'GitHub Security', 'OWASP'],
        lastUpdated: new Date().toISOString(),
        cacheDuration: '30 minutes'
      }
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

      case 'github':
        const githubData = await aggregator.getGitHubAdvisories();
        return res.status(200).json(githubData);

      case 'statistics':
        const statsData = await aggregator.getCVEStatistics();
        return res.status(200).json(statsData);

      case 'owasp':
        const owaspData = aggregator.getOWASPTop10();
        return res.status(200).json(owaspData);

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
