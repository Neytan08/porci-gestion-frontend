import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getBoars, Boar } from "../../api/boarsApi";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Image, Modal, Pressable} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import BreedFilter from "../../components/filters/BreedFilter";
import SearchFilter from "../../components/filters/SearchFilter";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Boars'>;

export default function BoarsScreen() {
  const [boars, setBoars] = useState<Boar[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] =  useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const [selectedBreedId, setSelectedBreedId] = useState<number | null>(null);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Build breed options from boars (id -> name), no extra API call
  const breedOptions = useMemo(
    () => {
      const map = new Map<number, string>();
      boars.forEach(b => {
        const id = b.breed?.breed_id ?? (b as any).breed_id;
        const name = b.breed?.breed_name ?? (b as any).breed_name;
        if (id != null && typeof name === "string" && name.trim()) map.set(id, name);
      });
      return Array.from(map, ([value, label]) => ({ value, label }));
    },
    [boars]
  );

  // Filtered list
  const filteredBoars = useMemo(() => {
      return boars.filter((b) => {
        const q = searchQuery.trim().toLowerCase();
        const breedId = b.breed?.breed_id ?? (b as any).breed_id ?? null;
  
        const matchBreed = selectedBreedId == null || breedId === selectedBreedId;

        const tag = (b.boar_tag_number ?? "").toString().toLowerCase();
        const matchSearch = q.length === 0 || tag.includes(q);
  
        return matchBreed && matchSearch;
      });
    }, [boars, selectedBreedId, searchQuery]);
  
  // Fetch boars from API
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
  // Pull-to-refresh handler
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
      <View style={styles.messageAlignment}>
      <ActivityIndicator size="large" />
      <Text>Cargando verracos...</Text>
    </View>
  );
  }

  if (error) {
    return (
    <View style={styles.messageAlignment}>
      <Text style={{ color: "red" }}>{error}</Text>
    </View>
  );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Filter Section */}
      <Modal
        visible={filterSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterSheetVisible(false)}
        >
        <Pressable style={styles.filterOverlay} onPress={() => setFilterSheetVisible(false)}>
          <View style={styles.filterOverlayView}>
            <Text style={styles.filterOverlayTitle}>Filtros</Text>
            {/* Breed Section */}
            <BreedFilter
              options={breedOptions}                 // [{label, value}]
              selectedId={selectedBreedId}           // number | null
              onChange={setSelectedBreedId}          // (id) => void
            />
            {/* Filter Actions */}
            <View style={styles.filterBtnRow}>
              <Pressable
                style={[styles.filterBtn, { backgroundColor: "#e0e0e0" }]}
                onPress={() => { setSelectedBreedId(null); }}
                >
                <Text style={{ fontWeight: "700", color: "#333" }}>Limpiar filtros</Text>
              </Pressable>
              <Pressable
                style={[styles.filterBtn, { backgroundColor: "#2E7D32" }]}
                onPress={() => setFilterSheetVisible(false)}
                >
                <Text style={{ fontWeight: "700", color: "#fff" }}>Aplicar</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
      {/* Headers row */}
      <View style={styles.headerTitleList}>
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Nombre</Text>
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Raza</Text>
        <Text style={[styles.headerTitleCell, { flex: 1.2 }]}>Ingreso</Text>
      </View>

      {/* Boars list */}
      <FlatList<Boar>
        data={filteredBoars}
        keyExtractor={(item, index) =>
          item.boar_id != null ? `${item.boar_id}` : `${index}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.flatlistRow}>
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.boar_tag_number ?? '-'}</Text>
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.breed?.breed_name ?? 'Sin Raza'}</Text>
            <Text style={[styles.flatlistCell, { flex: 1.2 }]}>{(item.entry_date ?? '').toString().split('T')[0] || '-'}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noSowsText}>No hay verracos registrados.</Text>
        }
        ListFooterComponent={
          <View style={styles.footerBar}>
              <Pressable onPress={() => setFilterSheetVisible(true)}>
                <Text style={styles.filterLinkText}>Filtrar por…</Text>
              </Pressable>
            <SearchFilter
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </View>
        }
        ListFooterComponentStyle={{ paddingTop: 12, paddingBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 90 }}
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
  icon: {  width: 42, height: 42 },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  messageAlignment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  /* FlatList Styles */
  headerTitleList: {
    flexDirection: "row",
    backgroundColor: "#81C784",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitleCell: {
    paddingHorizontal: 7,
    marginVertical: 5,
    alignContent: "center",
    fontWeight: "bold",
    textAlign: "left",
    textAlignVertical: "center",
  },
  flatlistRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  flatlistCell: {
    paddingHorizontal: 8,
    marginVertical: 5,
    textAlign: "left",
    color: "#333",
  },
  noSowsText: {
    textAlign: "center",
    marginTop: 20,
  },
  // FlatList Footer
  footerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Left: Filtrar, Right: Buscar
  },
  filterLinkText: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "700",
  },
  // Floating Add Button
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
  // Filter Modal Styles
  filterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  filterOverlayView: {
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  filterOverlayTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    marginBottom: 8 
  },
  sectionDivider: { 
    height: 1, 
    backgroundColor: "#eee", 
    marginVertical: 8 
  },
  // Buttons
  filterBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});