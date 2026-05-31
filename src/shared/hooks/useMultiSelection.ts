import { useCallback, useState } from "react";
import type { UseMultiSelectionReturn } from "../types";

/**
 * Shared hook for managing a numeric selection set across list-based screens.
 */
export function useMultiSelection(): UseMultiSelectionReturn {
	const [selected, setSelected] = useState<Set<number>>(new Set());

	const toggleSelect = useCallback((id: number) => {
		setSelected((prev) => {
			const next = new Set(prev);

			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}

			return next;
		});
	}, []);

	const selectAll = useCallback((ids: number[]) => {
		setSelected(new Set(ids));
	}, []);

	const deselectAll = useCallback(() => {
		setSelected(new Set());
	}, []);

	const isSelected = useCallback((id: number) => selected.has(id), [selected]);

	return {
		selected,
		toggleSelect,
		selectAll,
		deselectAll,
		isSelected,
		selectedCount: selected.size,
	};
}
