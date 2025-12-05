/**
 * ARPRI Dashboard API Integration Layer
 * 
 * This module defines the API contracts and integration patterns for connecting
 * the ARPRI dashboard to real data sources, including enterprise systems,
 * security platforms, and AI model endpoints.
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  baseUrl: process.env.VITE_API_BASE_URL || 'https://api.arpri.example.com',
  version: 'v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};

// ============================================================================
// DATA TYPES
// ============================================================================

/**
 * @typedef {Object} ResilienceScore
 * @property {number} overall - Overall resilience score (0-100)
 * @property {number} previousMonth - Previous month's score for trend
 * @property {Object} categories - Domain-specific scores
 */

/**
 * @typedef {Object} ThreatVector
 * @property {string} id - Unique identifier
 * @property {string} name - Threat name
 * @property {'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'} risk - Risk level
 * @property {number} score - Security score (0-100)
 * @property {'up'|'down'|'stable'} trend - Trend direction
 * @property {number} incidents - Active incident count
 * @property {string} description - Threat description
 * @property {string} mitigation - Recommended mitigations
 */

/**
 * @typedef {Object} ComplianceFramework
 * @property {string} framework - Framework name
 * @property {'compliant'|'partial'|'non-compliant'} status
 * @property {number} coverage - Coverage percentage
 * @property {string} lastAudit - Last audit date (ISO)
 * @property {string} nextAudit - Next audit date (ISO)
 * @property {number} findings - Open findings count
 */

/**
 * @typedef {Object} AIModel
 * @property {string} id - Model identifier
 * @property {string} name - Model name
 * @property {string} type - Model type (Detection, Classification, etc.)
 * @property {'production'|'staging'|'development'} status
 * @property {'critical'|'high'|'medium'|'low'} riskTier
 * @property {string} lastValidation - Last validation date
 * @property {number} driftScore - Model drift percentage
 * @property {number} accuracy - Model accuracy percentage
 * @property {number} latency - Inference latency (ms)
 */

/**
 * @typedef {Object} RealTimeMetrics
 * @property {number} txnPerSecond - Transactions per second
 * @property {number} fraudAttempts - Fraud attempts today
 * @property {number} blockedRate - Fraud blocked percentage
 * @property {number} aiDecisions - AI decisions count
 * @property {number} humanEscalations - Human escalation count
 */

// ============================================================================
// API CLIENT
// ============================================================================

class ARPRIApiClient {
  constructor(config = API_CONFIG) {
    this.config = config;
    this.baseUrl = `${config.baseUrl}/${config.version}`;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      timeout: this.config.timeout
    };

