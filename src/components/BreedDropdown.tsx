import React, { useState, useEffect } from "react";
import { View, Modal, StyleSheet, TextInput, Button, Text, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { getBreed, createBreed } from "../api/breedApi";
import type { Breed } from "../api/breedApi";

type BreedDropdownProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export const BreedDropdown: React.FC<BreedDropdownProps> = ({ value, onChange }) => {
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

  const fetchBreeds = async () => {
    try {
      const data = await getBreed();
      setBreeds(data.map((item: Breed) => ({ label: item.breed_name, value: item.breed_id })));
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

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
        {/* Botón ➕ */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 22, marginLeft: 10 }}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar nueva raza */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              margin: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Agregar nueva raza</Text>
            <TextInput
              placeholder="Nombre de la raza"
              value={newBreed.breed_name}
              onChangeText={(text) =>
                setNewBreed({ ...newBreed, breed_name: text })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                marginBottom: 10,
                padding: 8,
              }}
            />
            <TextInput
              placeholder="Descripción (opcional)"
              value={newBreed.description}
              onChangeText={(text) =>
                setNewBreed({ ...newBreed, description: text })
              }
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                marginBottom: 10,
                padding: 8,
              }}
            />
            <Button title="Guardar" onPress={handleCreateBreed} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
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
});
