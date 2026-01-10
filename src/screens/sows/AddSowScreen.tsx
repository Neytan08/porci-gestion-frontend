import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createSow } from "../../api/sowsApi";
import DatePickerField from "../../components/DatePickerField";
import { StatusDropdown } from "../../components/StatusDropdown";
import { BreedDropdown } from "../../components/BreedDropdown";

export default function AddSow() {
  const navigation = useNavigation();
  const [entryDate, setEntryDate] = useState(new Date()); // DatePicker state and handlers
  const [statusId, setStatusId] = useState<number | null>(null); // Status call
  const [breedId, setBreedId] = useState<number | null>(null); // Breed call
  const [form, setForm] = useState({ // In case of need to add more fields, extend this form state (needs to match the API)
    sow_tag_number: "",
    entry_date: "",
    weight: "",
    length: "",
    mammary_glands: "",
    farrowing_number: "",
    description: "",
    removal_date: "0000-00-00 00:00:00.000",
    removal_reason: "",
    last_weaning_date: "0000-00-00 00:00:00.000",
  });
  
  const handleSubmit = async () => {
    try {
      const finalData = {//Joining the data
        ...form,
        entry_date: entryDate.toISOString(),
        status_id: Number(statusId),
        breed_id: Number(breedId),
      };
      // Validate required fields
      if (!finalData.sow_tag_number || !finalData.entry_date || !finalData.breed_id || !finalData.mammary_glands || !finalData.status_id) {
        Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
        return;
      }
      // Converting numeric fields
      const payload = {
        ...finalData,
        weight: form?.weight ? parseFloat(form.weight ?? "0") : 0,
        length: form?.length ? parseFloat(form.length ?? "0") : 0,
        mammary_glands: form?.mammary_glands ? parseFloat(form.mammary_glands ?? "0") : 0,
        farrowing_number: form?.farrowing_number ? parseFloat(form.farrowing_number ?? "0") : 0,
        description: form?.description ? form.description : undefined,
        removal_date: form?.removal_date === "0000-00-00 00:00:00.000" ? null : form?.removal_date,
        removal_reason: form?.removal_reason ? form.removal_reason : undefined,
        last_weaning_date: form?.last_weaning_date === "0000-00-00 00:00:00.000" ? null : form?.last_weaning_date,
      };
      await createSow(payload);// Call API
      Alert.alert("Éxito", "Cerda agregada correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al agregar cerda:", error);
      Alert.alert("Error", "Hubo un problema al agregar la cerda. Intente nuevamente.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar Nueva Cerda</Text>
      <Text style={styles.label}>Indentificador Animal *</Text>
      <TextInput style={styles.input} value={form?.sow_tag_number} onChangeText={(text) => setForm({...form, sow_tag_number: text})} placeholder="Ej: 12345" />
      <StatusDropdown value={statusId} onChange={(value: number) => setStatusId(Number(value))}/>
      <BreedDropdown value={breedId} onChange={(value: number) => setBreedId(Number(value))}/>
      <DatePickerField label="Fecha de Ingreso *" value={entryDate} onChange={(date) => setEntryDate(date)} />
      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput style={styles.input} value={form.weight} onChangeText={(text) => setForm({...form, weight: text})} placeholder="Ej: 120.5" keyboardType="numeric" />
      <Text style={styles.label}>Largo (cm)</Text>
      <TextInput style={styles.input} value={form.length} onChangeText={(text) => setForm({...form, length: text})} placeholder="Ej: 150.0" keyboardType="numeric" />
      <Text style={styles.label}>Número de Glándulas Mamarias *</Text>
      <TextInput style={styles.input} value={form.mammary_glands} onChangeText={(text) => setForm({...form, mammary_glands: text})} placeholder="Ej: 14" keyboardType="numeric" />
      <Text style={styles.label}>Número de Partos</Text>
      <TextInput style={styles.input} value={form.farrowing_number} onChangeText={(text) => setForm({...form, farrowing_number: text})}  keyboardType="numeric" placeholder="0"/>
      <Text style={styles.label}>Descripción</Text>
      <TextInput style={[styles.input, {height: 100, textAlignVertical: 'top' }]} multiline value={form.description} onChangeText={(text) => setForm({...form, description: text})} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
   // paddingBottom: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  label:{
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    // borderColor: "#ccc",
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