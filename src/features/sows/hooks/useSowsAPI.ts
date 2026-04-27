import { useCallback, useState } from 'react';
import { getSows, type Sow } from '../api/sowsApi';
import { useLoadingAction } from '../../../shared/hooks/useLoadingAction';
import { useRefreshingAction } from '../../../shared/hooks/useRefreshingAction';

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
 * Handles loading, refreshing, and error states
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
      const error = err as { code?: string; isAxiosError?: boolean };
      if (error?.code === 'ECONNABORTED') {
        setError('La solicitud tardÃ³ demasiado. Intente nuevamente.');
      } else if (error?.isAxiosError) {
        setError('Error de red o servidor. Verifique su conexiÃ³n.');
      } else {
        setError('No se pudo cargar la lista de cerdas.');
      }
      console.error('Error loading sows:', err);
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

