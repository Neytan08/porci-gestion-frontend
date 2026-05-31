import { memo, useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type EditBoarTagModalProps = {
  visible: boolean;
  /** Value used to initialize the input when the modal opens. The parent state is not mutated until the user confirms. */
  initialValue: string;
  /**
   * Called when the user confirms the edit.
   * Receives the trimmed, validated value — the parent should apply it to its state.
   */
  onConfirm: (tagNumber: string) => void;
  /** Called when the user dismisses without saving. Parent state is left unchanged. */
  onCancel: () => void;
};

/**
 * Modal for editing the boar's tag number (identifier) in EditBoarScreen.
 * Maintains an internal draft state so the original value is preserved until confirmed.
 */
function EditBoarTagModal({ visible, initialValue, onConfirm, onCancel }: EditBoarTagModalProps) {
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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.container}>
        {/* Overlay */}
        <Pressable style={styles.overlay} onPress={onCancel} />
        <View style={styles.panel}>
          <Text style={styles.title}>Editar identificador</Text>
          <TextInput
            accessibilityLabel="Identificador del verraco"
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            autoFocus
          />
          <View style={styles.btnRow}>
            <Pressable style={[styles.btn, { backgroundColor: "#e0e0e0" }]} onPress={onCancel}>
              <Text style={styles.btnText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor: "#2E7D32" }]} onPress={handleConfirm}>
              <Text style={[styles.btnText, { color: "#fff" }]}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  panel: {
    minWidth: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    zIndex: 500,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#37474F",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    fontWeight: "700",
  },
});

export default memo(EditBoarTagModal);
