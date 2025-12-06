/**
 * Models API Endpoint
 * Returns AI model inventory and telemetry data
 */

const MODEL_TEMPLATES = [
  { name: 'FraudNet-v3.2', type: 'Detection', status: 'production', riskTier: 'high', baseAccuracy: 99.2, baseLatency: 12, baseDrift: 2.1 },
  { name: 'TokenAuth-LLM', type: 'Authentication', status: 'production', riskTier: 'critical', baseAccuracy: 99.8, baseLatency: 8, baseDrift: 1.8 },
  { name: 'TxnClassifier', type: 'Classification', status: 'production', riskTier: 'medium', baseAccuracy: 97.5, baseLatency: 15, baseDrift: 3.4 },
  { name: 'RiskScore-Agent', type: 'Agentic', status: 'staging', riskTier: 'critical', baseAccuracy: 98.9, baseLatency: 45, baseDrift: 1.2 },
  { name: 'CustomerIntent', type: 'NLP', status: 'production', riskTier: 'low', baseAccuracy: 94.2, baseLatency: 22, baseDrift: 4.7 },
  { name: 'AnomalyHunter', type: 'Detection', status: 'production', riskTier: 'high', baseAccuracy: 98.1, baseLatency: 18, baseDrift: 2.9 },
  { name: 'SentimentAnalyzer', type: 'NLP', status: 'production', riskTier: 'low', baseAccuracy: 92.8, baseLatency: 25, baseDrift: 5.2 },
  { name: 'BehaviorPredictor', type: 'Prediction', status: 'staging', riskTier: 'medium', baseAccuracy: 96.4, baseLatency: 32, baseDrift: 3.8 }
];

function generateModels() {
  return MODEL_TEMPLATES.map(model => ({
    name: model.name,
    type: model.type,
    status: model.status,
    riskTier: model.riskTier,
    accuracy: +(model.baseAccuracy + (Math.random() - 0.5) * 2).toFixed(1),
    latency: Math.floor(model.baseLatency + (Math.random() - 0.5) * 6),
    driftScore: +(model.baseDrift + (Math.random() - 0.5) * 1.5).toFixed(1),
    lastValidation: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
      case 'list':
        return res.status(200).json(generateModels());

      default:
        // Return all data
        return res.status(200).json({
          models: generateModels()
        });
    }
  } catch (error) {
    console.error('Models API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
