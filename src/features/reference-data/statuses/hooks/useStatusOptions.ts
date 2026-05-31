import { useCallback, useEffect, useState } from "react";
import { getStatus } from "../api/statusApi";
import type { Status } from "../model/status";

export type StatusOption = { label: string; value: number };

interface UseStatusOptionsReturn {
	options: StatusOption[];
	loading: boolean;
}

/**
 * Fetches the status list from the API and maps it to label/value pairs.
 */
export function useStatusOptions(): UseStatusOptionsReturn {
	const [options, setOptions] = useState<StatusOption[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchStatuses = useCallback(async () => {
		try {
			const data = await getStatus();
			setOptions(data.map((s: Status) => ({ label: s.status_name, value: s.status_id })));
		} catch (error) {
			console.error("Error cargando estados:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStatuses();
	}, [fetchStatuses]);

	return { options, loading };
}
