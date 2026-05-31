import { memo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DeleteAction from '../../../shared/components/actions/deleteAction';
import DetailsAction from '../../../shared/components/actions/detailsAction';
import EditAction from '../../../shared/components/actions/editAction';
import type { Boar } from '../api/boarsApi';

type BoarActionsModalProps = {
  visible: boolean;
  /** The boar the actions apply to; used to display the identifier in the title. */
  boar: Boar | null;
  /** Navigate to the EditBoar screen. */
  onEdit: () => void;
  /** Navigate to the DetailsBoar screen. */
  onDetails: () => void;
  /** Open the delete confirmation modal. */
  onDelete: () => void;
  /** Close this modal without performing any action. */
  onClose: () => void;
  /** Optional callback executed before any action (Edit, Details, Delete). */
  onBeforeAction?: () => void;
};

/**
 * Contextual actions modal for a single boar row in BoarsScreen.
 * Renders Edit, Details, and Delete action buttons for the selected boar.
 * The parent is responsible for closing the modal before performing navigation.
 */
function BoarActionsModal({
  visible,
  boar,
  onEdit,
  onDetails,
  onDelete,
  onClose,
  onBeforeAction,
}: BoarActionsModalProps) {
  const handleAction = (action: () => void) => {
    onBeforeAction?.();
    action();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Overlay catches touches outside the panel and closes the modal */}
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.panel}>
          <Text style={styles.title}>
            Acciones Disponibles: {boar?.boar_tag_number ?? boar?.boar_id}
          </Text>
          <View style={styles.actions}>
            <EditAction onPress={() => handleAction(onEdit)} />
            <DetailsAction onPress={() => handleAction(onDetails)} />
            <DeleteAction onPress={onDelete} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  panel: {
    minWidth: 300,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    zIndex: 500,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default memo(BoarActionsModal);
