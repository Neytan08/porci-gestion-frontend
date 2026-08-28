import { useCallback, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { useLoadingAction } from "../../../shared/hooks/useLoadingAction";
import { useRefreshingAction } from "../../../shared/hooks/useRefreshingAction";
import { getAllGroupedByPregnancyResult, type MatingEvent } from "../api/matingEventApi";
import { PREGNANCY_RESULT_OPTIONS, type PregnancyResult } from "../model/matingEvent";

export type MatingEventsCounts = { [Result in PregnancyResult]: number; };

interface UseMatingEventsAPIReturn {
  eventsByResult: Record<PregnancyResult, MatingEvent[]>;
  counts: MatingEventsCounts;
  loadingAll: boolean;
  refreshing: boolean;
  loadAll: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

const createEventsByResultMap = (): Record<PregnancyResult, MatingEvent[]> =>
  PREGNANCY_RESULT_OPTIONS.reduce(
    (accumulator, result) => {
      accumulator[result] = [];
      return accumulator;
    },
    {} as Record<PregnancyResult, MatingEvent[]>,
  );

const createCountsByResult = (
  eventsByResult: Record<PregnancyResult, MatingEvent[]>,
): MatingEventsCounts =>
  PREGNANCY_RESULT_OPTIONS.reduce((accumulator, result) => {
    accumulator[result] = eventsByResult[result].length;
    return accumulator;
  }, {} as MatingEventsCounts);

/**
 * Hook for fetching mating events grouped by pregnancy result.
 * Manages loading, refreshing, and count state using shared infrastructure.
 */
export function useMatingEventsAPI(): UseMatingEventsAPIReturn {
  const [eventsByResult, setEventsByResult] =
    useState<Record<PregnancyResult, MatingEvent[]>>(createEventsByResultMap);
  const [counts, setCounts] = useState<MatingEventsCounts>(() =>
    createCountsByResult(createEventsByResultMap()),
  );

  const fetchAll = useCallback(async () => {
    try {
      const groups = await getAllGroupedByPregnancyResult();

      const map = createEventsByResultMap();

      for (const g of groups) {
        const key = g.pregnancy_result as PregnancyResult | null;
        if (key && key in map) {
          map[key] = Array.isArray(g.events) ? g.events : [];
        }
      }

      setEventsByResult(map);
      setCounts(createCountsByResult(map));
    } catch (err) {
      const message = getApiErrorMessage(err, {
        fallback: "No se pudieron cargar los eventos de inseminación.",
      });
      console.error(message);
      const emptyMap = createEventsByResultMap();
      setEventsByResult(emptyMap);
      setCounts(createCountsByResult(emptyMap));
    }
  }, []);

  const { loading: loadingAll, runWithLoading: loadAll } = useLoadingAction(fetchAll, {
    initialLoading: true,
  });

  const { refreshing, onRefresh } = useRefreshingAction(fetchAll, {
    disabled: loadingAll,
  });

  return { eventsByResult, counts, loadingAll, refreshing, loadAll, onRefresh };
}
