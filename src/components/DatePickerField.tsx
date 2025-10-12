import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Ionicons } from "@expo/vector-icons";

type DatePickerFieldProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
};

export default function DatePickerField({
  label,
  value,
  onChange,
  mode = "datetime",
  minimumDate,
  maximumDate,
}: DatePickerFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  const showPicker = () => setIsVisible(true);
  const hidePicker = () => setIsVisible(false);

  const handleConfirm = (selectedDate: Date) => {
    hidePicker();
    onChange(selectedDate);
  };

  // 👇 formato personalizado dd/MM/yyyy hh/mm/sec
  const formattedDate = value
  ? value.toLocaleString("es-CR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  : "";

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity style={styles.inputBox} onPress={showPicker}>
        <Text style={styles.dateText}>{formattedDate || "Seleccionar fecha"}</Text>
      </TouchableOpacity>
      {/* Setting to the calendar */}
      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        date={value}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        locale="es-ES"
        confirmTextIOS="Aceptar"
        cancelTextIOS="Cancelar"
        is24Hour={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateText: { fontSize: 16, color: "#333" },
});
