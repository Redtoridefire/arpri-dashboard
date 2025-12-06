/**
 * Compliance API Endpoint
 * Returns compliance framework status and findings
 */

const FRAMEWORKS = [
  { framework: 'NIST AI RMF', baseCoverage: 94, status: 'compliant', findings: 2 },
  { framework: 'PCI DSS 4.0', baseCoverage: 98, status: 'compliant', findings: 1 },
  { framework: 'NYDFS 500', baseCoverage: 96, status: 'compliant', findings: 3 },
  { framework: 'SOX', baseCoverage: 99, status: 'compliant', findings: 0 },
  { framework: 'GDPR/CCPA', baseCoverage: 87, status: 'partial', findings: 5 },
  { framework: 'OCC Guidelines', baseCoverage: 92, status: 'compliant', findings: 2 },
  { framework: 'ISO 27001', baseCoverage: 91, status: 'compliant', findings: 3 },
  { framework: 'SOC 2 Type II', baseCoverage: 95, status: 'compliant', findings: 1 }
];

function generateComplianceStatus() {
  const now = Date.now();
  return FRAMEWORKS.map(fw => {
    const lastAuditDays = Math.floor(Math.random() * 60) + 20;
    const nextAuditDays = 180 - lastAuditDays;

    return {
      framework: fw.framework,
      status: fw.status,
      coverage: Math.min(100, fw.baseCoverage + Math.floor(Math.random() * 5)),
      lastAudit: new Date(now - lastAuditDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      nextAudit: new Date(now + nextAuditDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      findings: fw.findings + Math.floor(Math.random() * 2)
    };
  });
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

      default:
        // Return all data
        return res.status(200).json({
          status: generateComplianceStatus()
        });
    }
  } catch (error) {
    console.error('Compliance API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
