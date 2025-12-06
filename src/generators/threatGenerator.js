/**
 * Threat Generator
 * Generates realistic threat intelligence data with incidents, trends, and mitigations
 */

const THREAT_TYPES = [
  {
    name: 'Prompt Injection',
    baseRisk: 'CRITICAL',
    baseScore: 65,
    description: 'Malicious inputs designed to manipulate LLM behavior and bypass safety controls',
    mitigation: 'Input sanitization, output filtering, prompt hardening, behavioral monitoring',
    category: 'AI Security',
    frameworks: ['OWASP LLM Top 10', 'NIST AI RMF']
  },
  {
    name: 'Model Poisoning',
    baseRisk: 'HIGH',
    baseScore: 72,
    description: 'Adversarial manipulation of training data to compromise model integrity',
    mitigation: 'Input validation, anomaly detection, model versioning, secure training pipelines',
    category: 'AI Security',
    frameworks: ['MITRE ATLAS', 'NIST AI RMF']
  },
  {
    name: 'Data Exfiltration',
    baseRisk: 'MEDIUM',
    baseScore: 81,
    description: 'Unauthorized extraction of sensitive payment data via AI systems',
    mitigation: 'DLP controls, tokenization, access monitoring, encryption at rest',
    category: 'Data Security',
    frameworks: ['PCI DSS 4.0', 'GDPR']
  },
  {
    name: 'API Abuse',
    baseRisk: 'HIGH',
    baseScore: 74,
    description: 'Exploitation of AI service endpoints for fraud or denial of service',
    mitigation: 'Rate limiting, authentication, behavioral analysis, API gateway controls',
    category: 'Infrastructure',
    frameworks: ['OWASP API Top 10', 'Zero Trust']
  },
  {
    name: 'Shadow AI',
    baseRisk: 'HIGH',
    baseScore: 69,
    description: 'Unauthorized AI tools processing sensitive payment data',
    mitigation: 'AI inventory, CASB integration, policy enforcement, user training',
    category: 'Governance',
    frameworks: ['NIST AI RMF', 'NYDFS 500']
  },
  {
    name: 'Supply Chain Attack',
    baseRisk: 'MEDIUM',
    baseScore: 78,
    description: 'Compromised third-party models, libraries, or training data',
    mitigation: 'Model SBOM, vendor assessment, integrity verification, code signing',
    category: 'Supply Chain',
    frameworks: ['NIST SSDF', 'C2M2']
  },
  {
    name: 'Adversarial Examples',
    baseRisk: 'HIGH',
    baseScore: 70,
    description: 'Crafted inputs designed to fool ML models into incorrect classifications',
    mitigation: 'Input validation, adversarial training, ensemble methods, confidence thresholds',
    category: 'AI Security',
    frameworks: ['MITRE ATLAS', 'NIST AI RMF']
  },
  {
    name: 'Model Inversion',
    baseRisk: 'MEDIUM',
    baseScore: 76,
    description: 'Extracting training data or sensitive information from model outputs',
    mitigation: 'Differential privacy, output noise injection, query limits, federated learning',
    category: 'Privacy',
    frameworks: ['GDPR', 'NIST Privacy Framework']
  }
];

class ThreatGenerator {
  constructor() {
    this.incidentCounters = {};
    this.trendStates = {};

    // Initialize counters
    THREAT_TYPES.forEach(threat => {
      this.incidentCounters[threat.name] = Math.floor(Math.random() * 15) + 1;
      this.trendStates[threat.name] = ['up', 'down', 'stable'][Math.floor(Math.random() * 3)];
    });
  }

  /**
   * Generate current threat landscape
   */
  generateThreats() {
    return THREAT_TYPES.map(threat => {
      const variance = (Math.random() - 0.5) * 10;
      const score = Math.round(Math.max(50, Math.min(100, threat.baseScore + variance)));

      // Simulate incident changes
      const incidentChange = Math.floor(Math.random() * 5) - 2;
      this.incidentCounters[threat.name] = Math.max(0, this.incidentCounters[threat.name] + incidentChange);

      // Occasionally change trend
      if (Math.random() < 0.1) {
        this.trendStates[threat.name] = ['up', 'down', 'stable'][Math.floor(Math.random() * 3)];
      }

      return {
        name: threat.name,
        risk: this.calculateRiskLevel(score),
        score,
        trend: this.trendStates[threat.name],
        incidents: this.incidentCounters[threat.name],
        description: threat.description,
        mitigation: threat.mitigation,
        category: threat.category,
        frameworks: threat.frameworks,
        lastDetected: this.generateRecentTimestamp(),
        cveCount: threat.category === 'AI Security' ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 15) + 5
      };
    });
  }

  /**
   * Calculate risk level based on score
   */
  calculateRiskLevel(score) {
    if (score >= 80) return 'LOW';
    if (score >= 70) return 'MEDIUM';
    if (score >= 60) return 'HIGH';
    return 'CRITICAL';
  }

  /**
   * Generate recent timestamp
   */
  generateRecentTimestamp() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }

  /**
   * Generate active incidents
   */
  generateActiveIncidents() {
    const incidents = [];
    const count = Math.floor(Math.random() * 8) + 3;

    for (let i = 0; i < count; i++) {
      const threat = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
      const severity = ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)];
      const status = ['investigating', 'contained', 'mitigated', 'resolved'][Math.floor(Math.random() * 4)];

      incidents.push({
        id: `INC-${Date.now()}-${i}`,
        type: threat.name,
        severity,
        status,
        affectedSystems: Math.floor(Math.random() * 5) + 1,
        detectedAt: this.generateRecentTimestamp(),
        description: `${threat.name} detected in ${this.getRandomSystem()}`,
        assignedTo: this.getRandomAnalyst()
      });
    }

    return incidents.sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));
  }

  /**
   * Generate threat trend data
   */
  generateThreatTrends(days = 30) {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      trends.push({
        date: date.toISOString().split('T')[0],
        total: Math.floor(Math.random() * 50) + 20,
        critical: Math.floor(Math.random() * 5) + 1,
        high: Math.floor(Math.random() * 15) + 5,
        medium: Math.floor(Math.random() * 20) + 10,
        blocked: Math.floor(Math.random() * 45) + 15,
        mitigated: Math.floor(Math.random() * 40) + 10
      });
    }

    return trends;
  }

  /**
   * Get random system name
   */
  getRandomSystem() {
    const systems = [
      'Payment Gateway',
      'Fraud Detection Engine',
      'AI Orchestrator',
      'Model Registry',
      'Token Vault',
      'API Gateway',
      'Transaction Processor',
      'Risk Scoring Service'
    ];
    return systems[Math.floor(Math.random() * systems.length)];
  }

  /**
   * Get random analyst name
   */
  getRandomAnalyst() {
    const analysts = [
      'Security Team Alpha',
      'SOC Analyst 1',
      'SOC Analyst 2',
      'Threat Intel Team',
      'Incident Response',
      'AI Security Team'
    ];
    return analysts[Math.floor(Math.random() * analysts.length)];
  }
}

// Singleton instance
const threatGenerator = new ThreatGenerator();

export default threatGenerator;
