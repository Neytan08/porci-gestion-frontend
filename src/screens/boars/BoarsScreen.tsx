import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getBoars, Boar, deleteBoar } from "../../api/boarsApi";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Image, Modal, Pressable, Alert} from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import BreedFilter from "../../components/filters/BreedFilter";
import SearchFilter from "../../components/filters/SearchFilter";
import RowCheckbox from "../../components/uiControls/RowCheckbox";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Boars'>;

export default function BoarsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [boars, setBoars] = useState<Boar[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] =  useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBreedId, setSelectedBreedId] = useState<number | null>(null);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBoar, setSelectedBoar] = useState<{boar_id: number; boar_tag_number: string } | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

      // Match breeds with selected breed filter
      const breedId = b.breed?.breed_id ?? (b as any).breed_id ?? null;
      const matchBreed = selectedBreedId == null || breedId === selectedBreedId;
      
      // Match each letter in the tag number with the search query
      const q = searchQuery.trim().toLowerCase();
      const tag = (b.boar_tag_number ?? "").toString().toLowerCase();
      const matchSearch = q.length === 0 || tag.includes(q);

      return matchBreed && matchSearch;
    });
  }, [boars, selectedBreedId, searchQuery]);
  
  // Select one boar and clear the previous selection
  const selectOne = useCallback((id: number) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  // Redirect to edit or delete based on action 
  const handleSelectedBoarAction = useCallback((action: "edit" | "delete", boar: Boar) => {
    // if (action === "edit") navigation.navigate("EditBoar", { boarId: boar.boar_id });
    if (action === "delete") {
      setDeleteModalVisible(true);
      setSelectedBoar(boar);
    }
  }, []);

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

  // Handle long press to show delete modal
  const handleLongPress = (boar_id: number, boar_tag_number: string) => {
    setSelectedBoar({ boar_id: boar_id, boar_tag_number: boar_tag_number });
    setDeleteModalVisible(true);
    console.log("Delete");
  };

  /* Handle deleting boars by using the custom hook
  * Re-writing useDeleteEntity interface
  */
  const { deleting, deleteById } = useDeleteEntity<number>({
    deleteFn: deleteBoar,
    onDeleted: loadBoars,
    messages: {
      successTitle: 'Eliminación completada',
      successMessage: 'El verraco fue eliminado correctamente.',
      errorTitle: 'Error',
      errorMessage: 'No se pudo eliminar el verraco. Intente nuevamente.',
    }
  });
  
  // Confirm a boar was selected before delete it (using shared hook)
  const confirmDelete = async () => {
    if (!selectedBoar) return;
    setDeleteModalVisible(false);
    await deleteById(selectedBoar.boar_id);
    setSelectedBoar(null);
  };

  // Initial load
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
        <Text style={[styles.headerTitleCell, { width: 20 }]}></Text>
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Nombre</Text>
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Raza</Text>
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Ingreso</Text>
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
          <Pressable 
            style={({pressed}) => [
              styles.flatlistRow,
              pressed && { backgroundColor: "#e0e0e0", opacity: 0.6, }
            ]}
            onPress={() => Alert.alert('Need to implement', 'Edit boar functionality is not implemented yet.')}
            onLongPress={() => handleLongPress(item.boar_id, item.boar_tag_number)}>
            {/* Checkbox Component */}
            <RowCheckbox
              selected={selectedId === item.boar_id} 
              onPress={() => selectOne(item.boar_id)}
              size={15}
              style={styles.checkboxCell} 
            /> 
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.boar_tag_number ?? '-'}</Text>
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.breed?.breed_name ?? 'Sin Raza'}</Text>
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{(item.entry_date ?? '').toString().split('T')[0] || '-'}</Text>
            {/*TODO: Make this a component */}
            {/* Actions once selected */}
            {selectedId === item.boar_id && (
              <View style={styles.rowActions}>
                {/* Edit Action */}
                <TouchableOpacity
                  onPress={() => handleSelectedBoarAction("edit", item)}
                  style={styles.actionBtn}
                  hitSlop={10}
                  >
                  <Image
                    source={require("../../../assets/icons/edit.png")} // ajusta nombres/rutas
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                {/* Delete Action */}
                <TouchableOpacity
                  onPress={() => handleSelectedBoarAction("delete", item)}
                  style={styles.actionBtn}
                  hitSlop={10}
                  >
                  <Image
                    source={require("../../../assets/icons/trash.png")}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View> 
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.noBoarsText}>No hay verracos registrados.</Text>
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
      {/* Deleting Pop up */}
      <ConfirmDeleteModal
        visible={deleteModalVisible && selectedBoar !== null}
        title="Eliminar verraco"
        message={`¿Seguro que desea eliminar al verraco ${selectedBoar?.boar_tag_number ?? ''}?`}
        name={selectedBoar?.boar_tag_number}
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteModalVisible(false); setSelectedBoar(null); }}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {  width: 42, height: 42 },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 4,
    paddingTop: 10,
    // maxHeight: "50%",
    // maxWidth: "50%",
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
    fontSize: 16,
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
  checkboxCell: { 
    // width: 25, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  flatlistCell: {
    // borderWidth: 1,
    paddingHorizontal: 5,
    marginVertical: 5,
    fontSize: 16,
    textAlign: "left",
    color: "#333",
  },
  noBoarsText: {
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
    fontWeight: "400",
  },
  // Row Actions (Edit/Delete)
  rowActions: {
    width: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingRight: 4,
  },
  actionBtn: { 
    padding: 2, 
  },
  actionIcon: {
    width: 18,
    height: 18, 
    tintColor: "#616161", 
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