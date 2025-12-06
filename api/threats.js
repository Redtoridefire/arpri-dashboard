/**
 * Threats API Endpoint
 * Returns threat intelligence, incidents, and trends
 */

import threatGenerator from '../src/generators/threatGenerator.js';

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
    const { type, days } = req.query;
    const numDays = parseInt(days) || 30;

    switch (type) {
      case 'list':
        return res.status(200).json(threatGenerator.generateThreats());

      case 'incidents':
        return res.status(200).json(threatGenerator.generateActiveIncidents());

      case 'trends':
        return res.status(200).json(threatGenerator.generateThreatTrends(numDays));

      default:
        // Return comprehensive threat data
        return res.status(200).json({
          threats: threatGenerator.generateThreats(),
          incidents: threatGenerator.generateActiveIncidents(),
          trends: threatGenerator.generateThreatTrends(7)
        });
    }
  } catch (error) {
    console.error('Threats API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
