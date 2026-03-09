/**
 * Shared CISA KEV API Client
 * Used by both /api/realtime and /api/feeds
 */

const CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

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
 * Fetch full CISA KEV catalog with stats
 */
export async function fetchCISAKEV() {
  const data = await fetchWithTimeout(CISA_KEV_URL);
  const vulns = data.vulnerabilities || [];

  const now = Date.now();
  const ms30d = 30 * 24 * 60 * 60 * 1000;
  const ms7d = 7 * 24 * 60 * 60 * 1000;
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const recentlyAdded = vulns.filter(v => v.dateAdded && (now - new Date(v.dateAdded)) < ms30d);
  const addedThisWeek = vulns.filter(v => v.dateAdded && (now - new Date(v.dateAdded)) < ms7d);
  const addedToday = vulns.filter(v => v.dateAdded && new Date(v.dateAdded) >= today);

  return {
    total: vulns.length,
    addedToday: addedToday.length,
    addedThisWeek: addedThisWeek.length,
    addedLast30Days: recentlyAdded.length,
    ransomwareAssociated: vulns.filter(v => v.knownRansomwareCampaignUse === 'Known').length,
    recentEntries: recentlyAdded.slice(0, 10).map(v => ({
      id: v.cveID,
      name: v.vulnerabilityName,
      vendor: v.vendorProject,
      product: v.product,
      dateAdded: v.dateAdded,
      dueDate: v.dueDate,
      ransomware: v.knownRansomwareCampaignUse === 'Known',
      requiredAction: v.requiredAction
    })),
    catalogVersion: data.catalogVersion,
    dateReleased: data.dateReleased
  };
}

/**
 * Fetch simple list for feed display
 */
export async function fetchCISAForFeed() {
  const data = await fetchCISAKEV();
  return data.recentEntries.slice(0, 10).map(v => ({
    cveID: v.id,
    vendorProject: v.vendor,
    product: v.product,
    vulnerabilityName: v.name,
    dateAdded: v.dateAdded,
    shortDescription: v.requiredAction.substring(0, 150),
    requiredAction: v.requiredAction.substring(0, 150),
    source: 'CISA KEV'
  }));
}
