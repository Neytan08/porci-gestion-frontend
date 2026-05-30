import { useCallback, useReducer } from "react";
import type { MatingEvent } from "../api/matingEventApi";

/**
 * Canonical UI state for all MatingEvents feature modals.
 */
type MatingEventsModalsState = {
	/** Controls visibility of the contextual actions modal for one selected row. */
	actionsModalVisible: boolean;
	/** Event currently targeted by the actions modal. */
	actionForEvent: MatingEvent | null;
	/** Controls visibility of the delete confirmation modal. */
	deleteModalVisible: boolean;
	/** Event queued for deletion after user confirmation. */
	eventToDelete: MatingEvent | null;
	/** Controls visibility of the bulk actions modal for multi-selection. */
	selectedActionsVisible: boolean;
};

type MatingEventsModalsAction =
	| { type: "OPEN_ACTIONS_MODAL"; payload: MatingEvent }
	| { type: "CLOSE_ACTIONS_MODAL" }
	| { type: "OPEN_DELETE_MODAL"; payload: MatingEvent }
	| { type: "CLOSE_DELETE_MODAL" }
	| { type: "OPEN_SELECTED_ACTIONS_MODAL" }
	| { type: "CLOSE_SELECTED_ACTIONS_MODAL" };

const initialState: MatingEventsModalsState = {
	actionsModalVisible: false,
	actionForEvent: null,
	deleteModalVisible: false,
	eventToDelete: null,
	selectedActionsVisible: false,
};

function reducer(
	state: MatingEventsModalsState,
	action: MatingEventsModalsAction,
): MatingEventsModalsState {
	switch (action.type) {
		case "OPEN_ACTIONS_MODAL":
			return { ...state, actionsModalVisible: true, actionForEvent: action.payload };
		case "CLOSE_ACTIONS_MODAL":
			return { ...state, actionsModalVisible: false, actionForEvent: null };
		case "OPEN_DELETE_MODAL":
			return { ...state, deleteModalVisible: true, eventToDelete: action.payload };
		case "CLOSE_DELETE_MODAL":
			return { ...state, deleteModalVisible: false, eventToDelete: null };
		case "OPEN_SELECTED_ACTIONS_MODAL":
			return { ...state, selectedActionsVisible: true };
		case "CLOSE_SELECTED_ACTIONS_MODAL":
			return { ...state, selectedActionsVisible: false };
		default:
			return state;
	}
}

/**
 * Centralized modal controller for the MatingEvents feature.
 * No side effects — only manages open/close state.
 */
export function useMatingEventsModals() {
	const [state, dispatch] = useReducer(reducer, initialState);

	const openActionsModal = useCallback(
		(event: MatingEvent) => dispatch({ type: "OPEN_ACTIONS_MODAL", payload: event }),
		[],
	);
	const closeActionsModal = useCallback(
		() => dispatch({ type: "CLOSE_ACTIONS_MODAL" }),
		[],
	);

	const openDeleteModal = useCallback(
		(event: MatingEvent) => dispatch({ type: "OPEN_DELETE_MODAL", payload: event }),
		[],
	);
	const closeDeleteModal = useCallback(
		() => dispatch({ type: "CLOSE_DELETE_MODAL" }),
		[],
	);

	const openSelectedActionsModal = useCallback(
		() => dispatch({ type: "OPEN_SELECTED_ACTIONS_MODAL" }),
		[],
	);
	const closeSelectedActionsModal = useCallback(
		() => dispatch({ type: "CLOSE_SELECTED_ACTIONS_MODAL" }),
		[],
	);

	return {
		actionsModalVisible: state.actionsModalVisible,
		actionForEvent: state.actionForEvent,
		deleteModalVisible: state.deleteModalVisible,
		eventToDelete: state.eventToDelete,
		selectedActionsVisible: state.selectedActionsVisible,
		openActionsModal,
		closeActionsModal,
		openDeleteModal,
		closeDeleteModal,
		openSelectedActionsModal,
		closeSelectedActionsModal,
	};
}
