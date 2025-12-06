/**
 * Compliance API Endpoint
 * Returns compliance framework status, findings, and audit data
 */

import complianceGenerator from '../src/generators/complianceGenerator.js';

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
    const { type, months } = req.query;
    const numMonths = parseInt(months) || 12;

    switch (type) {
      case 'status':
        return res.status(200).json(complianceGenerator.generateComplianceStatus());

      case 'findings':
        return res.status(200).json(complianceGenerator.generateAuditFindings());

      case 'summary':
        return res.status(200).json(complianceGenerator.generateComplianceSummary());

      case 'trends':
        return res.status(200).json(complianceGenerator.generateComplianceTrend(numMonths));

      default:
        // Return comprehensive compliance data
        return res.status(200).json({
          status: complianceGenerator.generateComplianceStatus(),
          summary: complianceGenerator.generateComplianceSummary(),
          findings: complianceGenerator.generateAuditFindings(),
          trends: complianceGenerator.generateComplianceTrend(12)
        });
    }
  } catch (error) {
    console.error('Compliance API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
