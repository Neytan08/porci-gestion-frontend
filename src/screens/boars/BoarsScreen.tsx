import React, { useEffect, useState, useCallback } from "react";
import { getBoars, Boar } from "../../api/boarsApi";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Image,} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Boars'>;

export default function BoarsScreen() {
  const [boars, setBoars] = useState<Boar[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] =  useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const loadBoars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBoars();
      setBoars(data);
    } catch (err: any) {
      if (err?.code === 'ECONNABORTED') {
        setError('La solicitud tardó demasiado. Intente nuevamente.');
      } else if (err?.isAxiosError) {
        setError('Error de red o servidor. Verifique su conexión.');
      } else {
        setError("No se pudo cargar la lista de verracos.");
      }
      console.error('Error loading boars:', err);
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await loadBoars();
    setRefreshing(false);
  };
  
  // Navigate to AddBoar screen
  const handleAddPress = () => {
    navigation.navigate("AddBoar" as never);
  };

  useEffect(() => {
    loadBoars();
  }, []);

  //Reload the screen when coming back to it
  useFocusEffect(
    useCallback(() => {
      loadBoars(); 
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loading}>
      <ActivityIndicator size="large" />
      <Text>Cargando verracos...</Text>
    </View>
  );
  }

  if (error) {
    return (
    <View style={styles.loading}>
      <Text style={{ color: "red" }}>{error}</Text>
    </View>
  );
  }

  return (
    <View style={styles.container}>
      {/* Headers row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 1 }]}>Nombre</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Raza</Text>
        <Text style={[styles.headerCell, { flex: 1.2 }]}>Ingreso</Text>
      </View>

      {/* Boars list */}
      <FlatList<Boar>
        data={boars}
        keyExtractor={(item, index) =>
          item.boar_id != null ? `${item.boar_id}` : `${index}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>{item.boar_tag_number ?? '-'}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>{item.breed?.breed_name ?? 'Sin Raza'}</Text>
            <Text style={[styles.cell, { flex: 1.2 }]}>{(item.entry_date ?? '').toString().split('T')[0] || '-'}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>No hay verracos registrados.</Text>
        }
      />
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.addBoarButton} onPress={handleAddPress}>
          <Image
          source={require("../../../assets/icons/add.png")}
          style={styles.icon}
          resizeMode="contain"
          />
        <Text style={styles.addBoarText}> Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#81C784",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    paddingHorizontal: 7,
    marginVertical: 10,
    alignContent: "center",
    fontWeight: "bold",
    textAlign: "left",
    textAlignVertical: "center",
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
  addBoarButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFA000", // color naranja similar al ejemplo
    width: 140,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // sombra en Android
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, // sombra en iOS
  },
  addBoarText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 2,
  },
  icon: {  width: 42, height: 42 },
});