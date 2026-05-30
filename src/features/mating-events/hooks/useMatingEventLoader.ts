import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { useLoadingAction } from "../../../shared/hooks/useLoadingAction";
import { getMatingEventById, type MatingEvent } from "../api/matingEventApi";

interface UseMatingEventLoaderReturn {
	event: MatingEvent | null;
	setEvent: Dispatch<SetStateAction<MatingEvent | null>>;
	loading: boolean;
	error: string | null;
	loadEvent: () => Promise<void>;
}

/**
 * Hook for loading a single MatingEvent by ID.
 * Used by EditMatingEventScreen and DetailsMatingEventScreen.
 *
 * @param eventId - The numeric ID of the mating event to fetch.
 */
export function useMatingEventLoader(
	eventId: number,
): UseMatingEventLoaderReturn {
	const [event, setEvent] = useState<MatingEvent | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchEvent = useCallback(async () => {
		try {
			setError(null);
			const data = await getMatingEventById(eventId);
			setEvent(data);
		} catch (err) {
			setError(
				getApiErrorMessage(err, {
					fallback: "No se pudo cargar el evento de inseminación.",
				}),
			);
		}
	}, [eventId]);

	const { loading, runWithLoading: loadEvent } = useLoadingAction(fetchEvent, {
		initialLoading: true,
	});

	return { event, setEvent, loading, error, loadEvent };
}
