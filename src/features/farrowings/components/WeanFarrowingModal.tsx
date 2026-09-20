import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { localDateToUtcMidnight } from "../../../shared/utils/dateHelpers";
import { weanFarrowing } from "../api/farrowingsApi";

type WeanFarrowingModalProps = {
  farrowingId: number;
  onConfirm: () => void | Promise<void>;
  visible: boolean;
  onClose: () => void;
};

/** Modal for recording the actual date and number of piglets at weaning. */
export default function WeanFarrowingModal({
  farrowingId,
  onConfirm,
  visible,
  onClose,
}: WeanFarrowingModalProps) {
  const [weanedDate, setWeanedDate] = useState(localDateToUtcMidnight(new Date()));
  const [weanedPiglets, setWeanedPiglets] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setWeanedDate(localDateToUtcMidnight(new Date()));
    setWeanedPiglets("");
  };

  const closeModal = () => {
    if (loading) return;
    onClose();
    resetForm();
  };

  const handleConfirm = async () => {
    const trimmedPiglets = weanedPiglets.trim();
    const piglets = Number(trimmedPiglets);

    if (!trimmedPiglets || !Number.isInteger(piglets) || piglets < 0) {
      Alert.alert(
        "Campos requeridos",
        "Debe indicar un numero entero no negativo de lechones destetados.",
      );
      return;
    }

    Alert.alert(
      "Destetar parto",
      "Esta accion es irreversible, desea continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: () => void submitWeaning(piglets),
        },
      ],
    );
  };

  const submitWeaning = async (piglets: number) => {
    setLoading(true);
    try {
      await weanFarrowing(farrowingId, {
        weaned_date: weanedDate.toISOString(),
        weaned_piglets: piglets,
      });
      await onConfirm();
      onClose();
      resetForm();
    } catch (error) {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, {
          fallback: "No se pudo completar el destete del parto.",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.overlay} onPress={closeModal} />
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Destetar parto</Text>

          <DatePickerField
            label="Fecha de Destete *"
            value={weanedDate}
            onChange={setWeanedDate}
          />

          <Text style={styles.label}>Lechones Destetados *</Text>
          <TextInput
            value={weanedPiglets}
            onChangeText={setWeanedPiglets}
            placeholder="Ingrese la cantidad"
            placeholderTextColor="#9E9E9E"
            style={styles.numberInput}
            keyboardType="number-pad"
            editable={!loading}
          />

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
              onPress={closeModal}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.confirmButton,
                pressed && styles.pressed,
                loading && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Destetar</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalContainer: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: "#37474F",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#263238",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  cancelButton: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ECEFF1",
  },
  confirmButton: {
    minWidth: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#2E7D32",
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButtonText: {
    color: "#263238",
    fontWeight: "700",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.5,
  },
});
