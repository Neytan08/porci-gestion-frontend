import { useCallback, useState } from 'react';
import type { Sow } from '../api/sowsApi';

interface UseSowsModalsReturn {
  // Filter sheet modal
  filterSheetVisible: boolean;
  openFilterSheet: () => void;
  closeFilterSheet: () => void;

  // Individual sow actions modal
  actionsModalVisible: boolean;
  sowAction: Sow | null;
  openActionsModal: (sow: Sow) => void;
  closeActionsModal: () => void;

  // Delete confirmation modal
  deleteModalVisible: boolean;
  deleteSelectedSow: { sow_id: number; sow_tag_number: string } | null;
  openDeleteModal: (sowId: number, sowTag: string) => void;
  closeDeleteModal: () => void;

  // Selected sows actions modal
  selectedActionsVisible: boolean;
  openSelectedActionsModal: () => void;
  closeSelectedActionsModal: () => void;

  // Edit Sow Tag modal
  editSowTagVisible: boolean;
  openEditSowTag: () => void;
  closeEditSowTag: () => void;
}

/**
 * Hook for managing all modal states in SowsScreen
 * Centralizes modal visibility and data management
 */
export function useSowsModals(): UseSowsModalsReturn {
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [actionsModalVisible, setActionsModalVisible] = useState(false);
  const [sowAction, setSowAction] = useState<Sow | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteSelectedSow, setDeleteSelectedSow] = useState<{
    sow_id: number;
    sow_tag_number: string;
  } | null>(null);
  const [selectedActionsVisible, setSelectedActionsVisible] = useState(false);
  const [editSowTagVisible, setEditSowTagVisible] = useState(false);
  
  // Filter sheet modal
  const openFilterSheet = useCallback(() => {
    setFilterSheetVisible(true);
  }, []);

  const closeFilterSheet = useCallback(() => {
    setFilterSheetVisible(false);
  }, []);

  // Individual sow actions modal
  const openActionsModal = useCallback((sow: Sow) => {
    setSowAction(sow);
    setActionsModalVisible(true);
  }, []);

  const closeActionsModal = useCallback(() => {
    setActionsModalVisible(false);
    setSowAction(null);
  }, []);

  // Delete confirmation modal
  const openDeleteModal = useCallback((sowId: number, sowTag: string) => {
    setDeleteSelectedSow({ sow_id: sowId, sow_tag_number: sowTag });
    setDeleteModalVisible(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalVisible(false);
    setDeleteSelectedSow(null);
  }, []);

  // Selected sows actions modal
  const openSelectedActionsModal = useCallback(() => {
    setSelectedActionsVisible(true);
  }, []);

  const closeSelectedActionsModal = useCallback(() => {
    setSelectedActionsVisible(false);
  }, []);

  // Edit Sow Tag modal
  const openEditSowTag = useCallback(() => {
    setEditSowTagVisible(true);
  }, []);

  const closeEditSowTag = useCallback(() => {
    setEditSowTagVisible(false);
  }, []);

  return {
    filterSheetVisible,
    openFilterSheet,
    closeFilterSheet,
    actionsModalVisible,
    sowAction,
    openActionsModal,
    closeActionsModal,
    deleteModalVisible,
    deleteSelectedSow,
    openDeleteModal,
    closeDeleteModal,
    selectedActionsVisible,
    openSelectedActionsModal,
    closeSelectedActionsModal,
    editSowTagVisible,
    openEditSowTag,
    closeEditSowTag,
  };
}

