import { useCallback, useState } from "react";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { useLoadingAction } from "../../../shared/hooks/useLoadingAction";
import { useRefreshingAction } from "../../../shared/hooks/useRefreshingAction";
import {
	getAllGroupedByPregnancyResult,
	type MatingEvent,
} from "../api/matingEventApi";

export type PregnancyResult = "Pendiente" | "Positivo" | "Negativo";

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

const EMPTY_MAP: Record<PregnancyResult, MatingEvent[]> = {
	Pendiente: [],
	Positivo: [],
	Negativo: [],
};

/**
 * Hook for fetching mating events grouped by pregnancy result.
 * Manages loading, refreshing, and count state using shared infrastructure.
 */
export function useMatingEventsAPI(): UseMatingEventsAPIReturn {
	const [eventsByResult, setEventsByResult] =
		useState<Record<PregnancyResult, MatingEvent[]>>(EMPTY_MAP);
	const [counts, setCounts] = useState<MatingEventsCounts>({
		pendiente: 0,
		positivo: 0,
		negativo: 0,
	});

	const fetchAll = useCallback(async () => {
		try {
			const groups = await getAllGroupedByPregnancyResult();

			const map: Record<PregnancyResult, MatingEvent[]> = {
				Pendiente: [],
				Positivo: [],
				Negativo: [],
			};

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
			setEventsByResult(EMPTY_MAP);
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
