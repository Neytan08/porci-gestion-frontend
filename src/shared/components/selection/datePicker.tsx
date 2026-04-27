import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  localDateToUtcMidnight,
  utcIsoOrDateToLocalForDisplay,
} from "../../utils/dateHelpers";

type DatePickerProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
};

/**
 * Shared date picker field used by forms across the app.
 * It preserves the existing UTC-midnight behavior already used by the project.
 */
export default function DatePicker({
  label,
  value,
  onChange,
  mode = "date",
}: DatePickerProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showPicker = () => setIsVisible(true);
  const hidePicker = () => setIsVisible(false);

  const handleConfirm = (selectedDate: Date) => {
    hidePicker();

    // Keep the same date normalization used by the current forms.
    const utcDate = localDateToUtcMidnight(selectedDate);
    onChange(utcDate);
  };

  const localForDisplay = utcIsoOrDateToLocalForDisplay(value);

  const formattedDate = localForDisplay
    ? localForDisplay.toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour12: false,
      })
    : "";

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.inputBox} onPress={showPicker}>
        <Text style={styles.dateText}>{formattedDate || "Seleccionar fecha"}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        date={localForDisplay ?? value}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        locale="es-ES"
        confirmTextIOS="Aceptar"
        cancelTextIOS="Cancelar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#37474F",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});
