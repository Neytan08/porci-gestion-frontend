import { memo } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type BoarSelectedActionsModalProps = {
  visible: boolean;
  /** Number of currently selected boars; shown in the modal title. */
  selectedCount: number;
  /** Close this modal without performing any action. */
  onClose: () => void;
  /** Clear the entire multi-selection set. */
  onDeselect: () => void;
};

/**
 * Bottom-sheet modal for batch operations on a selection of boars in BoarsScreen.
 * Currently exposes PDF export, retire, and clear-selection actions.
 */
function BoarSelectedActionsModal({
  visible,
  selectedCount,
  onClose,
  onDeselect,
}: BoarSelectedActionsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{`Verracos Seleccionados (${selectedCount})`}</Text>
          <View style={styles.btnRow}>
            {/* PDF Export — not yet implemented */}
            <Pressable style={styles.btn} onPress={() => Alert.alert('Función no implementada')}>
              <Image
                source={require('../../../../assets/icons/pdf-file.png')}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={{ fontWeight: '700', textAlign: 'center' }}>Extraer a PDF</Text>
            </Pressable>
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
  },
  icon: { width: 42, height: 42 },
});

export default memo(BoarSelectedActionsModal);
