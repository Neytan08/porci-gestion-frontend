import { useCallback, useState } from "react";
import type {
	UseLoadingActionOptions,
	UseLoadingActionReturn,
} from "../types";

/**
 * Shared hook that wraps an async action with loading state management.
 */
export function useLoadingAction(
	action: () => Promise<void>,
	options: UseLoadingActionOptions = {},
): UseLoadingActionReturn {
	const { initialLoading = false } = options;
	const [loading, setLoading] = useState(initialLoading);

	const runWithLoading = useCallback(async () => {
		setLoading(true);
		try {
			await action();
		} finally {
			setLoading(false);
		}
	}, [action]);

	return {
		loading,
		runWithLoading,
	};
}
