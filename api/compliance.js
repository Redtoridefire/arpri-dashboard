/**
 * Compliance Framework Tracker API Endpoint
 * Returns comprehensive AI governance and regulatory compliance tracking
 */

const FRAMEWORKS = [
  {
    id: 'nist-ai-rmf',
    framework: 'NIST AI RMF',
    category: 'AI Governance',
    description: 'AI Risk Management Framework for trustworthy AI systems',
    baseCoverage: 94,
    status: 'active',
    priority: 'critical',
    totalControls: 45,
    implementedControls: 42,
    findings: 2,
    owner: 'AI Ethics Team',
    documentationUrl: 'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf',
    keyRequirements: ['Risk Assessment', 'Model Validation', 'Bias Testing', 'Monitoring']
  },
  {
    id: 'eu-ai-act',
    framework: 'EU AI Act',
    category: 'AI Regulation',
    description: 'European Union AI regulatory framework for high-risk AI systems',
    baseCoverage: 78,
    status: 'in-progress',
    priority: 'critical',
    totalControls: 52,
    implementedControls: 41,
    findings: 8,
    owner: 'Legal/Compliance',
    documentationUrl: 'https://artificialintelligenceact.eu/',
    keyRequirements: ['Risk Classification', 'Documentation', 'Human Oversight', 'Transparency']
  },
  {
    id: 'pci-dss',
    framework: 'PCI DSS 4.0',
    category: 'Payment Security',
    description: 'Payment Card Industry Data Security Standard',
    baseCoverage: 98,
    status: 'active',
    priority: 'critical',
    totalControls: 35,
    implementedControls: 34,
    findings: 1,
    owner: 'Security Team',
    documentationUrl: 'https://www.pcisecuritystandards.org/',
    keyRequirements: ['Network Security', 'Access Control', 'Monitoring', 'Testing']
  },
  {
    id: 'gdpr',
    framework: 'GDPR/CCPA',
    category: 'Data Privacy',
    description: 'General Data Protection Regulation and California Consumer Privacy Act',
    baseCoverage: 87,
    status: 'active',
    priority: 'high',
    totalControls: 42,
    implementedControls: 37,
    findings: 5,
    owner: 'Privacy Officer',
    documentationUrl: 'https://gdpr.eu/',
    keyRequirements: ['Data Minimization', 'Consent Management', 'Right to Erasure', 'Privacy by Design']
  },
  {
    id: 'nydfs-500',
    framework: 'NYDFS 23 NYCRR 500',
    category: 'Financial Services',
    description: 'New York Department of Financial Services Cybersecurity Regulation',
    baseCoverage: 96,
    status: 'active',
    priority: 'critical',
    totalControls: 28,
    implementedControls: 27,
    findings: 3,
    owner: 'CISO',
    documentationUrl: 'https://www.dfs.ny.gov/industry_guidance/cybersecurity',
    keyRequirements: ['Cybersecurity Program', 'Risk Assessment', 'Penetration Testing', 'Incident Response']
  },
  {
    id: 'sox',
    framework: 'SOX (Sarbanes-Oxley)',
    category: 'Financial Compliance',
    description: 'Corporate financial reporting and internal controls',
    baseCoverage: 99,
    status: 'active',
    priority: 'high',
    totalControls: 18,
    implementedControls: 18,
    findings: 0,
    owner: 'Finance/Audit',
    documentationUrl: 'https://www.sox-online.com/',
    keyRequirements: ['Internal Controls', 'Financial Accuracy', 'Audit Trail', 'Change Management']
  },
  {
    id: 'iso-27001',
    framework: 'ISO/IEC 27001:2022',
    category: 'Information Security',
    description: 'Information security management system standard',
    baseCoverage: 91,
    status: 'active',
    priority: 'high',
    totalControls: 93,
    implementedControls: 85,
    findings: 3,
    owner: 'InfoSec Team',
    documentationUrl: 'https://www.iso.org/standard/27001',
    keyRequirements: ['ISMS', 'Risk Treatment', 'Asset Management', 'Access Control']
  },
  {
    id: 'soc2',
    framework: 'SOC 2 Type II',
    category: 'Service Organization',
    description: 'Service Organization Control for security, availability, and confidentiality',
    baseCoverage: 95,
    status: 'active',
    priority: 'high',
    totalControls: 64,
    implementedControls: 61,
    findings: 1,
    owner: 'Operations',
    documentationUrl: 'https://www.aicpa.org/soc',
    keyRequirements: ['Security', 'Availability', 'Processing Integrity', 'Confidentiality']
  },
  {
    id: 'owasp-llm',
    framework: 'OWASP Top 10 for LLM',
    category: 'AI Security',
    description: 'Security controls for Large Language Model applications',
    baseCoverage: 82,
    status: 'in-progress',
    priority: 'critical',
    totalControls: 10,
    implementedControls: 8,
    findings: 4,
    owner: 'ML Security',
    documentationUrl: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
    keyRequirements: ['Prompt Injection Defense', 'Output Validation', 'Training Data Security', 'Plugin Security']
  },
  {
    id: 'nist-csf',
    framework: 'NIST Cybersecurity Framework',
    category: 'Cybersecurity',
    description: 'Framework for improving critical infrastructure cybersecurity',
    baseCoverage: 93,
    status: 'active',
    priority: 'high',
    totalControls: 108,
    implementedControls: 100,
    findings: 2,
    owner: 'Security Team',
    documentationUrl: 'https://www.nist.gov/cyberframework',
    keyRequirements: ['Identify', 'Protect', 'Detect', 'Respond', 'Recover']
  }
];

