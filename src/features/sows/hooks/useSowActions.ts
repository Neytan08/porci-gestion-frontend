import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { RootStackParamList } from '../../../app/navigation/rootStack.types';
import { useDeleteEntity } from '../../../shared/hooks/useDeleteEntity';
import { deleteSowById, type Sow } from '../api/sowsApi';

type SowsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sows'>;

interface SowModalsCallbacks { 
  openDeleteModal: (sowId: number, sowTag: string) => void;
  closeActionsModal: () => void;
  closeDeleteModal: () => void;
}

interface UseSowActionsParams {
  navigation: SowsNavigationProp;
  /** Reloads the sows list; passed to useDeleteEntity as the post-delete callback. */
  loadSows: () => Promise<void>;
  modals: SowModalsCallbacks;
  deleteSelectedSow: { sow_id: number; sow_tag_number: string } | null;
}

interface UseSowActionsReturn {
  /** Navigate to the AddSow screen. */
  handleAdd: () => void;
  /** Navigate to the DetailsSow screen for a given sow ID. */
  handleDetails: (sowId: number, selectedSowCount?: number) => void;
  /** Open the delete modal from a long-press gesture on a list row. */
  handleDeletePress: (sowId: number, sowTag: string) => void;
  /**
   * Dispatch an action from the contextual actions modal.
   * Closes the modal first, then navigates or opens the delete modal.
   */
  handleSowAction: (action: 'edit' | 'delete' | 'moreDetails', sow: Sow) => void;
  /** Execute the deletion of the currently selected sow after user confirmation. */
  confirmDelete: () => Promise<void>;
  deleting: boolean;
}

/**
 * Hook for managing sow navigation and delete operations in SowsScreen.
 * Centralises navigation callbacks, useDeleteEntity setup, and modal orchestration
 * so the screen acts purely as an orchestrator.
 *
 * @param navigation - Navigation prop for the Sows screen.
 * @param loadSows - Callback to reload the list after a successful deletion.
 * @param modals - Callbacks for opening/closing relevant modals.
 * @param deleteSelectedSow - The sow currently queued for deletion.
 */
export function useSowActions({
  navigation,
  loadSows,
  modals,
  deleteSelectedSow,
}: UseSowActionsParams): UseSowActionsReturn {
  const { openDeleteModal, closeActionsModal, closeDeleteModal } = modals;

  const { deleting, deleteById } = useDeleteEntity<number>({
    deleteFn: deleteSowById,
    onDeleted: loadSows,
    messages: {
      successTitle: 'Eliminación completada',
      successMessage: 'La cerda fue eliminada correctamente.',
      errorTitle: 'Error',
      errorMessage: 'No se pudo eliminar la cerda. Intente nuevamente.',
    },
  });

  const handleAdd = useCallback(() => {
    navigation.navigate('AddSow');
  }, [navigation]);

  const handleDetails = useCallback(
    (sowId: number, selectedSowCount?: number) => {
      navigation.navigate('DetailsSow', { sowId, selectedSowCount });
    },
    [navigation],
  );

  /** Always closes the actions modal first for a consistent UX across all action types. */
  const handleSowAction = useCallback(
    (action: 'edit' | 'delete' | 'moreDetails', sow: Sow) => {
      closeActionsModal();
      if (action === 'edit') {
        navigation.navigate('EditSow', { sowId: sow.sow_id });
      } else if (action === 'moreDetails') {
        navigation.navigate('DetailsSow', { sowId: sow.sow_id });
      } else if (action === 'delete') {
        openDeleteModal(sow.sow_id, sow.sow_tag_number);
      }
    },
    [navigation, openDeleteModal, closeActionsModal],
  );

  const handleDeletePress = useCallback(
    (sowId: number, sowTag: string) => {
      openDeleteModal(sowId, sowTag);
    },
    [openDeleteModal],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteSelectedSow) return;
    closeDeleteModal();
    await deleteById(deleteSelectedSow.sow_id);
  }, [deleteSelectedSow, closeDeleteModal, deleteById]);

  return {
    handleAdd,
    handleDetails,
    handleDeletePress,
    handleSowAction,
    confirmDelete,
    deleting,
  };
}
