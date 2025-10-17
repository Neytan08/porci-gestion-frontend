import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createSow } from "../../api/sowsApi";
import DatePickerField from "../../components/DatePickerField";
import { StatusDropdown } from "../../components/StatusDropdown";
import { BreedDropdown } from "../../components/BreedDropdown";

export default function AddSow() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    sow_tag_number: "",
    status_id: null as number | null,
    breed_id : null as number | null,
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
  const handleChange = (name: string, value: string) => {setForm({ ...form, [name]: value, status_id: Number(statusId), breed_id: Number(breedId) });}
  const [entryDate, setEntryDate] = useState(new Date()); // DatePicker state and handlers
  const [statusId, setStatusId] = useState<number | null>(null); // Status call
  const [breedId, setBreedId] = useState<number | null>(null); // Breed call
  const handleSubmit = async () => {
      try {
          const finalData = {//Joining the data
            ...form,
            entry_date: entryDate.toISOString(), 
            status_id: Number(statusId),
            breed_id: Number(breedId)
          };
          // Validate required fields
          if (!finalData.sow_tag_number || !finalData.entry_date || !finalData.breed_id || !finalData.mammary_glands || !finalData.status_id) {
              Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
              return;
          }
          // Converting numeric fields
          const payload = {
              ...finalData,
              weight: finalData.weight ? parseFloat(finalData.weight) : undefined,
              length: finalData.length ? parseFloat(finalData.length) : undefined,
              mammary_glands: parseInt(finalData.mammary_glands),
              farrowing_number: finalData.farrowing_number ? parseInt(finalData.farrowing_number) : 0,
              description: finalData.description ? finalData.description : undefined,
              removal_date: finalData.removal_date === "0000-00-00 00:00:00.000" ? undefined : finalData.removal_date,
              removal_reason: finalData.removal_reason ? finalData.removal_reason : undefined,
              last_weaning_date: finalData.last_weaning_date === "0000-00-00 00:00:00.000" ? undefined : finalData.last_weaning_date,
          };
          await createSow(payload);// Call API
          Alert.alert("Éxito", "Cerda agregada correctamente.");
          navigation.goBack();
      } catch (error) {
          console.error("Error al agregar cerda:", error);
          Alert.alert("Error", "Hubo un problema al agregar la cerda. Intente nuevamente.");
      }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar Nueva Cerda</Text>
      <Text style={styles.label}>Indentificador Animal *</Text>
      <TextInput style={styles.input} value={form.sow_tag_number} onChangeText={(text) => handleChange("sow_tag_number", text)} placeholder="Ej: 12345 o nombre" />
      <StatusDropdown value={statusId} onChange={(value: number) => setStatusId(Number(value))}/>
      <BreedDropdown value={breedId} onChange={(value: number) => setBreedId(Number(value))}/>
      <DatePickerField label="Fecha de Ingreso *" value={entryDate} onChange={(date) => setEntryDate(date)} />
      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput style={styles.input} value={form.weight} onChangeText={(text) => handleChange("weight", text)} placeholder="Ej: 120.5" keyboardType="numeric" />
      <Text style={styles.label}>Largo (cm)</Text>
      <TextInput style={styles.input} value={form.length} onChangeText={(text) => handleChange("length", text)} placeholder="Ej: 150.0" keyboardType="numeric" />
      <Text style={styles.label}>Número de Glándulas Mamarias *</Text>
      <TextInput style={styles.input} value={form.mammary_glands} onChangeText={(text) => handleChange("mammary_glands", text)} placeholder="Ej: 14" keyboardType="numeric" />
      <Text style={styles.label}>Número de Partos</Text>
      <TextInput style={styles.input} value={form.farrowing_number} onChangeText={(text) => handleChange("farrowing_number", text)}  keyboardType="numeric" placeholder="0"/>
      <Text style={styles.label}>Descripción</Text>
      <TextInput style={[styles.input, {height: 100, textAlignVertical: 'top' }]} multiline value={form.description} onChangeText={(text) => handleChange("description", text)} />
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
    backgroundColor: "#fff",
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
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FFA000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});