    const mergedOptions = { ...defaultOptions, ...options };

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        if (attempt === this.config.retryAttempts) {
          throw error;
        }
        await this.delay(this.config.retryDelay * attempt);
      }
    }
  }

  getAuthToken() {
    // In production, retrieve from secure storage or auth provider
    return localStorage.getItem('arpri_token') || '';
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // -------------------------------------------------------------------------
  // RESILIENCE ENDPOINTS
  // -------------------------------------------------------------------------

  /**
   * Get current resilience scores
   * @returns {Promise<ResilienceScore>}
   */
  async getResilienceScore() {
    return this.request('/resilience/score');
  }

  /**
   * Get historical resilience data
   * @param {number} months - Number of months of history
   * @returns {Promise<Array>}
   */
  async getResilienceHistory(months = 12) {
    return this.request(`/resilience/history?months=${months}`);
  }

  // -------------------------------------------------------------------------
  // THREAT INTELLIGENCE ENDPOINTS
  // -------------------------------------------------------------------------

  /**
   * Get active threat vectors
   * @returns {Promise<ThreatVector[]>}
   */
  async getThreats() {
    return this.request('/threats');
  }

  /**
   * Get threat details by ID
   * @param {string} threatId
   * @returns {Promise<ThreatVector>}
   */
  async getThreatDetails(threatId) {
    return this.request(`/threats/${threatId}`);
  }

  /**
   * Get threat trend analysis
   * @param {string} timeframe - 'day', 'week', 'month', 'quarter'
   * @returns {Promise<Array>}
   */
  async getThreatTrends(timeframe = 'month') {
    return this.request(`/threats/trends?timeframe=${timeframe}`);
  }

  // -------------------------------------------------------------------------
  // COMPLIANCE ENDPOINTS
  // -------------------------------------------------------------------------

  /**
   * Get compliance status for all frameworks
   * @returns {Promise<ComplianceFramework[]>}
   */
  async getComplianceStatus() {
    return this.request('/compliance/status');
  }

  /**
   * Get compliance details for specific framework
   * @param {string} framework
   * @returns {Promise<Object>}
   */
  async getComplianceDetails(framework) {
    return this.request(`/compliance/${framework}`);
  }

  /**
   * Get open findings
   * @returns {Promise<Array>}
   */
  async getFindings() {
    return this.request('/compliance/findings');
  }

  // -------------------------------------------------------------------------
  // AI MODEL ENDPOINTS
  // -------------------------------------------------------------------------

  /**
   * Get AI model inventory
   * @returns {Promise<AIModel[]>}
   */
  async getModels() {
    return this.request('/models');
  }

  /**
   * Get model details
   * @param {string} modelId
   * @returns {Promise<AIModel>}
   */
  async getModelDetails(modelId) {
    return this.request(`/models/${modelId}`);
  }

  /**
   * Get model drift analysis
   * @param {string} modelId
   * @returns {Promise<Object>}
   */
  async getModelDrift(modelId) {
    return this.request(`/models/${modelId}/drift`);
  }

  /**
   * Get model performance metrics
   * @param {string} modelId
   * @param {string} timeframe
   * @returns {Promise<Array>}
   */
  async getModelMetrics(modelId, timeframe = 'week') {
    return this.request(`/models/${modelId}/metrics?timeframe=${timeframe}`);
  }

  // -------------------------------------------------------------------------
  // REAL-TIME METRICS ENDPOINTS
  // -------------------------------------------------------------------------

  /**
   * Get current real-time metrics
   * @returns {Promise<RealTimeMetrics>}
   */
  async getRealTimeMetrics() {
    return this.request('/metrics/realtime');
  }

  /**
   * Subscribe to real-time updates via WebSocket
   * @param {Function} onMessage - Callback for messages
   * @param {Function} onError - Callback for errors
   * @returns {WebSocket}
   */
  subscribeToRealTime(onMessage, onError) {
    const wsUrl = this.config.baseUrl.replace('https', 'wss').replace('http', 'ws');
    const ws = new WebSocket(`${wsUrl}/v1/metrics/stream`);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        channels: ['transactions', 'fraud', 'ai_decisions']
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = onError;

    return ws;
  }

  // -------------------------------------------------------------------------
  // EXPORT ENDPOINTS
  // -------------------------------------------------------------------------

  /**
   * Generate export report
   * @param {Object} options - Export options
   * @returns {Promise<Blob>}
   */
  async generateReport(options = {}) {
    const response = await fetch(`${this.baseUrl}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        format: options.format || 'pdf',
        sections: options.sections || ['all'],
        dateRange: options.dateRange || { start: null, end: null }
      })
    });

    return response.blob();
  }
}

// ============================================================================
// WEBSOCKET MANAGER
// ============================================================================

class WebSocketManager {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  connect() {
    this.ws = this.apiClient.subscribeToRealTime(
      (data) => this.handleMessage(data),
      (error) => this.handleError(error)
    );

    this.ws.onclose = () => this.handleClose();
  }

  handleMessage(data) {
    const { channel, payload } = data;
    const channelListeners = this.listeners.get(channel) || [];
    channelListeners.forEach(callback => callback(payload));
  }

  handleError(error) {
    console.error('WebSocket error:', error);
  }

  handleClose() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      setTimeout(() => this.connect(), delay);
    }
  }

  subscribe(channel, callback) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    this.listeners.get(channel).push(callback);
  }

  unsubscribe(channel, callback) {
    const channelListeners = this.listeners.get(channel) || [];
    const index = channelListeners.indexOf(callback);
    if (index > -1) {
      channelListeners.splice(index, 1);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// ============================================================================
// REACT HOOKS
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for fetching resilience data
 */
export function useResilience() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = useRef(new ARPRIApiClient());

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiClient.current.getResilienceScore();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading, error };
}

/**
 * Hook for fetching threats
 */
export function useThreats() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = useRef(new ARPRIApiClient());

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiClient.current.getThreats();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

/**
 * Hook for real-time metrics with WebSocket
 */
export function useRealTimeMetrics() {
  const [metrics, setMetrics] = useState({
    txnPerSecond: 0,
    fraudAttempts: 0,
    blockedRate: 0,
    aiDecisions: 0,
    humanEscalations: 0
  });
  
  const apiClient = useRef(new ARPRIApiClient());
  const wsManager = useRef(null);

  useEffect(() => {
    // Initial fetch
    apiClient.current.getRealTimeMetrics().then(setMetrics);

    // WebSocket subscription
    wsManager.current = new WebSocketManager(apiClient.current);
    wsManager.current.connect();

    wsManager.current.subscribe('transactions', (data) => {
      setMetrics(prev => ({ ...prev, txnPerSecond: data.tps }));
    });

    wsManager.current.subscribe('fraud', (data) => {
      setMetrics(prev => ({
        ...prev,
        fraudAttempts: data.attempts,
        blockedRate: data.blockedRate
      }));
    });

    wsManager.current.subscribe('ai_decisions', (data) => {
      setMetrics(prev => ({
        ...prev,
        aiDecisions: data.total,
        humanEscalations: data.escalations
      }));
    });

    return () => {
      if (wsManager.current) {
        wsManager.current.disconnect();
      }
    };
  }, []);

  return metrics;
}

/**
 * Hook for compliance data
 */
export function useCompliance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = useRef(new ARPRIApiClient());

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiClient.current.getComplianceStatus();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading, error };
}

/**
 * Hook for AI models
 */
export function useModels() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = useRef(new ARPRIApiClient());

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiClient.current.getModels();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { data, loading, error };
}

// ============================================================================
// EXPORTS
// ============================================================================

export { ARPRIApiClient, WebSocketManager };
export default ARPRIApiClient;
