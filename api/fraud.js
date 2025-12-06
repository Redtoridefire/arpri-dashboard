/**
 * Fraud API Endpoint
 * Returns fraud detection metrics
 */

function generateRealTimeMetrics() {
  return {
    transactionsPerSecond: Math.floor(Math.random() * 1000) + 45000,
    fraudAttempts: Math.floor(Math.random() * 50) + 1200,
    blockedRate: +(99 + Math.random() * 0.5).toFixed(2),
    totalDecisions: Math.floor(Math.random() * 10000) + 890000,
    humanEscalations: Math.floor(Math.random() * 20) + 230,
    avgResponseTime: Math.floor(Math.random() * 5) + 12
  };
}

function generateFraudPatterns() {
  return [
    { pattern: 'Card Testing', prevalence: Math.floor(Math.random() * 10) + 28, blockedRate: 98.5, severity: 'HIGH' },
    { pattern: 'Account Takeover', prevalence: Math.floor(Math.random() * 8) + 18, blockedRate: 97.2, severity: 'CRITICAL' },
    { pattern: 'Synthetic Identity', prevalence: Math.floor(Math.random() * 5) + 15, blockedRate: 96.8, severity: 'HIGH' },
    { pattern: 'Friendly Fraud', prevalence: Math.floor(Math.random() * 8) + 22, blockedRate: 89.3, severity: 'MEDIUM' },
    { pattern: 'BIN Attack', prevalence: Math.floor(Math.random() * 4) + 10, blockedRate: 99.1, severity: 'HIGH' }
  ];
}

function generateGeographicDistribution() {
  return [
    { region: 'North America', transactions: Math.floor(Math.random() * 50000) + 250000, fraudRate: +(0.5 + Math.random() * 0.3).toFixed(2) },
    { region: 'Europe', transactions: Math.floor(Math.random() * 40000) + 180000, fraudRate: +(0.4 + Math.random() * 0.2).toFixed(2) },
    { region: 'Asia Pacific', transactions: Math.floor(Math.random() * 60000) + 320000, fraudRate: +(0.6 + Math.random() * 0.4).toFixed(2) },
    { region: 'Latin America', transactions: Math.floor(Math.random() * 30000) + 120000, fraudRate: +(0.8 + Math.random() * 0.5).toFixed(2) },
    { region: 'Middle East', transactions: Math.floor(Math.random() * 25000) + 95000, fraudRate: +(0.7 + Math.random() * 0.4).toFixed(2) },
    { region: 'Africa', transactions: Math.floor(Math.random() * 20000) + 65000, fraudRate: +(0.9 + Math.random() * 0.6).toFixed(2) }
  ];
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
      case 'realtime':
        return res.status(200).json(generateRealTimeMetrics());

      case 'patterns':
        return res.status(200).json(generateFraudPatterns());

      case 'geographic':
        return res.status(200).json(generateGeographicDistribution());

      default:
        // Return all data
        return res.status(200).json({
          realtime: generateRealTimeMetrics(),
          patterns: generateFraudPatterns(),
          geographic: generateGeographicDistribution()
        });
    }
  } catch (error) {
    console.error('Fraud API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
