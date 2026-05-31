import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import { getApiErrorMessage } from '../../../shared/api/apiError';
import { useLoadingAction } from '../../../shared/hooks/useLoadingAction';
import { type Boar, getBoarById } from '../api/boarsApi';

interface UseBoarLoaderReturn {
  boar: Boar | null;
  /** Exposes the state setter so editing screens can update boar fields locally. */
  setBoar: Dispatch<SetStateAction<Boar | null>>;
  loading: boolean;
  error: string | null;
  /** Triggers a fresh load of the boar from the API (wrapped with loading state). */
  loadBoar: () => Promise<void>;
}

/**
 * Hook for loading a single Boar by ID.
 * Encapsulates API call, loading state, and error handling using shared infrastructure.
 * Used by EditBoarScreen and DetailsBoarScreen to avoid duplicating fetch logic.
 *
 * @param boarId - The numeric ID of the boar to fetch.
 */
export function useBoarLoader(boarId: number): UseBoarLoaderReturn {
  const [boar, setBoar] = useState<Boar | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBoar = useCallback(async () => {
    try {
      setError(null);
      const data = await getBoarById(boarId);
      setBoar(data);
    } catch (err) {
      setError(getApiErrorMessage(err, { fallback: 'No se pudo cargar el verraco.' }));
    }
  }, [boarId]);

  const { loading, runWithLoading: loadBoar } = useLoadingAction(fetchBoar, {
    initialLoading: true,
  });

  return { boar, setBoar, loading, error, loadBoar };
}
