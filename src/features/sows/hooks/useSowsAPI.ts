import { useCallback, useState } from 'react';
import { getApiErrorMessage } from '../../../shared/api/apiError';
import { useLoadingAction } from '../../../shared/hooks/useLoadingAction';
import { useRefreshingAction } from '../../../shared/hooks/useRefreshingAction';
import { getSows, type Sow } from '../api/sowsApi';

interface UseSowsAPIReturn {
  sows: Sow[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  loadSows: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Hook for managing Sows API data fetching and state
 * Handles loading, refreshing, and error states using shared infrastructure.
 */
export function useSowsAPI(): UseSowsAPIReturn {
  const [sows, setSows] = useState<Sow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSows = useCallback(async () => {
    try {
      setError(null);
      const data = await getSows();
      setSows(data);
    } catch (err: unknown) {
      // Delegate to shared error handler for consistent messages across the app
      setError(getApiErrorMessage(err, { fallback: 'No se pudo cargar la lista de cerdas.' }));
    }
  }, []);

  const { loading, runWithLoading: loadSows } = useLoadingAction(fetchSows, {
    initialLoading: true,
  });

  const { refreshing, onRefresh } = useRefreshingAction(fetchSows, {
    disabled: loading,
  });

  return {
    sows,
    loading,
    error,
    refreshing,
    loadSows,
    onRefresh,
  };
}

