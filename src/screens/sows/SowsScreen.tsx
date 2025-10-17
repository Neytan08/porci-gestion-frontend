import React, { useEffect, useState, useCallback } from "react";
import {View, Text, FlatList, TouchableOpacity, Pressable, ActivityIndicator, StyleSheet, RefreshControl, Modal, Alert} from "react-native";
import { deleteSow, getSows, Sow } from "../../api/sowsApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sows'>;

export default function SowsScreen() {
  const [sows, setSows] = useState<Sow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const [selectedSow, setSelectedSow] = useState<{sow_id: number; sow_tag_number: string } | null>(null);

  const loadSows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSows();
      setSows(data);
    } catch (err: any) {
      if (err?.code === 'ECONNABORTED') {
        setError('La solicitud tardó demasiado. Intente nuevamente.');
      } else if (err?.isAxiosError) {
        setError('Error de red o servidor. Verifique su conexión.');
      } else {
        setError('No se pudo cargar la lista de cerdas.');
      }
      console.error('Error loading sows:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSows();
    setRefreshing(false);
  };

  useEffect(() => {
    loadSows();
  }, []);

//Reload the screen when coming back to it
  useFocusEffect(
    useCallback(() => {
      loadSows(); // Reload the sows list when the screen is focused
    }, [])
  );
//In case of loading last to long
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando cerdas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  const handleAddPress = () => {
    navigation.navigate("AddSow" as never); 
  };

  const handleDetailsPress = (sowId: number) => {
    console.log("Ver detalles");
    navigation.navigate('DetailsSow', { sowId });
  };

  const handleDeleteSow =  async (sowId: number) => {
    try {
      setError(null);
      await deleteSow(sowId);
      setModalVisible(false);
      setSelectedSow(null);
      await loadSows();
      Alert.alert('Eliminación completada', 'La cerda fue eliminada correctamente.');
    } catch (err: any) {
      console.error("Error deleting sow:", err);
      setError("No se pudo eliminar la cerda.");
      Alert.alert('Error', 'No se pudo eliminar la cerda. Intente nuevamente.');
    }
  };

  const handleLongPress = (sow_id: number, sow_tag_number: string) => {
    setSelectedSow({ sow_id: sow_id, sow_tag_number: sow_tag_number });
    setModalVisible(true);
    console.log("Delete");
  };

  return (
    <View style={styles.container}>
      {/* Headers row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 1 }]}>Nombre</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Estado</Text>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>Ingreso</Text>
        <Text style={[styles.headerCell, { flex: 0.8 }]}>Total Partos</Text>
      </View>

      {/*Breeding Sow List */}
      <FlatList<Sow>
        data={sows}
        keyExtractor={(item, index) =>
          item.sow_id != null ? `sow-${item.sow_id}` : `sow-${index}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Pressable 
          style={({ pressed }) => [
            styles.row,
            pressed && { backgroundColor: "#e0e0e0", opacity: 0.6, }
          ]} 
          onPress={() => handleDetailsPress(item.sow_id)} 
          onLongPress={() => handleLongPress(item.sow_id, item.sow_tag_number)} >
            <Text style={[styles.cell, { flex: 1 }]}>{item.sow_tag_number ?? '-'}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.status?.status_name || "Sin estado"}</Text>
            <Text style={[styles.cell, { flex: 1.2 }]}>{(item.entry_date ?? '').toString().split('T')[0] || '-'}</Text>
            <Text style={[styles.cell, { flex: 0.8 }]}>{item.farrowing_number ?? "-"}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>No hay cerdas registradas.</Text>
        }
      />
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <Text style={styles.fabText}>＋ Agregar</Text>
      </TouchableOpacity>

      {/* Deleting Pop up */}
      <Modal visible={modalVisible && selectedSow !== null} transparent animationType="slide">
        <View style={[styles.modalcontainer]}>
          <View style={[styles.modalview]}>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>Seguro que desea eliminar a {selectedSow?.sow_tag_number ?? ""}?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.deletebuttons, { backgroundColor: "#ac0202ff" }]}
                onPress={() => selectedSow && handleDeleteSow(selectedSow.sow_id)}>
                <Text  style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deletebuttons, { backgroundColor: "#007AFF" }]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedSow(null);
                }}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
//#1947edff
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    paddingHorizontal: 7,
    alignContent: "center",
    fontWeight: "bold",
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  cell: {
    paddingHorizontal: 8,
    marginVertical: 5,
    textAlign: "left",
    color: "#333",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFA000", // color naranja similar al ejemplo
    width: 125,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // sombra en Android
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, // sombra en iOS
  },
  fabText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 2,
  },
  modalcontainer:{
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalview:{
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  buttonRow: {
   flexDirection: "row",
    justifyContent: "space-between",
  },
  deletebuttons: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
