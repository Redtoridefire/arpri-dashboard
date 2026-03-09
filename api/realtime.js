/**
 * Real-Time Intelligence API
 *
 * Free APIs (no cost, no card):
 * - NVD CVE API v2  → https://nvd.nist.gov/developers/vulnerabilities
 *   Optional free key (higher rate limit): https://nvd.nist.gov/developers/request-an-api-key
 *   Set env: NVD_API_KEY=<your-key>
 *
 * - CISA KEV Catalog → https://www.cisa.gov/known-exploited-vulnerabilities-catalog
 *   No auth required, updated daily.
 *
 * - OSV.dev → https://osv.dev
 *   No auth required, covers PyPI/npm/GitHub packages.
 *
 * Paid / token-required:
 * - Snyk API → https://docs.snyk.io/snyk-api
 *   Set env: SNYK_API_TOKEN=<your-token>  (see api/snyk.js)
 */

import { fetchNVDAICVEs } from './_lib/nvdClient.js';
import { fetchCISAKEV } from './_lib/cisaClient.js';

const OSV_QUERY_URL = 'https://api.osv.dev/v1/query';

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'ARPRI-Dashboard/3.0 (AI Risk Intelligence Platform)',
        'Accept': 'application/json',
        ...options.headers
      }
    });
    clearTimeout(timer);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Fetch OSV.dev data for AI/ML Python packages
 */
async function fetchOSVData() {
  const packages = [
    { name: 'torch', ecosystem: 'PyPI' },
    { name: 'tensorflow', ecosystem: 'PyPI' },
    { name: 'transformers', ecosystem: 'PyPI' },
    { name: 'langchain', ecosystem: 'PyPI' },
    { name: 'openai', ecosystem: 'PyPI' }
  ];

  const results = await Promise.allSettled(
    packages.map(pkg =>
      fetchWithTimeout(OSV_QUERY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: pkg })
      }, 8000)
    )
  );

  const byPackage = {};
  results.forEach((result, i) => {
    byPackage[packages[i].name] = result.status === 'fulfilled'
      ? (result.value.vulns || []).length
      : null;
  });

  return {
    byPackage,
    totalKnownVulns: Object.values(byPackage).filter(v => v !== null).reduce((a, b) => a + b, 0)
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { type } = req.query;

  try {
    switch (type) {
      case 'nvd': {
        const data = await fetchNVDAICVEs(90); // Last 90 days
        return res.status(200).json({ ...data, timestamp: new Date().toISOString(), source: 'NIST NVD CVE API v2' });
      }
      case 'cisa': {
        const data = await fetchCISAKEV();
        return res.status(200).json({ ...data, timestamp: new Date().toISOString(), source: 'CISA KEV Catalog' });
      }
      case 'osv': {
        const data = await fetchOSVData();
        return res.status(200).json({ ...data, timestamp: new Date().toISOString(), source: 'OSV.dev' });
      }
      case 'status': {
        return res.status(200).json({
          integrations: {
            NVD: { status: 'active', freeApiKey: 'https://nvd.nist.gov/developers/request-an-api-key', apiKeyConfigured: !!process.env.NVD_API_KEY },
            CISA_KEV: { status: 'active', authRequired: false },
            OSV: { status: 'active', authRequired: false },
            Snyk: { status: process.env.SNYK_API_TOKEN ? 'active' : 'token_missing', endpoint: '/api/snyk' }
          },
          timestamp: new Date().toISOString()
        });
      }
      default: {
        const [nvd, cisa, osv] = await Promise.allSettled([
          fetchNVDAICVEs(90),
          fetchCISAKEV(),
          fetchOSVData()
        ]);
        return res.status(200).json({
          timestamp: new Date().toISOString(),
          nvd: nvd.status === 'fulfilled' ? nvd.value : { error: nvd.reason?.message },
          cisa: cisa.status === 'fulfilled' ? cisa.value : { error: cisa.reason?.message },
          osv: osv.status === 'fulfilled' ? osv.value : { error: osv.reason?.message }
        });
      }
    }
  } catch (error) {
    console.error('Realtime API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

