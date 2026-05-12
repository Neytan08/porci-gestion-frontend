import { memo } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type SowTagNumberBannerProps = {
  visible: boolean;
  /** Current value of the tag number input (controlled). */
  value: string;
  /** Called on every keystroke to update the controlled value in the parent. */
  onChange: (text: string) => void;
  /**
   * Called when the user confirms the edit.
   * Receives the trimmed, validated value — the parent should apply it to its state.
   */
  onConfirm: (trimmedValue: string) => void;
  /** Called when the user dismisses without saving. */
  onCancel: () => void;
};

/**
 * Inline modal for editing the sow tag number (identifier) in EditSowScreen.
 * Validates that the value is not empty before confirming.
 * Extracted from EditSowScreen to isolate the modal JSX and validation logic.
 *
 * Used by: EditSowScreen.
 */
function SowTagNumberBanner({
  visible,
  value,
  onChange,
  onConfirm,
  onCancel,
}: SowTagNumberBannerProps) {
  const handleConfirm = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.banner}>
          <Text style={styles.title}>Ingrese el nombre</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  banner: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default memo(SowTagNumberBanner);
