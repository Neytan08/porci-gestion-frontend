import { useCallback, useReducer } from "react";
import type { Boar } from "../api/boarsApi";

/**
 * Canonical UI state for all Boars feature modals.
 * - Keeps modal orchestration centralized in one hook.
 * - No side effects here (alerts, API calls, navigation).
 */
type BoarsModalsState = {
  /** Controls visibility of the filter bottom sheet in BoarsScreen. */
  filterSheetVisible: boolean;
  /** Controls visibility of the contextual actions modal for one selected row. */
  actionsModalVisible: boolean;
  /** Boar currently targeted by the actions modal (Edit/Details/Delete). */
  boarAction: Boar | null;
  /** Controls visibility of the delete confirmation modal. */
  deleteModalVisible: boolean;
  /** Boar queued for deletion after user confirmation. */
  deleteSelectedBoar: { boar_id: number; boar_tag_number: string } | null;
  /** Controls visibility of the bulk actions modal for multi-selection. */
  selectedActionsVisible: boolean;
};

/**
 * All allowed state transitions for Boars modals.
 */
type BoarsModalsAction =
  | { type: "OPEN_FILTER_SHEET" }
  | { type: "CLOSE_FILTER_SHEET" }
  | { type: "OPEN_ACTIONS_MODAL"; payload: Boar }
  | { type: "CLOSE_ACTIONS_MODAL" }
  | { type: "OPEN_DELETE_MODAL"; payload: { boarId: number; boarTag: string } }
  | { type: "CLOSE_DELETE_MODAL" }
  | { type: "OPEN_SELECTED_ACTIONS_MODAL" }
  | { type: "CLOSE_SELECTED_ACTIONS_MODAL" };

/**
 * Initial modal state when screens mount.
 */
const initialState: BoarsModalsState = {
  filterSheetVisible: false,
  actionsModalVisible: false,
  boarAction: null,
  deleteModalVisible: false,
  deleteSelectedBoar: null,
  selectedActionsVisible: false,
};

/**
 * Pure reducer that translates user intents (actions) into the next modal state.
 */
function reducer(state: BoarsModalsState, action: BoarsModalsAction): BoarsModalsState {
  switch (action.type) {
    case "OPEN_FILTER_SHEET":
      return { ...state, filterSheetVisible: true };
    case "CLOSE_FILTER_SHEET":
      return { ...state, filterSheetVisible: false };
    case "OPEN_ACTIONS_MODAL":
      return { ...state, actionsModalVisible: true, boarAction: action.payload };
    case "CLOSE_ACTIONS_MODAL":
      return { ...state, actionsModalVisible: false, boarAction: null };
    case "OPEN_DELETE_MODAL":
      return {
        ...state,
        deleteModalVisible: true,
        deleteSelectedBoar: {
          boar_id: action.payload.boarId,
          boar_tag_number: action.payload.boarTag,
        },
      };
    case "CLOSE_DELETE_MODAL":
      return { ...state, deleteModalVisible: false, deleteSelectedBoar: null };
    case "OPEN_SELECTED_ACTIONS_MODAL":
      return { ...state, selectedActionsVisible: true };
    case "CLOSE_SELECTED_ACTIONS_MODAL":
      return { ...state, selectedActionsVisible: false };
    default:
      return state;
  }
}

/**
 * Centralized modal controller for the Boars feature.
 *
 * Public API intentionally exposes semantic callbacks (`openX` / `closeX`)
 * so screens do not depend on reducer internals or action type strings.
 */
export function useBoarsModals() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openFilterSheet = useCallback(() => dispatch({ type: "OPEN_FILTER_SHEET" }), []);
  const closeFilterSheet = useCallback(() => dispatch({ type: "CLOSE_FILTER_SHEET" }), []);

  const openActionsModal = useCallback(
    (boar: Boar) => dispatch({ type: "OPEN_ACTIONS_MODAL", payload: boar }), []);
  const closeActionsModal = useCallback(() => dispatch({ type: "CLOSE_ACTIONS_MODAL" }), []);

  const openDeleteModal = useCallback(
    (boarId: number, boarTag: string) =>
      dispatch({ type: "OPEN_DELETE_MODAL", payload: { boarId, boarTag } }), []);
  const closeDeleteModal = useCallback(() => dispatch({ type: "CLOSE_DELETE_MODAL" }), []);

  const openSelectedActionsModal = useCallback(() => dispatch({ type: "OPEN_SELECTED_ACTIONS_MODAL" }), []);
  const closeSelectedActionsModal = useCallback(() => dispatch({ type: "CLOSE_SELECTED_ACTIONS_MODAL" }), []);

  return {
    filterSheetVisible: state.filterSheetVisible,
    openFilterSheet,
    closeFilterSheet,
    actionsModalVisible: state.actionsModalVisible,
    boarAction: state.boarAction,
    openActionsModal,
    closeActionsModal,
    deleteModalVisible: state.deleteModalVisible,
    deleteSelectedBoar: state.deleteSelectedBoar,
    openDeleteModal,
    closeDeleteModal,
    selectedActionsVisible: state.selectedActionsVisible,
    openSelectedActionsModal,
    closeSelectedActionsModal,
  };
}
