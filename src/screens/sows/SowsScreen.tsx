import React, { useEffect, useState, useCallback, useMemo } from "react";
import {View, Text, FlatList, TouchableOpacity, Pressable, ActivityIndicator, StyleSheet, RefreshControl, Modal, Alert, Image, TextInput} from "react-native";
import { deleteSow, getSows, Sow } from "../../api/sowsApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import StatusFilter from "../../components/filters/StatusFilter";
import BreedFilter from "../../components/filters/BreedFilter";
import SearchFilter from "../../components/filters/SearchFilter";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sows'>;

export default function SowsScreen() {
  const [sows, setSows] = useState<Sow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const [selectedSow, setSelectedSow] = useState<{sow_id: number; sow_tag_number: string } | null>(null);
  const [selectedBreedId, setSelectedBreedId] = useState<number | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Build breed options from sows (id -> name), no extra API call
  const breedOptions = useMemo(
    () => {
      const map = new Map<number, string>();
      sows.forEach(b => {
        const id = b.breeds?.breed_id ?? (b as any).breed_id;
        const name = b.breeds?.breed_name ?? (b as any).breed_name;
        if (id != null && typeof name === "string" && name.trim()) map.set(id, name);
      });
      return Array.from(map, ([value, label]) => ({ value, label }));
    },
    [sows]
  );

  // Build breed options from boars (id -> name), no extra API call
  const statusOptions = useMemo(
    () => {
      const map = new Map<number, string>();
      sows.forEach(b => {
        const id = b.status?.status_id ?? (b as any).status_id;
        const name = b.status?.status_name ?? (b as any).status_name;
        if (id != null && typeof name === "string" && name.trim()) map.set(id, name);
      });
      return Array.from(map, ([value, label]) => ({ value, label }));
    },
    [sows]
  );

  // Filtered list
  const filteredSows = useMemo(() => {
    return sows.filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      const breedId = s.breeds?.breed_id ?? (s as any).breed_id ?? null;
      const statusId = s.status?.status_id ?? (s as any).status_id ?? null;

      const matchBreed = selectedBreedId == null || breedId === selectedBreedId;
      const matchStatus = selectedStatusId == null || statusId === selectedStatusId;

      const tag = (s.sow_tag_number ?? "").toString().toLowerCase();
      const matchSearch = q.length === 0 || tag.includes(q);

      return matchBreed && matchStatus && matchSearch;
    });
  }, [sows, selectedBreedId, selectedStatusId, searchQuery]);

  // Reload the sows list when the screen is focused
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

  // Navigate to AddSow screen
  const handleAddPress = () => {
    navigation.navigate("AddSow" as never); 
  };

  // Navigate to DetailsSow screen
  const handleDetailsPress = (sowId: number) => {
    console.log("Ver detalles");
    navigation.navigate('DetailsSow', { sowId });
  };

  // Handle deleting a sow
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

  useEffect(() => {
    loadSows();
  }, []);

  //Reload the screen when coming back to it
  useFocusEffect(
    useCallback(() => {
      loadSows(); 
    }, [])
  );

  //In case of loading last to long
  if (loading) {
    return (
      <View style={styles.messagesAlignment}>
        <ActivityIndicator size="large" />
        <Text>Cargando cerdas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messagesAlignment}>
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
            {/* Status Section */}
            <StatusFilter
              options={statusOptions}               // [{label, value}]
              selectedId={selectedStatusId}         // number | null
              onChange={setSelectedStatusId}        // (id) => void
            />
            {/* Divider */}
            <View style={styles.sectionDivider} />
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
                onPress={() => { setSelectedBreedId(null); setSelectedStatusId(null); }}
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
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Estado</Text>
        <Text style={[styles.headerTitleCell, { flex: 1.2 }]}>Ingreso</Text>
        <Text style={[styles.headerTitleCell, { flex: 0.8 }]}>Total Partos</Text>
      </View>
      {/*Breeding Sow List */}
      <FlatList<Sow>
        data={filteredSows}
        keyExtractor={(item, index) =>
          item.sow_id != null ? `${item.sow_id}` : `${index}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Pressable 
          style={({ pressed }) => [
            styles.flatlistRow,
            pressed && { backgroundColor: "#e0e0e0", opacity: 0.6, }
          ]} 
          onPress={() => handleDetailsPress(item.sow_id)} 
          onLongPress={() => handleLongPress(item.sow_id, item.sow_tag_number)} >
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.sow_tag_number ?? '-'}</Text>
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.status?.status_name ?? "Sin estado"}</Text>
            <Text style={[styles.flatlistCell, { flex: 1.2 }]}>{(item.entry_date ?? '').toString().split('T')[0] || '-'}</Text>
            <Text style={[styles.flatlistCell, { flex: 0.8 }]}>{item.farrowing_number ?? "-"}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.noSowsText}>No hay cerdas registradas.</Text>
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
      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addSowButton} onPress={handleAddPress}>
          <Image
          source={require("../../../assets/icons/add.png")}
          style={styles.icon}
          resizeMode="contain"
          />
        <Text style={styles.addSowText}> Agregar</Text>
      </TouchableOpacity>

      {/* Deleting Pop up */}
      <Modal visible={modalVisible && selectedSow !== null} transparent animationType="fade">
        <View style={styles.deleteContainer}>
          <View style={styles.deleteView}>
            <Text style={styles.deleteViewMessage}>Seguro que desea eliminar a {selectedSow?.sow_tag_number ?? ""}?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.deletebuttons, { backgroundColor: "#ac0202ff" }]}
                onPress={() => selectedSow && handleDeleteSow(selectedSow.sow_id)}>
                <Text  style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deletebuttons, { backgroundColor: "#007AFF" }]}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedSow(null);
                }}>
                <Text style={styles.deleteButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  messagesAlignment: {
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
  addSowButton: {
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
  addSowText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 2,
  },
  // Delete Modal Styles
  deleteContainer:{
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  deleteView:{
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  deleteViewMessage:{
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 10,
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
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
