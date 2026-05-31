import { useCallback, useState } from 'react';
import { getApiErrorMessage } from '../../../shared/api/apiError';
import { useLoadingAction } from '../../../shared/hooks/useLoadingAction';
import { useRefreshingAction } from '../../../shared/hooks/useRefreshingAction';
import { type Boar, getBoars } from '../api/boarsApi';

interface UseBoarsAPIReturn {
  boars: Boar[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  loadBoars: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Hook for managing Boars API data fetching and state.
 * Handles loading, refreshing, and error states using shared infrastructure.
 */
export function useBoarsAPI(): UseBoarsAPIReturn {
  const [boars, setBoars] = useState<Boar[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBoars = useCallback(async () => {
    try {
      setError(null);
      const data = await getBoars();
      setBoars(data);
    } catch (err: unknown) {
      // Delegate to shared error handler for consistent messages across the app
      setError(getApiErrorMessage(err, { fallback: 'No se pudo cargar la lista de verracos.' }));
    }
  }, []);

  const { loading, runWithLoading: loadBoars } = useLoadingAction(fetchBoars, {
    initialLoading: true,
  });

  const { refreshing, onRefresh } = useRefreshingAction(fetchBoars, {
    disabled: loading,
  });

  return { boars, loading, error, refreshing, loadBoars, onRefresh };
}
