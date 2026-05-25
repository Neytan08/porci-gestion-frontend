/**
 * Shared TypeScript definitions used by generic hooks and infrastructure.
 * Only types that are reusable across features should live here.
 */

export type ApiErrorMessageOverrides = {
	timeout?: string;
	noResponse?: string;
	conflict?: string;
	fallback?: string;
};

export type DeleteEntityMessages = {
	successTitle?: string;
	successMessage?: string;
	errorTitle?: string;
	errorMessage?: string;
};

export interface UseDeleteEntityParams<TId> {
	deleteFn: (id: TId) => Promise<any>;
	onDeleted?: () => Promise<void> | void;
	messages?: DeleteEntityMessages;
}

export interface UseMultiSelectionReturn {
	selected: Set<number>;
	toggleSelect: (id: number) => void;
	selectAll: (ids: number[]) => void;
	deselectAll: () => void;
	isSelected: (id: number) => boolean;
	selectedCount: number;
}

export interface UseLoadingActionOptions {
	initialLoading?: boolean;
}

export interface UseLoadingActionReturn {
	loading: boolean;
	runWithLoading: () => Promise<void>;
}

export interface UseRefreshingActionOptions {
	disabled?: boolean;
}

export interface UseRefreshingActionReturn {
	refreshing: boolean;
	onRefresh: () => Promise<void>;
}

/**
 * Allowed characters for a tag number: letters, digits, hyphens, underscores,
 * and single spaces — but only between characters (never at the start or end).
 *
 * Pattern breakdown:
 *   ^[a-zA-Z0-9_-]+        — must start with one or more allowed chars (no leading space)
 *   (?:\s[a-zA-Z0-9_-]+)* — zero or more groups of: exactly ONE space followed by
 *                            one or more allowed chars (enforces no trailing space and
 *                            no consecutive spaces)
 *   $                      — end of string
 *
 * Valid:   "ABC-123", "01 Test", "test_01"
 * Invalid: " Test" (leading space), "Test " (trailing space), "  Test" (double space)
 */
export const TAG_NUMBER_PATTERN = /^[a-zA-Z0-9_-]+(?:\s[a-zA-Z0-9_-]+)*$/;