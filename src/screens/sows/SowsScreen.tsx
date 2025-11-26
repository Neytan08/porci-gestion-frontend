import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Pressable, ActivityIndicator, StyleSheet, RefreshControl, Modal, Alert, Image, TextInput } from "react-native";
import { deleteSowbyId, getSows, Sow } from "../../api/sowsApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import StatusFilter from "../../components/filters/StatusFilter";
import BreedFilter from "../../components/filters/BreedFilter";
import SearchFilter from "../../components/filters/SearchFilter";
import RowCheckbox from "../../components/uiControls/RowCheckbox";
import EditAction from "../../components/uiControls/EditAction";
import DeleteAction from "../../components/uiControls/DeleteAction";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sows'>;

export default function SowsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [sows, setSows] = useState<Sow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSow, setSelectedSow] = useState<{ sow_id: number; sow_tag_number: string } | null>(null);
  const [selectedBreedId, setSelectedBreedId] = useState<number | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Build breed options from sows (id -> name), no extra API call
  const breedOptions = useMemo(() => {
    const map = new Map<number, string>();
    sows.forEach(b => {
      const id = b.breeds?.breed_id ?? (b as any).breed_id;
      const name = b.breeds?.breed_name ?? (b as any).breed_name;
      if (id != null && typeof name === "string" && name.trim()) map.set(id, name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [sows]
  );

  // Build status options from sows (id -> name), no extra API call
  const statusOptions = useMemo(() => {
    const map = new Map<number, string>();
    sows.forEach(s => {
      const id = s.status?.status_id ?? (s as any).status_id;
      const name = s.status?.status_name ?? (s as any).status_name;
      if (id != null && typeof name === "string" && name.trim()) map.set(id, name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [sows]
  );

  // Filtered list
  const filteredSows = useMemo(() => {
    return sows.filter((s) => {

      // Match breeds with selected breed filter
      const breedId = s.breeds?.breed_id ?? (s as any).breed_id ?? null;
      const matchBreed = selectedBreedId == null || breedId === selectedBreedId;

      // Match status with selected status filter
      const statusId = s.status?.status_id ?? (s as any).status_id ?? null;
      const matchStatus = selectedStatusId == null || statusId === selectedStatusId;

      // Match each letter in the tag number with the search query
      const searchName = searchQuery.trim().toLowerCase();
      const tag = (s.sow_tag_number ?? "").toString().toLowerCase();
      const matchSearch = searchName.length === 0 || tag.includes(searchName);

      return matchBreed && matchStatus && matchSearch;
    });
  }, [sows, selectedBreedId, selectedStatusId, searchQuery]);

  // Select one sow and clear the previous selection
  const selectOne = useCallback((id: number) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  // Redirect to edit or delete based on action 
  const handleSelectedSowAction = useCallback((action: "edit" | "delete", sow: Sow) => {
    if (action === "edit") navigation.navigate("EditSow", { sowId: sow.sow_id });
    if (action === "delete") {
      setDeleteModalVisible(true);
      setSelectedSow(sow);
    }
  }, []);

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

  // Handle pull-to-refresh action
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

  // Handle long press to show delete modal
  const handleLongPress = (sow_id: number, sow_tag_number: string) => {
    setSelectedSow({ sow_id: sow_id, sow_tag_number: sow_tag_number });
    setDeleteModalVisible(true);
    console.log("Delete");
  };

  // Handle deleting sows by using the custom hook
  const { deleting, deleteById } = useDeleteEntity<number>({
    deleteFn: deleteSowbyId,
    onDeleted: loadSows,
    messages: {
      successTitle: 'Eliminación completada',
      successMessage: 'La cerda fue eliminada correctamente.',
      errorTitle: 'Error',
      errorMessage: 'No se pudo eliminar la cerda. Intente nuevamente.',
    }
  });

  // Confirm a sow was selected before delete it (using shared hook)
  const deleteSow = async () => {
    if (!selectedSow) return;
    setDeleteModalVisible(false);
    await deleteById(selectedSow.sow_id);
    setSelectedSow(null);
  };

  // Initial load
  useEffect(() => {
    loadSows();
  }, []);

  // Reload the screen when coming back to it
  useFocusEffect(
    useCallback(() => {
      loadSows();
    }, [])
  );

  // In case of loading last to long
  if (loading) {
    return (
      <View style={styles.messagesAlignment}>
        <ActivityIndicator size="large" />
        <Text>Cargando cerdas...</Text>
      </View>
    );
  }

  // In case of error
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
        <Text style={[styles.headerTitleCell, { width: 20 }]}></Text>
        <Text style={[styles.headerTitleCell, { flex: 1.2 }]}>Nombre</Text>
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Estado</Text>
        <Text style={[styles.headerTitleCell, { flex: 1 }]}>Ingreso</Text>
        <Text style={[styles.headerTitleCell, { flex: 0.7 }]}>Partos</Text>
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
          /* Each row is pressable to view details or long-press to delete */
          <Pressable
            style={({ pressed }) => [
              styles.flatlistRow,
              pressed && { backgroundColor: "#e0e0e0", opacity: 0.6, }
            ]}
            onPress={() => handleDetailsPress(item.sow_id)}
            onLongPress={() => handleLongPress(item.sow_id, item.sow_tag_number)} >
            {/* Checkbox Component */}
            <RowCheckbox
              selected={selectedId === item.sow_id}
              onPress={() => selectOne(item.sow_id)}
              size={15}
              style={styles.checkboxCell}
            />
            {/* Sow Data Cells */}
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.sow_tag_number ?? '-'}</Text>
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{item.status?.status_name ?? "Sin estado"}</Text>
            <Text style={[styles.flatlistCell, { flex: 1 }]}>{(item.entry_date ?? '').toString().split('T')[0] || '-'}</Text>
            <Text style={[styles.flatlistCell, { flex: 0.2 }]}>{item.farrowing_number ?? "-"}</Text>
            {/* Actions once selected */}
            {selectedId === item.sow_id && (
              <View style={styles.rowActions}>
                {/* Edit Action */}
                <EditAction onPress={() => handleSelectedSowAction("edit", item)} />
                {/* Delete Action */}
                <DeleteAction onPress={() => handleSelectedSowAction("delete", item)} />
              </View>
            )}
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
      <ConfirmDeleteModal
        visible={deleteModalVisible && selectedSow !== null}
        name={selectedSow?.sow_tag_number}
        title="Eliminar cerda"
        message={`¿Seguro que desea eliminar a la cerda ${selectedSow?.sow_tag_number ?? ''}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        onConfirm={deleteSow}
        onCancel={() => { setDeleteModalVisible(false); setSelectedSow(null); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { width: 42, height: 42 },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 4,
    paddingTop: 10,
    // maxHeight: '80%',
    // maxWidth: '80%',
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
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    textAlignVertical: "center",
    // borderWidth: 1,
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
    paddingHorizontal: 5,
    marginVertical: 2,
    fontSize: 14,
    textAlign: "left",
    textAlignVertical: "center",
    color: "#333",
    // borderWidth: 1,
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
    fontWeight: "400",
  },
  // Row Actions (Edit/Delete)
  rowActions: {
    width: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    paddingRight: 4,
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
