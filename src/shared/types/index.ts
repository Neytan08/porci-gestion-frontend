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
