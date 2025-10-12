import React, { useEffect, useState, useCallback } from "react";
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, RefreshControl,} from "react-native";
import { getSows, Sow } from "../api/sowsApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function SowsScreen() {
  const [sows, setSows] = useState<Sow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const loadSows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSows();
      setSows(data);
    } catch (err: any) {
      console.error("Error loading sows:", err);
      setError("No se pudo cargar la lista de cerdas.");
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
    navigation.navigate("AddSow" as never); // 👈 suponiendo que tengas una pantalla para agregar
  };
  return (
    <View style={styles.container}>
      {/* Encabezados de columna */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 1 }]}>N° Tag</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Estado</Text>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>Ingreso</Text>
        <Text style={[styles.headerCell, { flex: 0.8 }]}>Cantidad de Partos</Text>
      </View>

      {/* Lista de cerdas */}
      <FlatList
        data={sows}
        keyExtractor={(item, index) => `${item.sow_tag_number}-${index}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => console.log("Ver detalles de:", item.sow_tag_number)} >
            <Text style={[styles.cell, { flex: 1 }]}>{item.sow_tag_number}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.status?.status_name || "Sin estado"}</Text>
            <Text style={[styles.cell, { flex: 1.2 }]}>{item.entry_date.toString().replace("T", " ").replace("Z", "").split('.')[0]}</Text>
            <Text style={[styles.cell, { flex: 0.8 }]}>{item.farrowing_number ?? "-"}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>No hay cerdas registradas.</Text>
        }
      />
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
        <Text style={styles.fabText}>＋ Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

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
});
