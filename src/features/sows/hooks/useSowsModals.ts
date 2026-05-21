import { useCallback, useReducer } from 'react';
import type { Sow } from '../api/sowsApi';

/**
 * Canonical UI state for all Sows feature modals
 * - Keeps modal orchestration centralized in one hook
 * - No side effects here (alerts, API calls, navigation)
 */
type SowsModalsState = {
  /** Controls visibility of the filter bottom sheet in SowsScreen. */
  filterSheetVisible: boolean;
  /** Controls visibility of the contextual actions modal for one selected row. */
  actionsModalVisible: boolean;
  /** Sow currently targeted by the actions modal (Edit/Details/Delete). */
  sowAction: Sow | null;
  /** Controls visibility of the delete confirmation modal. */
  deleteModalVisible: boolean;
  /** Sow queued for deletion after user confirmation. */
  deleteSelectedSow: { sow_id: number; sow_tag_number: string } | null;
  /** Controls visibility of the bulk actions modal for multi-selection. */
  selectedActionsVisible: boolean;
  /** Controls visibility of the edit-tag modal used in EditSowScreen. */
  editSowTagVisible: boolean;
};

/**
 * All allowed state transitions for Sows modals.
 * - Each action has a known shape
 * - Payloads are required only when needed
 */
type SowsModalsAction =
    { type: 'OPEN_FILTER_SHEET' }
  | { type: 'CLOSE_FILTER_SHEET' }
  | { type: 'OPEN_ACTIONS_MODAL'; payload: Sow }
  | { type: 'CLOSE_ACTIONS_MODAL' }
  | { type: 'OPEN_DELETE_MODAL'; payload: { sowId: number; sowTag: string } }
  | { type: 'CLOSE_DELETE_MODAL' }
  | { type: 'OPEN_SELECTED_ACTIONS_MODAL' }
  | { type: 'CLOSE_SELECTED_ACTIONS_MODAL' }
  | { type: 'OPEN_EDIT_SOW_TAG_MODAL' }
  | { type: 'CLOSE_EDIT_SOW_TAG_MODAL' };

/**
 * Initial modal state when screens mount
 */
const initialState: SowsModalsState = {
  filterSheetVisible: false,
  actionsModalVisible: false,
  sowAction: null,
  deleteModalVisible: false,
  deleteSelectedSow: null,
  selectedActionsVisible: false,
  editSowTagVisible: false,
};

/**
 * Pure reducer that translates user intents (actions) into the next modal state
 */
function reducer(state: SowsModalsState, action: SowsModalsAction): SowsModalsState {
  switch (action.type) {
    case 'OPEN_FILTER_SHEET':
      return { ...state, filterSheetVisible: true };
    case 'CLOSE_FILTER_SHEET':
      return { ...state, filterSheetVisible: false };
    case 'OPEN_ACTIONS_MODAL':
      return { ...state, actionsModalVisible: true, sowAction: action.payload };
    case 'CLOSE_ACTIONS_MODAL':
      return { ...state, actionsModalVisible: false, sowAction: null };
    case 'OPEN_DELETE_MODAL':
      return {
        ...state,
        deleteModalVisible: true,
        deleteSelectedSow: {
          sow_id: action.payload.sowId,
          sow_tag_number: action.payload.sowTag,
        },
      };
    case 'CLOSE_DELETE_MODAL':
      return { ...state, deleteModalVisible: false, deleteSelectedSow: null };
    case 'OPEN_SELECTED_ACTIONS_MODAL':
      return { ...state, selectedActionsVisible: true };
    case 'CLOSE_SELECTED_ACTIONS_MODAL':
      return { ...state, selectedActionsVisible: false };
    case 'OPEN_EDIT_SOW_TAG_MODAL':
      return { ...state, editSowTagVisible: true };
    case 'CLOSE_EDIT_SOW_TAG_MODAL':
      return { ...state, editSowTagVisible: false };
    default:
      return state;
  }
}

/**
 * Centralized modal controller for the Sows feature.
 *
 * Public API intentionally exposes semantic callbacks (`openX` / `closeX`)
 * so screens do not depend on reducer internals or action type strings.
 */
export function useSowsModals() {
  /** Current modal graph state + dispatch pipeline managed by reducer. */
  const [state, dispatch] = useReducer(reducer, initialState);

  const openFilterSheet = useCallback(() => dispatch({ type: 'OPEN_FILTER_SHEET' }), []);
  const closeFilterSheet = useCallback(() => dispatch({ type: 'CLOSE_FILTER_SHEET' }), []);

  const openActionsModal = useCallback(
    (sow: Sow) => dispatch({ type: 'OPEN_ACTIONS_MODAL', payload: sow }), [],  );
  const closeActionsModal = useCallback(() => dispatch({ type: 'CLOSE_ACTIONS_MODAL' }), []);

  const openDeleteModal = useCallback(
    (sowId: number, sowTag: string) =>
      dispatch({ type: 'OPEN_DELETE_MODAL', payload: { sowId, sowTag } }), []);
  const closeDeleteModal = useCallback(() => dispatch({ type: 'CLOSE_DELETE_MODAL' }), []);

  const openSelectedActionsModal = useCallback(() => dispatch({ type: 'OPEN_SELECTED_ACTIONS_MODAL' }), []);
  const closeSelectedActionsModal = useCallback(() => dispatch({ type: 'CLOSE_SELECTED_ACTIONS_MODAL' }), []);

  const openEditSowTag = useCallback(() => dispatch({ type: 'OPEN_EDIT_SOW_TAG_MODAL' }), []);
  const closeEditSowTag = useCallback(() => dispatch({ type: 'CLOSE_EDIT_SOW_TAG_MODAL' }), []);

  return {
    ...state,
    openFilterSheet,
    closeFilterSheet,
    openActionsModal,
    closeActionsModal,
    openDeleteModal,
    closeDeleteModal,
    openSelectedActionsModal,
    closeSelectedActionsModal,
    openEditSowTag,
    closeEditSowTag,
  };
}