import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import { getApiErrorMessage } from '../../../shared/api/apiError';
import { useLoadingAction } from '../../../shared/hooks/useLoadingAction';
import { getSowbyId, type Sow } from '../api/sowsApi';

interface UseSowLoaderReturn {
  sow: Sow | null;
  /** Exposes the state setter so editing screens can update sow fields locally. */
  setSow: Dispatch<SetStateAction<Sow | null>>;
  loading: boolean;
  error: string | null;
  /** Triggers a fresh load of the sow from the API (wrapped with loading state). */
  loadSow: () => Promise<void>;
}

/**
 * Hook for loading a single Sow by ID.
 * Encapsulates API call, loading state, and error handling using shared infrastructure.
 * Used by EditSowScreen and DetailsSowScreen to avoid duplicating fetch logic.
 *
 * @param sowId - The numeric ID of the sow to fetch.
 */
export function useSowLoader(sowId: number): UseSowLoaderReturn {
  const [sow, setSow] = useState<Sow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSow = useCallback(async () => {
    try {
      setError(null);
      const data = await getSowbyId(sowId);
      setSow(data);
    } catch (err) {
      setError(
        getApiErrorMessage(err, { fallback: 'No se pudo cargar la cerda.' }),
      );
    }
  }, [sowId]);

  const { loading, runWithLoading: loadSow } = useLoadingAction(fetchSow, {
    initialLoading: true,
  });

  return { sow, setSow, loading, error, loadSow };
}
