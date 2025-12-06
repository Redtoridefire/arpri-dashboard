/**
 * React Hooks for API Data Fetching
 * STABLE VERSION - Fixed infinite loop issues
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from './apiClient';

/**
 * Generic hook for fetching data from API
 * Fixed: Removed dependencies that cause infinite loops
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

  // Use refs to avoid dependency issues
  const apiMethodRef = useRef(apiMethod);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const intervalRef = useRef(null);

  // Update refs when props change
  useEffect(() => {
    apiMethodRef.current = apiMethod;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  // Stable fetchData function (no dependencies)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiMethodRef.current();
      setData(result);
      setLastUpdated(new Date());

      if (onSuccessRef.current) {
        onSuccessRef.current(result);
      }
    } catch (err) {
      console.error('API fetch error:', err);
      setError(err.message || 'Failed to fetch data');

      if (onErrorRef.current) {
        onErrorRef.current(err);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies - stable function

  // Initial fetch - only run once on mount if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Auto-refresh interval - disabled by default
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
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
 * Hook for fetching system status - DISABLED POLLING BY DEFAULT
 */
export function useSystemStatus(refreshInterval = null) {
  return useAPI(
    () => apiClient.getAllSystem(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching external feeds - DISABLED POLLING BY DEFAULT
 */
export function useExternalFeeds(refreshInterval = null) {
  return useAPI(
    () => apiClient.getAllFeeds(),
    [],
    { refreshInterval }
  );
}

/**
 * Hook for fetching industry metrics - DISABLED POLLING BY DEFAULT
 */
export function useIndustryMetrics(refreshInterval = null) {
  return useAPI(
    () => apiClient.getIndustryMetrics(),
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
 * Hook for polling real-time fraud metrics - DISABLED BY DEFAULT
 */
export function useFraudRealTime(pollingInterval = null) {
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
  useIndustryMetrics,
  useDashboard,
  useFraudRealTime,
  useModelTrends
};
