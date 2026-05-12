import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { getApiErrorMessage, hasApiStatus } from "../../../shared/api/apiError";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { localDateToUtcMidnight , utcIsoStringFromLocalDate } from "../../../shared/utils/dateHelpers";
import { BreedDropdown } from "../../reference-data/breeds/components/BreedDropdown";
import { StatusDropdown } from "../../reference-data/statuses/components/StatusDropdown";
import { createSow, type Sow } from "../api/sowsApi";
import SowFormFields, { type SowFormFieldValues  }  from "../components/SowFormFields";

/**
 * Screen for creating a new sow record.
 * Uses SowFormFields for the shared numeric/text inputs and getApiErrorMessage
 * for standardised API error handling.
 */
export default function AddSow() {
  const navigation = useNavigation();
  // Entry date initialised to UTC midnight to match the app-wide convention
  const [entryDate, setEntryDate] = useState(localDateToUtcMidnight(new Date()));
  const [statusId, setStatusId] = useState<number | null>(null);
  const [breedId, setBreedId] = useState<number | null>(null);
  const [tagNumber, setTagNumber] = useState("");
  const [fields, setFields] = useState<SowFormFieldValues>({
    mammary_glands: "",
    weight: "",
    length: "",
    farrowing_number: "",
    description: "",
  });

  // TODO: Add server-side validation for duplicate sow_tag_number before submission
  const handleSubmit = async () => {
    try {
      const finalData = {
        sow_tag_number: tagNumber,
        entry_date: utcIsoStringFromLocalDate(entryDate),
        status_id: Number(statusId),
        breed_id: Number(breedId),
      };
      // Validate required fields
      if (
        !finalData.sow_tag_number ||
        !finalData.entry_date ||
        !finalData.breed_id ||
        !fields.mammary_glands ||
        !finalData.status_id
      ) {
        Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
        return;
      }
      const payload: Partial<Sow> = {
        ...finalData,
        weight: fields.weight ? parseFloat(fields.weight) : null,
        length: fields.length ? parseFloat(fields.length) : null,
        mammary_glands: fields.mammary_glands ? parseFloat(fields.mammary_glands) : 0,
        farrowing_number: fields.farrowing_number ? parseFloat(fields.farrowing_number) : 0,
        description: fields.description || null,
      };
      await createSow(payload);
      Alert.alert("Éxito", "Cerda agregada correctamente.");
      navigation.goBack();
    } catch (error) {
      // Use the shared error handler for consistent messages across the app
      const message = hasApiStatus(error, 409)
        ? "Ya existe un registro con este identificador. Por favor, use un identificador único."
        : getApiErrorMessage(error, { fallback: "Hubo un problema al agregar la cerda. Intente nuevamente." });
      Alert.alert("Error", message);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.title}>Agregar Nueva Cerda</Text>

        <Text style={styles.label}>Indentificador Animal *</Text>
        <TextInput
          style={styles.input}
          value={tagNumber}
          onChangeText={setTagNumber}
          placeholder="Ej: 12345"
        />
        <StatusDropdown
          value={statusId}
          onChange={(value: number, _label: string) => setStatusId(Number(value))}
        />
        <BreedDropdown
          value={breedId}
          onChange={(value: number, _label: string) => setBreedId(Number(value))}
        />
        <DatePickerField
          label="Fecha de Ingreso *"
          value={entryDate}
          onChange={(date) => setEntryDate(date)}
        />

        {/* Shared form fields for numeric/text sow attributes */}
        <SowFormFields
          values={fields}
          onChange={(key, value) => setFields((prev) => ({ ...prev, [key]: value }))}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#37474F",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FFA000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

