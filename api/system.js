/**
 * System API Endpoint
 * Returns system status, infrastructure metrics, and performance data
 */

import systemStatusGenerator from '../src/generators/systemStatusGenerator.js';

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
      case 'status':
        return res.status(200).json(systemStatusGenerator.generateSystemStatus());

      case 'infrastructure':
        return res.status(200).json(systemStatusGenerator.generateInfrastructureMetrics());

      case 'incidents':
        return res.status(200).json(systemStatusGenerator.generateIncidents(numDays));

      case 'uptime':
        return res.status(200).json(systemStatusGenerator.generateUptimeStats(numDays));

      case 'sla':
        return res.status(200).json(systemStatusGenerator.generateSLAMetrics());

      case 'performance':
        return res.status(200).json(systemStatusGenerator.generatePerformanceMetrics());

      default:
        // Return comprehensive system data
        return res.status(200).json({
          status: systemStatusGenerator.generateSystemStatus(),
          infrastructure: systemStatusGenerator.generateInfrastructureMetrics(),
          sla: systemStatusGenerator.generateSLAMetrics(),
          performance: systemStatusGenerator.generatePerformanceMetrics(),
          incidents: systemStatusGenerator.generateIncidents(7)
        });
    }
  } catch (error) {
    console.error('System API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
