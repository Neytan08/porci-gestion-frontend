import { memo } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import RetireSowModal from './RetireSowModal';

type SowSelectedActionsModalProps = {
  visible: boolean;
  /** Number of currently selected sows; shown in the modal title. */
  selectedCount: number;
  /** IDs of the currently selected sows. */
  selectedIds: number[];
  /** Close this modal without performing any action. */
  onClose: () => void;
  /** Clear the entire multi-selection set. */
  onDeselect: () => void;
  /** Refresh parent state after selected sows are retired. */
  onRetired: () => void | Promise<void>;
};

/**
 * Bottom-sheet modal for batch operations on a selection of sows in SowsScreen.
 * Currently exposes PDF export, retire, and clear-selection actions.
 */
function SowSelectedActionsModal({
  visible,
  selectedCount,
  selectedIds,
  onClose,
  onDeselect,
  onRetired,
}: SowSelectedActionsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{`Cerdas Seleccionadas (${selectedCount})`}</Text>
          <View style={styles.btnRow}>
            {/* PDF Export — not yet implemented */}
            <Pressable
              style={styles.btn}
              onPress={() => Alert.alert('Funcion no implementada')}
            >
              <Image
                source={require('../../../../assets/icons/pdf-file.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: '700', textAlign: 'center' }}>Extraer a PDF</Text>
            </Pressable>

            {/* Retire selected sows */}
            <RetireSowModal
              selectedIds={selectedIds}
              onConfirm={async () => {
                await onRetired();
                onDeselect();
                onClose();
              }}
              label="Retirar Cerdas"
              containerStyle={styles.btn}
              imageStyle={styles.icon}
            />

            {/* Clear selection */}
            <Pressable
              style={styles.btn}
              onPress={() => {
                onDeselect();
                onClose();
              }}
            >
              <Image
                source={require('../../../../assets/icons/uncheck.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: '700', textAlign: 'center' }}>Limpiar Selección</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: { width: 42, height: 42 },
});

export default memo(SowSelectedActionsModal);
