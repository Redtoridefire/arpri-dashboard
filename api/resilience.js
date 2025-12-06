/**
 * Resilience API Endpoint
 * Returns resilience scores, time series, and radar data
 */

import riskScoreGenerator from '../src/generators/riskScoreGenerator.js';

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
        return res.status(200).json(riskScoreGenerator.generateResilienceScore());

      case 'timeseries':
        return res.status(200).json(riskScoreGenerator.generateTimeSeries());

      case 'distribution':
        return res.status(200).json(riskScoreGenerator.generateRiskDistribution());

      case 'radar':
        return res.status(200).json(riskScoreGenerator.generateRadarData());

      default:
        // Return all data if no type specified
        return res.status(200).json({
          score: riskScoreGenerator.generateResilienceScore(),
          timeseries: riskScoreGenerator.generateTimeSeries(),
          distribution: riskScoreGenerator.generateRiskDistribution(),
          radar: riskScoreGenerator.generateRadarData()
        });
    }
  } catch (error) {
    console.error('Resilience API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
