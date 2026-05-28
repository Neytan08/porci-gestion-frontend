import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { RootStackParamList } from '../../../app/navigation/rootStack.types';
import { useDeleteEntity } from '../../../shared/hooks/useDeleteEntity';
import { type Boar, deleteBoar } from '../api/boarsApi';

type BoarsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Boars'>;

interface BoarModalsCallbacks {
  openDeleteModal: (boarId: number, boarTag: string) => void;
  closeActionsModal: () => void;
  closeDeleteModal: () => void;
}

interface UseBoarActionsParams {
  navigation: BoarsNavigationProp;
  /** Reloads the boars list; passed to useDeleteEntity as the post-delete callback. */
  loadBoars: () => Promise<void>;
  modals: BoarModalsCallbacks;
  deleteSelectedBoar: { boar_id: number; boar_tag_number: string } | null;
}

interface UseBoarActionsReturn {
  /** Navigate to the AddBoar screen. */
  handleAdd: () => void;
  /** Navigate to the DetailsBoar screen for a given boar ID. */
  handleDetails: (boarId: number) => void;
  /** Open the delete modal from a long-press gesture on a list row. */
  handleDeletePress: (boarId: number, boarTag: string) => void;
  /**
   * Dispatch an action from the contextual actions modal.
   * Closes the modal first, then navigates or opens the delete modal.
   */
  handleBoarAction: (action: 'edit' | 'delete' | 'moreDetails', boar: Boar) => void;
  /** Execute the deletion of the currently selected boar after user confirmation. */
  confirmDelete: () => Promise<void>;
  deleting: boolean;
}

/**
 * Hook for managing boar navigation and delete operations in BoarsScreen.
 * Centralises navigation callbacks, useDeleteEntity setup, and modal orchestration
 * so the screen acts purely as an orchestrator.
 *
 * @param navigation - Navigation prop for the Boars screen.
 * @param loadBoars - Callback to reload the list after a successful deletion.
 * @param modals - Callbacks for opening/closing relevant modals.
 * @param deleteSelectedBoar - The boar currently queued for deletion.
 */
export function useBoarActions({
  navigation,
  loadBoars,
  modals,
  deleteSelectedBoar,
}: UseBoarActionsParams): UseBoarActionsReturn {
  const { openDeleteModal, closeActionsModal, closeDeleteModal } = modals;

  const { deleting, deleteById } = useDeleteEntity<number>({
    deleteFn: deleteBoar,
    onDeleted: loadBoars,
    messages: {
      successTitle: 'Eliminación completada',
      successMessage: 'El verraco fue eliminado correctamente.',
      errorTitle: 'Error',
      errorMessage: 'No se pudo eliminar el verraco. Intente nuevamente.',
    },
  });

  const handleAdd = useCallback(() => {
    navigation.navigate('AddBoar');
  }, [navigation]);

  const handleDetails = useCallback(
    (boarId: number) => {
      navigation.navigate('DetailsBoar', { boarId });
    },
    [navigation],
  );

  /** Always closes the actions modal first for a consistent UX across all action types. */
  const handleBoarAction = useCallback(
    (action: 'edit' | 'delete' | 'moreDetails', boar: Boar) => {
      closeActionsModal();
      if (action === 'edit') {
        navigation.navigate('EditBoar', { boarId: boar.boar_id });
      } else if (action === 'moreDetails') {
        navigation.navigate('DetailsBoar', { boarId: boar.boar_id });
      } else if (action === 'delete') {
        openDeleteModal(boar.boar_id, boar.boar_tag_number);
      }
    },
    [navigation, openDeleteModal, closeActionsModal],
  );

  const handleDeletePress = useCallback(
    (boarId: number, boarTag: string) => {
      openDeleteModal(boarId, boarTag);
    },
    [openDeleteModal],
  );

  const confirmDelete = useCallback(async () => {
    if (!deleteSelectedBoar) return;
    closeDeleteModal();
    await deleteById(deleteSelectedBoar.boar_id);
  }, [deleteSelectedBoar, closeDeleteModal, deleteById]);

  return { handleAdd, handleDetails, handleDeletePress, handleBoarAction, confirmDelete, deleting };
}
