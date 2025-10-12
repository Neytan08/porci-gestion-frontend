import React, { useState, useEffect } from "react";
import { View, Modal, TextInput, Button, Text, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { getBreed, createBreed } from "../api/breedApi";
import type { Breed } from "../api/breedApi";

type BreedDropdownProps = {
  value: number | null;
  onChange: (value: number) => void;
//   label?: string;
};

export const BreedDropdown: React.FC<BreedDropdownProps> = ({ value, onChange }) => {
  const [breeds, setBreeds] = useState<{ label: string; value: number }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBreed, setNewBreed] = useState<Breed>({
    breed_name: "",
    description: "",
  });

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const data = await getBreed();
      setBreeds(data.map((b: any) => ({ label: b.breed_name, value: b.id })));
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  const handleCreateBreed = async () => {
    if (!newBreed.breed_name.trim()) return;
    try {
      await createBreed(newBreed); // 👈 como tu método lo espera
      setModalVisible(false);
      setNewBreed({ breed_name: "", description: "" });
      await fetchBreeds(); // 🔄 refresca el dropdown
    } catch (error) {
      console.error("Error creating breed:", error);
    }
  };

  return (
    <View>
      <Text>Raza *</Text>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <RNPickerSelect
            onValueChange={(val) => onChange(val)}
            value={value}
            items={breeds}
            placeholder={{ label: "Seleccionar raza...", value: null }}
          />
        </View>

        {/* Botón ➕ */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ fontSize: 22, marginLeft: 10 }}>➕</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar nueva raza */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View style={{ backgroundColor: "white", padding: 20, margin: 20, borderRadius: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
              Agregar nueva raza
            </Text>

            <TextInput
              placeholder="Nombre de la raza"
              value={newBreed.breed_name}
              onChangeText={(text) => setNewBreed({ ...newBreed, breed_name: text })}
              style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 8 }}
            />

            <TextInput
              placeholder="Descripción (opcional)"
              value={newBreed.description}
              onChangeText={(text) => setNewBreed({ ...newBreed, description: text })}
              style={{ borderWidth: 1, borderColor: "#ccc", marginBottom: 10, padding: 8 }}
            />

            <Button title="Guardar" onPress={handleCreateBreed} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// export default BreedDropdown;
