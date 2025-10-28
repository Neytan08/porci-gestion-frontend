import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBoar } from "../../api/boarsApi";
import DatePickerField from "../../components/DatePickerField";
import { BreedDropdown } from "../../components/BreedDropdown";

export default function AddBoar() {
    const navigation = useNavigation();
    const [entryDate, setEntryDate] = useState(new Date()); // DatePicker state and handlers
    const [breedId, setBreedId] = useState<number | null>(null); // Breed call
    const [form, setForm] = useState({
        // In case of need to add more fields, extend this form state (needs to match the API)
        boar_tag_number: "",
        entry_date: "",
        weight: "",
        length: "",
        removal_date: "0000-00-00 00:00:00.000",
        removal_reason: "",
        description: "",
    });

    const handleSubmit = async () => {
        try {
            const finalData = {
                ...form,
                entry_date: entryDate.toISOString(),
                breed_id: Number(breedId),
            };

            // Validate required fields
            if (!finalData.boar_tag_number || !finalData.entry_date || !finalData.breed_id) {
                Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
                return;
            }
            // Converting numeric fields
            const payload = {
                ...finalData,
                weight: form?.weight ? parseFloat(form.weight ?? "0") : 0,
                length: form?.length ? parseFloat(form.length ?? "0") : 0,
                description: form?.description ? form.description : undefined,
                removal_date: form?.removal_date === "0000-00-00 00:00:00.000" ? null : form?.removal_date,
                removal_reason: form?.removal_reason ? form.removal_reason : undefined,
            };
            await createBoar(payload);// Call API
            Alert.alert("Éxito", "Verraco agregado correctamente.");
            navigation.goBack();
        } catch (error) {
            console.error("Error al agregar verraco:", error);
            Alert.alert("Error", "Hubo un problema al agregar el verraco. Intente nuevamente.");
        }
    }

    return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>Agregar Nuevo Verraco</Text>
        <Text style={styles.label}>Indentificador Animal *</Text>
        <TextInput style={styles.input} value={form?.boar_tag_number} onChangeText={(text) => setForm({...form, boar_tag_number: text})} placeholder="Ej: 12345 o nombre" />
        <BreedDropdown value={breedId} onChange={(value: number) => setBreedId(Number(value))}/>
        <DatePickerField label="Fecha de Ingreso *" value={entryDate} onChange={(date) => setEntryDate(date)} />
        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput style={styles.input} value={form.weight} onChangeText={(text) => setForm({...form, weight: text})} placeholder="Ej: 120.5" keyboardType="numeric" />
        <Text style={styles.label}>Largo (cm)</Text>
        <TextInput style={styles.input} value={form.length} onChangeText={(text) => setForm({...form, length: text})} placeholder="Ej: 150.0" keyboardType="numeric" />
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
