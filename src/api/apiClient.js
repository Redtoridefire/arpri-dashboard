/**
 * API Client
 * Centralized client for fetching data from backend APIs
 */

const API_BASE = import.meta.env.VITE_API_BASE || '';

class APIClient {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 2 * 60 * 1000; // 2 minutes for dashboard data
  }

  /**
   * Generic fetch with caching
   */
  async fetch(endpoint, options = {}) {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the response
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  // ===================
  // Resilience APIs
  // ===================

  async getResilienceScore() {
    return this.fetch('/api/resilience?type=score');
  }

  async getResilienceTimeSeries() {
    return this.fetch('/api/resilience?type=timeseries');
  }

  async getRiskDistribution() {
    return this.fetch('/api/resilience?type=distribution');
  }

  async getRadarData() {
    return this.fetch('/api/resilience?type=radar');
  }

  async getAllResilience() {
    return this.fetch('/api/resilience');
  }

  // ===================
  // Threat APIs
  // ===================

  async getThreats() {
    return this.fetch('/api/threats?type=list');
  }

  async getThreatIncidents() {
    return this.fetch('/api/threats?type=incidents');
  }

  async getThreatTrends(days = 30) {
    return this.fetch(`/api/threats?type=trends&days=${days}`);
  }

  async getAllThreats() {
    return this.fetch('/api/threats');
  }

  // ===================
  // Model APIs
  // ===================

  async getModels() {
    return this.fetch('/api/models?type=list');
  }

  async getModelDrift() {
    return this.fetch('/api/models?type=drift');
  }

  async getModelMetrics() {
    return this.fetch('/api/models?type=metrics');
  }

  async getModelTrends(modelName, days = 30) {
    return this.fetch(`/api/models?type=trends&model=${encodeURIComponent(modelName)}&days=${days}`);
  }

  async getModelSBOM(modelName) {
    return this.fetch(`/api/models?type=sbom&model=${encodeURIComponent(modelName)}`);
  }

  async getAllModels() {
    return this.fetch('/api/models');
  }

  // ===================
  // Fraud APIs
  // ===================

  async getFraudRealTime() {
    return this.fetch('/api/fraud?type=realtime');
  }

  async getFraudPatterns() {
    return this.fetch('/api/fraud?type=patterns');
  }

  async getFraudGeographic() {
    return this.fetch('/api/fraud?type=geographic');
  }

  async getFraudVelocity() {
    return this.fetch('/api/fraud?type=velocity');
  }

  async getMerchantRisks() {
    return this.fetch('/api/fraud?type=merchants');
  }

  async getDecisionBreakdown() {
    return this.fetch('/api/fraud?type=decisions');
  }

  async getFraudTrends(hours = 24) {
    return this.fetch(`/api/fraud?type=trends&hours=${hours}`);
  }

  async getAllFraud() {
    return this.fetch('/api/fraud');
  }

  // ===================
  // Compliance APIs
  // ===================

  async getComplianceStatus() {
    return this.fetch('/api/compliance?type=status');
  }

  async getComplianceFindings() {
    return this.fetch('/api/compliance?type=findings');
  }

  async getComplianceSummary() {
    return this.fetch('/api/compliance?type=summary');
  }

  async getComplianceTrends(months = 12) {
    return this.fetch(`/api/compliance?type=trends&months=${months}`);
  }

  async getAllCompliance() {
    return this.fetch('/api/compliance');
  }

  // ===================
  // System APIs
  // ===================

  async getSystemStatus() {
    return this.fetch('/api/system?type=status');
  }

  async getInfrastructureMetrics() {
    return this.fetch('/api/system?type=infrastructure');
  }

  async getSystemIncidents(days = 30) {
    return this.fetch(`/api/system?type=incidents&days=${days}`);
  }

  async getUptimeStats(days = 30) {
    return this.fetch(`/api/system?type=uptime&days=${days}`);
  }

  async getSLAMetrics() {
    return this.fetch('/api/system?type=sla');
  }

  async getPerformanceMetrics() {
    return this.fetch('/api/system?type=performance');
  }

  async getAllSystem() {
    return this.fetch('/api/system');
  }

  // ===================
  // External Feeds APIs
  // ===================

  async getNVDFeed() {
    return this.fetch('/api/feeds?type=nvd');
  }

  async getMITREFeed() {
    return this.fetch('/api/feeds?type=mitre');
  }

  async getCISAFeed() {
    return this.fetch('/api/feeds?type=cisa');
  }

  async getCloudStatus() {
    return this.fetch('/api/feeds?type=cloud');
  }

  async getAllFeeds() {
    return this.fetch('/api/feeds');
  }

  // ===================
  // Industry Metrics APIs
  // ===================

  async getIndustryMetrics() {
    return this.fetch('/api/industry');
  }

  // ===================
  // Dashboard Summary
  // ===================

  /**
   * Fetch all dashboard data in one call for initial load
   */
  async getDashboardSummary() {
    try {
      const [resilience, threats, models, fraud, compliance, system] = await Promise.allSettled([
        this.getAllResilience(),
        this.getAllThreats(),
        this.getAllModels(),
        this.getAllFraud(),
        this.getAllCompliance(),
        this.getAllSystem()
      ]);

      return {
        resilience: resilience.status === 'fulfilled' ? resilience.value : null,
        threats: threats.status === 'fulfilled' ? threats.value : null,
        models: models.status === 'fulfilled' ? models.value : null,
        fraud: fraud.status === 'fulfilled' ? fraud.value : null,
        compliance: compliance.status === 'fulfilled' ? compliance.value : null,
        system: system.status === 'fulfilled' ? system.value : null,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
      throw error;
    }
  }
}

// Export singleton instance
const apiClient = new APIClient();
export default apiClient;
