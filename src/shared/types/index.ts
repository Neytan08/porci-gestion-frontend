/**
 * Shared TypeScript definitions used by generic hooks and infrastructure.
 * Only types that are reusable across features should live here.
 */

// Represents the new error shape returned by the API.
// The backend now sends: { status, errorCode, message }.
export type ApiErrorResponse = {
    // HTTP status code also included in the response body.
    status?: number;

    // Business error code returned by the backend.
    // Useful for handling specific UI cases.
    errorCode?: string;

    // Safe message intended to be shown to the user.
    message?: string;
};

// Represents a normalized frontend error object.
// This gives the UI a consistent shape no matter what failed.
export type ApiErrorDetails = {
    // Final message that should be shown in the UI.
    message: string;

    // HTTP status returned by the backend, if available.
    status?: number;

    // Business error code returned by the backend, if available.
    errorCode?: string;
};

export type ApiErrorMessageOverrides = {
    // Custom message for timeout errors.
    timeout?: string;

    // Custom message when the server did not respond.
    noResponse?: string;

    // Generic fallback for 409 conflicts when the API
    // does not provide a specific message.
    conflict?: string;

    // Default fallback when no better message is available.
    fallback?: string;

    // Allows overriding messages by backend errorCode.
    // Example: { SOW_NOT_EMPTY: "The sow must be empty first." }
    byErrorCode?: Partial<Record<string, string>>;

    // Allows overriding messages by HTTP status code.
    // Example: { 500: "An internal error occurred." }
    byStatus?: Partial<Record<number, string>>;
};

export type DeleteEntityMessages = {
	successTitle?: string;
	successMessage?: string;
	errorTitle?: string;
	errorMessage?: string;
};

export interface UseDeleteEntityParams<TId> {
	deleteFn: (id: TId) => Promise<unknown>;
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