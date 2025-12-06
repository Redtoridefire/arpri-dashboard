/**
 * Resilience API Endpoint
 * Returns resilience scores, time series, and radar data
 */

// Inline generator logic for Vercel serverless function
function generateResilienceScore() {
  const currentScore = Math.floor(Math.random() * 15) + 75; // 75-90
  const previousScore = currentScore - Math.floor(Math.random() * 5) + 2;

  return {
    overall: currentScore,
    previousMonth: previousScore,
    categories: {
      aiGovernance: { score: Math.floor(Math.random() * 15) + 78, trend: 'up', change: 3 },
      fraudDetection: { score: Math.floor(Math.random() * 10) + 82, trend: 'up', change: 2 },
      dataPrivacy: { score: Math.floor(Math.random() * 15) + 68, trend: 'down', change: -2 },
      operationalResilience: { score: Math.floor(Math.random() * 12) + 75, trend: 'up', change: 4 },
      supplyChainSecurity: { score: Math.floor(Math.random() * 15) + 65, trend: 'stable', change: 0 },
      compliancePosture: { score: Math.floor(Math.random() * 10) + 85, trend: 'up', change: 1 }
    },
    lastUpdated: new Date().toISOString()
  };
}

function generateTimeSeries() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    riskScore: Math.floor(Math.random() * 15) + 70 + i,
    incidents: Math.floor(Math.random() * 10) + 3,
    fraudBlocked: +(98 + Math.random() * 1.5).toFixed(1),
    uptime: +(99.9 + Math.random() * 0.09).toFixed(2),
    aiDecisions: Math.floor(750000 + Math.random() * 200000)
  }));
}

function generateRiskDistribution() {
  return [
    { name: 'Critical', value: Math.floor(Math.random() * 10) + 5, color: '#ff4757' },
    { name: 'High', value: Math.floor(Math.random() * 15) + 18, color: '#ffa502' },
    { name: 'Medium', value: Math.floor(Math.random() * 15) + 35, color: '#2ed573' },
    { name: 'Low', value: Math.floor(Math.random() * 10) + 22, color: '#1e90ff' }
  ];
}

function generateRadarData() {
  return [
    { category: 'AI Governance', score: Math.floor(Math.random() * 15) + 78, fullMark: 100 },
    { category: 'Fraud Detection', score: Math.floor(Math.random() * 15) + 80, fullMark: 100 },
    { category: 'Data Privacy', score: Math.floor(Math.random() * 20) + 65, fullMark: 100 },
    { category: 'Ops Resilience', score: Math.floor(Math.random() * 15) + 75, fullMark: 100 },
    { category: 'Supply Chain', score: Math.floor(Math.random() * 20) + 62, fullMark: 100 },
    { category: 'Compliance', score: Math.floor(Math.random() * 10) + 85, fullMark: 100 }
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

    // Handle different data types
    switch (type) {
      case 'score':
        return res.status(200).json(generateResilienceScore());

      case 'timeseries':
        return res.status(200).json(generateTimeSeries());

      case 'distribution':
        return res.status(200).json(generateRiskDistribution());

      case 'radar':
        return res.status(200).json(generateRadarData());

      default:
        // Return all data if no type specified
        return res.status(200).json({
          score: generateResilienceScore(),
          timeseries: generateTimeSeries(),
          distribution: generateRiskDistribution(),
          radar: generateRadarData()
        });
    }
  } catch (error) {
    console.error('Resilience API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
