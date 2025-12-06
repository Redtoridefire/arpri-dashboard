/**
 * Threats API Endpoint
 * Returns threat intelligence data
 */

const THREAT_TYPES = [
  { name: 'Prompt Injection', risk: 'CRITICAL', baseScore: 65, incidents: 8, description: 'Malicious inputs designed to manipulate LLM behavior', mitigation: 'Input sanitization, output filtering, prompt hardening' },
  { name: 'Model Poisoning', risk: 'HIGH', baseScore: 72, incidents: 3, description: 'Adversarial manipulation of training data', mitigation: 'Input validation, anomaly detection, model versioning' },
  { name: 'Data Exfiltration', risk: 'MEDIUM', baseScore: 81, incidents: 1, description: 'Unauthorized extraction of sensitive data', mitigation: 'DLP controls, tokenization, access monitoring' },
  { name: 'API Abuse', risk: 'HIGH', baseScore: 74, incidents: 5, description: 'Exploitation of AI service endpoints', mitigation: 'Rate limiting, authentication, behavioral analysis' },
  { name: 'Shadow AI', risk: 'HIGH', baseScore: 69, incidents: 12, description: 'Unauthorized AI tools processing payment data', mitigation: 'AI inventory, CASB integration, policy enforcement' },
  { name: 'Supply Chain Attack', risk: 'MEDIUM', baseScore: 78, incidents: 2, description: 'Compromised third-party models', mitigation: 'Model SBOM, vendor assessment, integrity verification' },
  { name: 'Adversarial Examples', risk: 'HIGH', baseScore: 70, incidents: 6, description: 'Inputs designed to fool ML models', mitigation: 'Input validation, adversarial training, monitoring' },
  { name: 'Model Inversion', risk: 'MEDIUM', baseScore: 76, incidents: 4, description: 'Extracting training data from models', mitigation: 'Differential privacy, access controls, monitoring' }
];

function generateThreats() {
  const trends = ['up', 'down', 'stable'];
  return THREAT_TYPES.map(threat => ({
    ...threat,
    score: threat.baseScore + Math.floor(Math.random() * 10) - 5,
    trend: trends[Math.floor(Math.random() * trends.length)],
    incidents: threat.incidents + Math.floor(Math.random() * 3)
  }));
}

function generateActiveIncidents() {
  return [
    { id: 1, type: 'Prompt Injection', severity: 'CRITICAL', status: 'investigating', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, type: 'Shadow AI', severity: 'HIGH', status: 'mitigated', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, type: 'API Abuse', severity: 'MEDIUM', status: 'monitoring', timestamp: new Date(Date.now() - 10800000).toISOString() }
  ];
}

function generateThreatTrends(days = 30) {
  const trends = [];
  for (let i = days; i >= 0; i--) {
    trends.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      incidents: Math.floor(Math.random() * 15) + 5,
      blocked: Math.floor(Math.random() * 12) + 3,
      investigating: Math.floor(Math.random() * 5)
    });
  }
  return trends;
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
    const { type, days = 30 } = req.query;

    switch (type) {
      case 'list':
        return res.status(200).json(generateThreats());

      case 'incidents':
        return res.status(200).json(generateActiveIncidents());

      case 'trends':
        return res.status(200).json(generateThreatTrends(parseInt(days)));

      default:
        // Return all data
        return res.status(200).json({
          threats: generateThreats(),
          incidents: generateActiveIncidents(),
          trends: generateThreatTrends(30)
        });
    }
  } catch (error) {
    console.error('Threats API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
