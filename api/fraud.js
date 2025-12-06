/**
 * Fraud API Endpoint
 * Returns fraud detection metrics, patterns, and geographic data
 */

import fraudGenerator from '../src/generators/fraudGenerator.js';

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
    const { type, hours } = req.query;
    const numHours = parseInt(hours) || 24;

    switch (type) {
      case 'realtime':
        return res.status(200).json(fraudGenerator.generateRealTimeMetrics());

      case 'patterns':
        return res.status(200).json(fraudGenerator.generateFraudPatterns());

      case 'geographic':
        return res.status(200).json(fraudGenerator.generateGeographicDistribution());

      case 'velocity':
        return res.status(200).json(fraudGenerator.generateVelocityMetrics());

      case 'merchants':
        return res.status(200).json(fraudGenerator.generateMerchantRisks());

      case 'decisions':
        return res.status(200).json(fraudGenerator.generateDecisionBreakdown());

      case 'trends':
        return res.status(200).json(fraudGenerator.generateHourlyTrends(numHours));

      default:
        // Return comprehensive fraud data
        return res.status(200).json({
          realtime: fraudGenerator.generateRealTimeMetrics(),
          patterns: fraudGenerator.generateFraudPatterns(),
          geographic: fraudGenerator.generateGeographicDistribution(),
          velocity: fraudGenerator.generateVelocityMetrics(),
          decisions: fraudGenerator.generateDecisionBreakdown()
        });
    }
  } catch (error) {
    console.error('Fraud API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
