/**
 * React Hooks for API Data Fetching
 * Provides hooks with loading, error, and refresh capabilities
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from './apiClient';

/**
 * Generic hook for fetching data from API
 */
export function useAPI(apiMethod, dependencies = [], options = {}) {
  const {
    autoFetch = true,
    refreshInterval = null,
    onSuccess = null,
    onError = null
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiMethod();
      setData(result);
      setLastUpdated(new Date());

      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error('API fetch error:', err);
      setError(err.message || 'Failed to fetch data');

      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  }, [apiMethod, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData, ...dependencies]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalRef.current);
    }
  }, [refreshInterval, fetchData]);

  // Manual refresh
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh, lastUpdated };
}

/**
 * Hook for fetching resilience data
 */
export function useResilience(refreshInterval = null) {
  return useAPI(
    () => apiClient.getAllResilience(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching threat data
 */
export function useThreats(refreshInterval = null) {
  return useAPI(
    () => apiClient.getAllThreats(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching model data
 */
export function useModels(refreshInterval = null) {
  return useAPI(
    () => apiClient.getAllModels(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching fraud data
 * Note: Disabled auto-refresh by default to prevent performance issues
 */
export function useFraud(refreshInterval = null) {
  return useAPI(
    () => apiClient.getAllFraud(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching compliance data
 */
export function useCompliance(refreshInterval = null) {
  return useAPI(
    () => apiClient.getAllCompliance(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching system status
 */
export function useSystemStatus(refreshInterval = 10000) {
  return useAPI(
    () => apiClient.getAllSystem(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching external feeds
 */
export function useExternalFeeds(refreshInterval = 30 * 60 * 1000) {
  return useAPI(
    () => apiClient.getAllFeeds(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching all dashboard data
 */
export function useDashboard(refreshInterval = null) {
  return useAPI(
    () => apiClient.getDashboardSummary(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for polling real-time fraud metrics
 */
export function useFraudRealTime(pollingInterval = 5000) {
  return useAPI(
    () => apiClient.getFraudRealTime(),
    [],
    { refreshInterval: pollingInterval }
  );
}

/**
 * Hook for specific model trends
 */
export function useModelTrends(modelName, days = 30) {
  return useAPI(
    () => apiClient.getModelTrends(modelName, days),
    [modelName, days],
    { autoFetch: !!modelName }
  );
}

export default {
  useAPI,
  useResilience,
  useThreats,
  useModels,
  useFraud,
  useCompliance,
  useSystemStatus,
  useExternalFeeds,
  useDashboard,
  useFraudRealTime,
  useModelTrends
};
