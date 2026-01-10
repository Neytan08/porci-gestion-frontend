import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { localDateToUtcMidnight, utcIsoOrDateToLocalForDisplay } from "../utils/dateHelpers";

// What DatePickerField expects as props
type DatePickerFieldProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
};

export default function DatePickerField({
  label,
  value,
  onChange,
  mode = "date",
}: DatePickerFieldProps) {
  // State to control the visibility of the date picker modal
  const [isVisible, setIsVisible] = useState(false);

  // Functions to show and hide the date picker modal
  const showPicker = () => setIsVisible(true);
  const hidePicker = () => setIsVisible(false);

  // Handler when a date is confirmed in the picker
  const handleConfirm = (selectedDate: Date) => {
    hidePicker();

    // Convert the selected local date to UTC midnight before passing it back
    const utcDate = localDateToUtcMidnight(selectedDate);
    onChange(utcDate);
  };

  // Convert the incoming UTC ISO/date to local for display
  const localForDisplay = utcIsoOrDateToLocalForDisplay(value);

  // Format the date for display
  const formattedDate = localForDisplay
    ? localForDisplay.toLocaleDateString("es-CR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
      })
    : "";

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.inputBox} onPress={showPicker}>
        <Text style={styles.dateText}>{formattedDate || "Seleccionar fecha"}</Text>
      </TouchableOpacity>
      {/* Setting Date Picker*/}
      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        date={localForDisplay ?? value} // provide the picker a local Date representing the intended day
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
  container: { marginVertical: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  inputBox: {
    borderWidth: 1,
    borderColor: "#37474F",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateText: { fontSize: 16, color: "#333" },
});
