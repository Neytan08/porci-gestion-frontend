import { useCallback, useState } from "react";

import type {
	UseRefreshingActionOptions,
	UseRefreshingActionReturn,
} from "../types";

/**
 * Shared hook for pull-to-refresh flows with optional disabling logic.
 */
export function useRefreshingAction(
	action: () => Promise<void>,
	options: UseRefreshingActionOptions = {},
): UseRefreshingActionReturn {
	const { disabled = false } = options;
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(async () => {
		if (disabled || refreshing) return;

		setRefreshing(true);
		try {
			await action();
		} finally {
			setRefreshing(false);
		}
	}, [action, disabled, refreshing]);

	return {
		refreshing,
		onRefresh,
	};
}
