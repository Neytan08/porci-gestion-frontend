import { useCallback, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { useLoadingAction } from "../../../shared/hooks/useLoadingAction";
import { useRefreshingAction } from "../../../shared/hooks/useRefreshingAction";
import {
	getAllGroupedByPregnancyResult,
	type MatingEvent,
} from "../api/matingEventApi";
import {
	PREGNANCY_RESULT_OPTIONS,
	type PregnancyResult,
} from "../model/matingEvent";

export type MatingEventsCounts = {
	pendiente: number;
	positivo: number;
	negativo: number;
};

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

/**
 * Hook for fetching mating events grouped by pregnancy result.
 * Manages loading, refreshing, and count state using shared infrastructure.
 */
export function useMatingEventsAPI(): UseMatingEventsAPIReturn {
	const [eventsByResult, setEventsByResult] =
		useState<Record<PregnancyResult, MatingEvent[]>>(createEventsByResultMap);
	const [counts, setCounts] = useState<MatingEventsCounts>({
		pendiente: 0,
		positivo: 0,
		negativo: 0,
	});

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
			setCounts({
				pendiente: map.Pendiente.length,
				positivo: map.Positivo.length,
				negativo: map.Negativo.length,
			});
		} catch (err) {
			const message = getApiErrorMessage(err, {
				fallback: "No se pudieron cargar los eventos de inseminación.",
			});
			console.error(message);
			setEventsByResult(createEventsByResultMap());
			setCounts({ pendiente: 0, positivo: 0, negativo: 0 });
		}
	}, []);

	const { loading: loadingAll, runWithLoading: loadAll } = useLoadingAction(
		fetchAll,
		{ initialLoading: true },
	);

	const { refreshing, onRefresh } = useRefreshingAction(fetchAll, {
		disabled: loadingAll,
	});

	return { eventsByResult, counts, loadingAll, refreshing, loadAll, onRefresh };
}
