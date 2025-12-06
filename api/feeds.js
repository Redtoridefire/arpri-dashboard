/**
 * Feeds API Endpoint
 * Returns aggregated external security feeds (stubbed for now)
 */

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
    // Stubbed external feeds - return minimal data
    return res.status(200).json({
      feeds: [
        { source: 'NVD', status: 'available', lastUpdate: new Date().toISOString() },
        { source: 'MITRE', status: 'available', lastUpdate: new Date().toISOString() },
        { source: 'CISA', status: 'available', lastUpdate: new Date().toISOString() }
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Feeds API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
