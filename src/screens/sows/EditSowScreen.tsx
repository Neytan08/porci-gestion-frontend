import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getSowbyId, updateSow, Sow } from "../../api/sowsApi";
import { getStatus } from "../../api/statusApi";
import { getBreed } from "../../api/breedApi";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { BreedDropdown } from "../../components/BreedDropdown";
import { StatusDropdown } from "../../components/StatusDropdown";
import DatePickerField from "../../components/DatePickerField";

// Define the type for route parameters
type EditRouteProp = RouteProp<RootStackParamList, 'EditSow'>;

export default function EditSowScreen() {
  const [sow, setSowDetails] = useState<Sow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusOptions, setStatusOptions] = useState<{ label: string; value: number }[]>([]);
  const [breedsOptions, setBreedsOptions] = useState<{ label: string; value: number }[]>([]);
  const [isBannerTagNumberVisible, setBannerTagNumberVisible] = useState(false);
  const [newSowTagNumber, setNewSowTagNumber] = useState(sow?.sow_tag_number || ""); 
  const route = useRoute<EditRouteProp>();
  const { sowId } = route.params;
  const navigation = useNavigation();

  // Load sow details by ID
  const loadSowDetails = async () => {
    try {
      setLoading(true);
      // setError(null);
      const data = await getSowbyId(sowId);
      setSowDetails(data);
    } catch (err: any) {
      console.error("Error loading sow:", err);
      // setError("No se pudo cargar la cerda.");
      Alert.alert("Error", "No se pudo cargar la cerda. Intente nuevamente.")
    } finally {
      setLoading(false);
    }
  };

  // Validation of required fields
  const validateSow = (sow: Sow): boolean => {
  return !!(
    sow.sow_tag_number &&
    sow.entry_date &&
    sow.breeds?.breed_id &&
    sow.mammary_glands &&
    sow.status?.status_id
    );
  };

  const handleUpdateSow = async () => {
    try {
      // setError(null);
      if (!sow) return;

      // Formatting data before sending
      const updatedSow = {
        ...sow,
        entry_date: sow.entry_date,
        status_id: sow.status?.status_id,
        breed_id: sow.breeds?.breed_id,
        weight: typeof sow.weight === "number" ? sow.weight : parseFloat(sow.weight ?? "0") || 0,
        length: typeof sow.length === "number" ? sow.length : parseFloat(sow.length ?? "0") || 0,
        mammary_glands: typeof sow.mammary_glands === "number" ? sow.mammary_glands : parseFloat(sow.mammary_glands ?? "0") || 0.0,
        farrowing_number: typeof sow.farrowing_number === "number" ? sow.farrowing_number : parseFloat(sow.farrowing_number ?? "0") || 0.0,
        last_weaning_date: sow.last_weaning_date || null,
        removal_date: sow.removal_date || null,
        removal_reason: "",
        description: sow.description || "",
      }
      if (!validateSow(updatedSow)) {
        Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
        return;
      }
      await updateSow(sowId, updatedSow);
      Alert.alert("Actualización completada", "La cerda fue actualizada correctamente.");
      navigation.goBack();
    } catch (err: any) {
      console.error("Error updating sow:", err);
      // setError("No se pudo actualizar la cerda.");
      Alert.alert("Error", "No se pudo actualizar la cerda. Intente nuevamente.");
    }
  };

  // Load status and breed options for dropdowns
  const loadDropdownOptions = async () => {
    try {
      const statuses = await getStatus();
      const breeds = await getBreed();
      setStatusOptions(statuses.map((status: { status_name: string; status_id: number }) => ({
        label: status.status_name,
        value: status.status_id,
      })));
      setBreedsOptions(breeds.map((breed: { breed_name: string; breed_id: number }) => ({
        label: breed.breed_name,
        value: breed.breed_id,
      })));
    } catch (err: any) {
      console.error("Error loading dropdown options:", err);
    }
  };

  // Load data once the component is mounted
  useEffect(() => {
    loadSowDetails();
    loadDropdownOptions();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando cerda...</Text>
      </View>
    );
  }

  if (!sow) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>No se pudo cargar la cerda.</Text>
        <TouchableOpacity onPress={loadSowDetails}>
          <Text style={{ color: "blue" }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Formulario editable */}
        <View style={styles.header}>
            <View style={styles.imagePlaceholder} />
            {/* Sow Tag Number Editable */}
            <TouchableOpacity onPress={() => setBannerTagNumberVisible(true)}>
              <Text style={styles.name}>{sow.sow_tag_number}</Text>
            </TouchableOpacity>
            <Modal visible={isBannerTagNumberVisible} transparent animationType="slide">
              <View style={[styles.center, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
                  {isBannerTagNumberVisible && (
                    <View style={styles.banner}>
                      <Text style={styles.bannerTitle}>Ingrese el nombre</Text>
                      <TextInput
                        style={styles.bannerInput}
                        value={newSowTagNumber}
                        onChangeText={setNewSowTagNumber}
                      />
                      <View style={styles.bannerButtons}>
                        <TouchableOpacity
                          style={styles.bannerButton}
                          onPress={() => {
                            {/* Checking if the input is empty */}
                            const trimmed = newSowTagNumber.trim();
                            if (!trimmed) {
                              Alert.alert("Error", "El nombre no puede estar vacío.");
                              return;
                            }
                            setSowDetails({ ...sow, sow_tag_number: newSowTagNumber });
                            setBannerTagNumberVisible(false);
                          }}
                          >
                          <Text style={styles.bannerButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.bannerButton}
                          onPress={() => setBannerTagNumberVisible(false)}>
                          <Text style={styles.bannerButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
              </View>
            </Modal>
        </View>
        <View>
          {/* Dropdowns and Date Picker */}
            <View>
              <StatusDropdown
                value={sow.status?.status_id || null}
                onChange={(newStatusId: number) => {
                  const selectedStatus = statusOptions.find((status) => status.value === newStatusId);
                  setSowDetails({
                    ...sow,
                    status: { status_id: newStatusId, status_name: selectedStatus?.label || "" },
                    });
                }}
              />
            </View>
            <View>
            <BreedDropdown 
                value={sow.breeds?.breed_id || null}
                onChange={(newBreedId: number) => {
                const selectedBreed = breedsOptions.find((breed) => breed.value === newBreedId);
                setSowDetails({
                  ...sow,
                  breeds: { breed_id: newBreedId, breed_name: selectedBreed?.label || "" },
                });
                }}
              />
            </View>
            <View>
              <DatePickerField  label="Fecha de Ingreso *"
              value={new Date(sow.entry_date)}
              onChange={(newDate: Date) => setSowDetails({ ...sow, entry_date: newDate.toISOString() })}
              />
            </View>
            {/* Additional Fields */}
            <View style={styles.table}>
                {([
                    { label: "Cantidad de pezones *", value: sow.mammary_glands, key: "mammary_glands", keyboardType: "numeric" as const},
                    { label: "Peso(cm)", value: sow.weight, key: "weight", keyboardType: "numeric" as const },
                    { label: "Largo(cm)", value: sow.length, key: "length", keyboardType: "numeric" as const },
                    { label: "Cantidad de partos", value: sow.farrowing_number, key: "farrowing_number", keyboardType: "numeric" as const },
                    { label: "Descripción", value: sow.description, key: "description", multiline: true },
                ]).map((item, index) => (
                <View key={index} style={styles.row}>
                    <Text style={styles.label}>{item.label}</Text>
                    <TextInput
                        accessibilityLabel={`Editar ${item.label}`}
                        style={styles.input}
                        value={item.value?.toString() ?? ""}
                        keyboardType={item.keyboardType || "default"}
                        multiline={item.multiline}
                        numberOfLines={item.multiline ? 4 : 1}
                        onChangeText={(text) =>
                          setSowDetails({
                            ...sow,
                            [item.key]: item.keyboardType === "numeric" ? (Number(text) || 0) : text,
                          })
                        }
                    />
                </View>
                ))}
            </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleUpdateSow}>
            <Text style={styles.buttonText}>Actualizar</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  imagePlaceholder: { width: 120, height: 120, backgroundColor: "#ccc", borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold", },
  table: {
    // borderTopWidth: 3,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: { fontWeight: "600", color: "#555", flex: 1 },
  input: { flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  banner: {
  position: "absolute",
  top: "40%",
  left: "10%",
  width: "80%",
  padding: 20,
  backgroundColor: "#fff",
  borderRadius: 10,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
},
bannerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
bannerInput: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  padding: 10,
  marginBottom: 20,
},
bannerButtons: { flexDirection: "row", justifyContent: "space-between" },
bannerButton: {
  flex: 1,
  padding: 10,
  marginHorizontal: 5,
  backgroundColor: "#007AFF",
  borderRadius: 5,
  alignItems: "center",
},
bannerButtonText: { color: "#fff", fontWeight: "bold" },
});