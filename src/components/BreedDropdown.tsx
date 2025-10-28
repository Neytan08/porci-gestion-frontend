import React, { useState, useEffect } from "react";
import { View, Modal, StyleSheet, TextInput, Button, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { getBreed, createBreed } from "../api/breedApi";
import type { Breed } from "../api/breedApi";

type BreedDropdownProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export const BreedDropdown: React.FC<BreedDropdownProps> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(true);
  const [breedsOptions, setBreeds] = useState<{ label: string; value: number }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBreed, setNewBreed] = useState<Breed>({
    breed_id: 0,
    breed_name: "",
    description: "",
  });

  useEffect(() => {
    fetchBreeds();
  }, []);

  // Fetch breeds from API
  const fetchBreeds = async () => {
    try {
      const data = await getBreed();
      const mapped = data.map((item: Breed) => ({ label: item.breed_name, value: item.breed_id }));
      setBreeds(mapped);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
          <Text>Cargando razas...</Text>
      </View>
    );
  }

  // Handle creating a new breed
  const handleCreateBreed = async () => {
    if (!newBreed.breed_name.trim()) return;
    try {
      await createBreed(newBreed); 
      setModalVisible(false);
      setNewBreed({ breed_id: 0, breed_name: "", description: "" });
      await fetchBreeds(); // Refresh dropdown
    } catch (error) {
      console.error("Error creating breed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{"Raza *"}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <RNPickerSelect
            onValueChange={(value) => onChange(Number(value))}
            value={value}
            items={breedsOptions}
            placeholder={{ label: "Seleccionar raza...", value: null }}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              placeholder: { color: "#888"},
            }}
          />
        </View>
        {/* Button ➕ */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 22, marginLeft: 10, color: "#FFA000" }}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for adding new breed */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Agregar nueva raza</Text>
            <TextInput
              placeholder="Nombre de la raza"
              value={newBreed.breed_name}
              onChangeText={(text) =>
                setNewBreed({ ...newBreed, breed_name: text })
              }
              style={styles.modalInputs}
            />
            <TextInput
              placeholder="Descripción (opcional)"
              value={newBreed.description}
              onChangeText={(text) =>
                setNewBreed({ ...newBreed, description: text })
              }
              style={styles.modalInputs}
            />
            <View style={styles.bannerButtons}>
              <TouchableOpacity style={styles.bannerButton} onPress={handleCreateBreed}>
                <Text style={styles.bannerButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bannerButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.bannerButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 5,
    // padding: 2,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalView: { backgroundColor: "white", margin: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInputs: { marginBottom: 10, borderWidth: 1, borderColor: "#37474F", padding: 8 },
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