function generateComplianceStatus() {
  const now = Date.now();
  return FRAMEWORKS.map(fw => {
    const lastAuditDays = Math.floor(Math.random() * 60) + 20;
    const nextAuditDays = 180 - lastAuditDays;
    const coverage = Math.min(100, fw.baseCoverage + Math.floor(Math.random() * 5));

    return {
      ...fw,
      coverage,
      coveragePercentage: `${coverage}%`,
      lastAudit: new Date(now - lastAuditDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextAudit: new Date(now + nextAuditDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysUntilAudit: nextAuditDays,
      findings: fw.findings + Math.floor(Math.random() * 2),
      progress: Math.floor((fw.implementedControls / fw.totalControls) * 100),
      lastUpdated: new Date(now - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  });
}

function getComplianceSummary() {
  const frameworks = generateComplianceStatus();
  const totalControls = frameworks.reduce((sum, fw) => sum + fw.totalControls, 0);
  const implementedControls = frameworks.reduce((sum, fw) => sum + fw.implementedControls, 0);
  const totalFindings = frameworks.reduce((sum, fw) => sum + fw.findings, 0);
  const criticalFrameworks = frameworks.filter(fw => fw.priority === 'critical').length;

  return {
    totalFrameworks: frameworks.length,
    activeFrameworks: frameworks.filter(fw => fw.status === 'active').length,
    inProgressFrameworks: frameworks.filter(fw => fw.status === 'in-progress').length,
    criticalFrameworks,
    totalControls,
    implementedControls,
    controlsPercentage: Math.floor((implementedControls / totalControls) * 100),
    totalFindings,
    averageCoverage: Math.floor(frameworks.reduce((sum, fw) => sum + fw.coverage, 0) / frameworks.length)
  };
}

function getCategoryBreakdown() {
  const categories = {};
  FRAMEWORKS.forEach(fw => {
    if (!categories[fw.category]) {
      categories[fw.category] = { frameworks: 0, controls: 0, implemented: 0, findings: 0 };
    }
    categories[fw.category].frameworks++;
    categories[fw.category].controls += fw.totalControls;
    categories[fw.category].implemented += fw.implementedControls;
    categories[fw.category].findings += fw.findings;
  });

  return Object.entries(categories).map(([name, stats]) => ({
    category: name,
    frameworks: stats.frameworks,
    coverage: Math.floor((stats.implemented / stats.controls) * 100),
    findings: stats.findings
  }));
}

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
      case 'status':
        return res.status(200).json(generateComplianceStatus());

      case 'summary':
        return res.status(200).json(getComplianceSummary());

      case 'categories':
        return res.status(200).json(getCategoryBreakdown());

      default:
        // Return all data
        return res.status(200).json({
          frameworks: generateComplianceStatus(),
          summary: getComplianceSummary(),
          categories: getCategoryBreakdown()
        });
    }
  } catch (error) {
    console.error('Compliance Framework Tracker API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
