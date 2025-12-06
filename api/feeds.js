/**
 * External Feeds API Endpoint
 * Returns aggregated data from public security feeds
 * Gracefully falls back to synthetic data if external feeds fail
 */

import feedAggregator from '../src/external/feedAggregator.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST' && req.body?.action === 'clearCache') {
    feedAggregator.clearCache();
    return res.status(200).json({ message: 'Cache cleared' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;

    switch (type) {
      case 'nvd':
        const nvd = await feedAggregator.getNVDData();
        return res.status(200).json(nvd);

      case 'mitre':
        const mitre = await feedAggregator.getMITREData();
        return res.status(200).json(mitre);

      case 'cisa':
        const cisa = await feedAggregator.getCISAAdvisories();
        return res.status(200).json(cisa);

      case 'cloud':
        const cloud = await feedAggregator.getCloudStatus();
        return res.status(200).json(cloud);

      default:
        // Return all aggregated feeds
        const allFeeds = await feedAggregator.aggregateFeeds();
        return res.status(200).json(allFeeds);
    }
  } catch (error) {
    console.error('Feeds API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      fallback: true
    });
  }
}
