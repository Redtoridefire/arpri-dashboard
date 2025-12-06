/**
 * Feed Aggregator
 * Aggregates data from multiple external public security feeds
 * Gracefully falls back to synthetic data if feeds are unavailable
 */

class FeedAggregator {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Get cached data or fetch fresh
   */
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

  /**
   * Aggregate all feeds
   */
  async aggregateFeeds() {
    const [nvd, mitre, cisa, cloudStatus] = await Promise.allSettled([
      this.getNVDData(),
      this.getMITREData(),
      this.getCISAAdvisories(),
      this.getCloudStatus()
    ]);

    return {
      nvd: nvd.status === 'fulfilled' ? nvd.value : { data: [], source: 'fallback' },
      mitre: mitre.status === 'fulfilled' ? mitre.value : { data: [], source: 'fallback' },
      cisa: cisa.status === 'fulfilled' ? cisa.value : { data: [], source: 'fallback' },
      cloudStatus: cloudStatus.status === 'fulfilled' ? cloudStatus.value : { data: {}, source: 'fallback' },
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get NVD CVE data
   */
  async getNVDData() {
    return this.getCachedOrFetch(
      'nvd',
      async () => {
        // NVD API v2.0 - Get recent CVEs related to AI/ML
        const response = await fetch(
          'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=artificial+intelligence&resultsPerPage=20',
          {
            headers: { 'User-Agent': 'ARPRI-Dashboard/1.0' },
            signal: AbortSignal.timeout(10000)
          }
        );

        if (!response.ok) throw new Error(`NVD API error: ${response.status}`);

        const json = await response.json();
        const cves = json.vulnerabilities || [];

        return cves.slice(0, 10).map(vuln => ({
          id: vuln.cve?.id || 'N/A',
          description: vuln.cve?.descriptions?.[0]?.value || 'No description',
          severity: vuln.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'UNKNOWN',
          score: vuln.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0,
          published: vuln.cve?.published || new Date().toISOString(),
          source: 'NVD'
        }));
      },
      () => this.generateFallbackCVEs()
    );
  }

  /**
   * Get MITRE ATT&CK data
   */
  async getMITREData() {
    return this.getCachedOrFetch(
      'mitre',
      async () => {
        // MITRE ATT&CK Enterprise Matrix
        const response = await fetch(
          'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json',
          {
            signal: AbortSignal.timeout(10000)
          }
        );

        if (!response.ok) throw new Error(`MITRE API error: ${response.status}`);

        const data = await response.json();
        const techniques = data.objects?.filter(obj =>
          obj.type === 'attack-pattern' &&
          obj.x_mitre_platforms?.includes('PRE')
        ).slice(0, 15) || [];

        return techniques.map(tech => ({
          id: tech.external_references?.[0]?.external_id || 'N/A',
          name: tech.name,
          description: tech.description?.substring(0, 200) + '...' || '',
          tactics: tech.kill_chain_phases?.map(p => p.phase_name) || [],
          source: 'MITRE ATT&CK'
        }));
      },
      () => this.generateFallbackMITRE()
    );
  }

  /**
   * Get CISA advisories
   */
  async getCISAAdvisories() {
    return this.getCachedOrFetch(
      'cisa',
      async () => {
        // CISA Known Exploited Vulnerabilities
        const response = await fetch(
          'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
          {
            signal: AbortSignal.timeout(10000)
          }
        );

        if (!response.ok) throw new Error(`CISA API error: ${response.status}`);

        const data = await response.json();
        const vulnerabilities = data.vulnerabilities || [];

        return vulnerabilities.slice(0, 10).map(vuln => ({
          cve: vuln.cveID,
          name: vuln.vulnerabilityName,
          description: vuln.shortDescription,
          dateAdded: vuln.dateAdded,
          dueDate: vuln.dueDate,
          source: 'CISA KEV'
        }));
      },
      () => this.generateFallbackCISA()
    );
  }

  /**
   * Get cloud provider status
   */
  async getCloudStatus() {
    return this.getCachedOrFetch(
      'cloud',
      async () => {
        // For now, return synthetic data as cloud status APIs require auth
        // In production, integrate with AWS Health API, Azure Status, etc.
        return this.generateFallbackCloudStatus();
      },
      () => this.generateFallbackCloudStatus()
    );
  }

  /**
   * Fallback: Generate synthetic CVEs
   */
  generateFallbackCVEs() {
    const severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const cves = [];

    for (let i = 0; i < 10; i++) {
      const year = 2024;
      const num = 10000 + Math.floor(Math.random() * 50000);
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const score = severity === 'CRITICAL' ? 9 + Math.random() :
                    severity === 'HIGH' ? 7 + Math.random() * 2 :
                    severity === 'MEDIUM' ? 4 + Math.random() * 3 :
                    Math.random() * 4;

      cves.push({
        id: `CVE-${year}-${num}`,
        description: `AI/ML related security vulnerability affecting machine learning frameworks`,
        severity,
        score: Math.round(score * 10) / 10,
        published: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Synthetic'
      });
    }

    return cves;
  }

  /**
   * Fallback: Generate synthetic MITRE techniques
   */
  generateFallbackMITRE() {
    const techniques = [
      {
        id: 'T1587.001',
        name: 'Develop Capabilities: Malware',
        description: 'Adversaries may develop malware and malware components that can be used during targeting...',
        tactics: ['Resource Development'],
        source: 'Synthetic'
      },
      {
        id: 'T1595.002',
        name: 'Active Scanning: Vulnerability Scanning',
        description: 'Adversaries may scan victims for vulnerabilities that can be used during targeting...',
        tactics: ['Reconnaissance'],
        source: 'Synthetic'
      },
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        description: 'Adversaries may attempt to exploit a weakness in an Internet-facing host or system...',
        tactics: ['Initial Access'],
        source: 'Synthetic'
      }
    ];

    return techniques;
  }

  /**
   * Fallback: Generate synthetic CISA advisories
   */
  generateFallbackCISA() {
    const advisories = [];

    for (let i = 0; i < 5; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const dateAdded = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + (21 - daysAgo) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      advisories.push({
        cve: `CVE-2024-${10000 + i}`,
        name: `Critical Vulnerability in AI Framework`,
        description: `Security vulnerability allowing unauthorized access to AI models`,
        dateAdded,
        dueDate,
        source: 'Synthetic'
      });
    }

    return advisories;
  }

  /**
   * Fallback: Generate synthetic cloud status
   */
  generateFallbackCloudStatus() {
    return {
      aws: {
        status: Math.random() > 0.1 ? 'operational' : 'degraded',
        incidents: Math.floor(Math.random() * 3),
        regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
        source: 'Synthetic'
      },
      azure: {
        status: Math.random() > 0.1 ? 'operational' : 'degraded',
        incidents: Math.floor(Math.random() * 2),
        regions: ['eastus', 'westus2', 'westeurope'],
        source: 'Synthetic'
      },
      gcp: {
        status: Math.random() > 0.1 ? 'operational' : 'degraded',
        incidents: Math.floor(Math.random() * 2),
        regions: ['us-central1', 'us-west1', 'europe-west1'],
        source: 'Synthetic'
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Singleton instance
const feedAggregator = new FeedAggregator();

export default feedAggregator;
