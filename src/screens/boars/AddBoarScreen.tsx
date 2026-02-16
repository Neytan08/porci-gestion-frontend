import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AxiosError } from "axios";
import { createBoar, Boar } from "../../api/boarsApi";
import DatePickerField from "../../components/DatePickerField";
import { BreedDropdown } from "../../components/BreedDropdown";

export default function AddBoar() {
  const navigation = useNavigation();
  const [birthDate, setBirthDate] = useState(new Date()); // DatePicker state and handlers
  const [breedId, setBreedId] = useState<number | null>(null); // Breed call
  const [form, setForm] = useState({
    // In case of need to add more fields, extend this form state (needs to match the API)
    boar_tag_number: "",
    birth_date: "",
    weight: "",
    length: "",
    description: "",
  });

  const validateBoar = (boar: Partial<Boar>): boolean => {
    if (!boar.boar_tag_number || !boar.birth_date || !boar.breed_id) {
      Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    try {
      const finalData = {
        ...form,
        birth_date: birthDate.toISOString(),
        breed_id: breedId ?? null,
      };

      // Converting numeric fields
      const payload: Partial<Boar> = {
        ...finalData,
        weight: form.weight ? parseFloat(form.weight) : null,
        length: form.length ? parseFloat(form.length) : null,
        description: form?.description ? form.description : null,
      };
      // Validate required fields
      if (!validateBoar(payload)) {
        return;
      }
      await createBoar(payload);// Call API
      Alert.alert("Éxito", "Verraco agregado correctamente.");
      navigation.goBack();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          if (error.response.status === 409) {
            // Handle duplicate boar_tag_number error
            Alert.alert("Error", "Ya existe un registro con este identificador. Por favor, use un identificador único.");
            return;
          }
          // API responded with a status code outside the 2xx range
          const serverMessage = error.response.data?.message || "Hubo un problema al agregar el verraco.";
          Alert.alert("Error", serverMessage);
        } else if (error.request) {
          // The request was sent but no response was received
          Alert.alert("Error", "No se recibió respuesta del servidor. Verifique su conexión.");
        } else {
          // Something else happened while setting up the request
          Alert.alert("Error", "Hubo un problema al agregar el verraco. Intente nuevamente.");
        }
      } else {
        // Error no related with Axios
        Alert.alert("Error", "Hubo un problema al agregar el verraco. Intente nuevamente.");
      }
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Verraco</Text>
      <Text style={styles.label}>Indentificador Animal *</Text>
      <TextInput style={styles.input} value={form?.boar_tag_number} onChangeText={(text) => setForm({...form, boar_tag_number: text})} placeholder="Ej: 12345 o nombre" />
      <BreedDropdown value={breedId} onChange={(value: number) => setBreedId(Number(value))}/>
      <DatePickerField label="Fecha de Nacimiento *" value={birthDate} onChange={(date) => setBirthDate(date)} />
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
