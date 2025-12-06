/**
 * Models API Endpoint
 * Returns AI model inventory, telemetry, and performance data
 */

import modelTelemetryGenerator from '../src/generators/modelTelemetryGenerator.js';

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
    const { type, model, days } = req.query;
    const numDays = parseInt(days) || 30;

    switch (type) {
      case 'list':
        return res.status(200).json(modelTelemetryGenerator.generateModels());

      case 'drift':
        return res.status(200).json(modelTelemetryGenerator.generateDriftAnalysis());

      case 'metrics':
        return res.status(200).json(modelTelemetryGenerator.generateRealTimeMetrics());

      case 'trends':
        if (!model) {
          return res.status(400).json({ error: 'Model name required for trends' });
        }
        return res.status(200).json(modelTelemetryGenerator.generatePerformanceTrends(model, numDays));

      case 'sbom':
        if (!model) {
          return res.status(400).json({ error: 'Model name required for SBOM' });
        }
        return res.status(200).json(modelTelemetryGenerator.generateModelSBOM(model));

      default:
        // Return comprehensive model data
        return res.status(200).json({
          models: modelTelemetryGenerator.generateModels(),
          drift: modelTelemetryGenerator.generateDriftAnalysis(),
          metrics: modelTelemetryGenerator.generateRealTimeMetrics()
        });
    }
  } catch (error) {
    console.error('Models API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
