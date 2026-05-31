import { memo, useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type EditSowTagModalProps = {
  visible: boolean;
  /** Value used to initialize the input when the modal opens. The parent state is not mutated until the user confirms. */
  initialValue: string;
  /**
   * Called when the user confirms the edit.
   * Receives the trimmed, validated value — the parent should apply it to its state.
   */
  onConfirm: (trimmedValue: string) => void;
  /** Called when the user dismisses without saving. Parent state is left unchanged. */
  onCancel: () => void;
};

/**
 * Modal for editing the sow tag number (identifier) in EditSowScreen.
 * Maintains an internal draft state so the original value is preserved until confirmed.
 */
function EditSowTagModal({ visible, initialValue, onConfirm, onCancel }: EditSowTagModalProps) {
  const [draft, setDraft] = useState(initialValue);

  // Reset draft to the current saved value every time the modal opens.
  useEffect(() => {
    if (visible) {
      setDraft(initialValue);
    }
  }, [visible, initialValue]);

  const handleConfirm = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      Alert.alert("Error", "El identificador no puede estar vacío.");
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <Text style={styles.title}>Editar identificador</Text>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            accessibilityLabel="Editar identificador de la cerda"
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  panel: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default memo(EditSowTagModal);