import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Pressable, ActivityIndicator, StyleSheet, RefreshControl, Modal, Alert, Image } from "react-native";
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
import ListAction from "../../components/uiControls/ListAction";
import DetailsAction from "../../components/uiControls/DetailsAction";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sows'>;

export default function SowsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [sows, setSows] = useState<Sow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteSelectedSow, setDeleteSelectedSow] = useState<{ sow_id: number; sow_tag_number: string } | null>(null);
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [filterSelectedBreedId, setFilterSelectedBreedId] = useState<number | null>(null);
  const [filterSelectedStatusId, setFilterSelectedStatusId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSows, setSelectedSows] = useState<Set<number>>(new Set());
  const [actionsModalVisible, setActionsModalVisible] = useState(false);
  const [sowAction, setSowAction] = useState<Sow | null>(null);
  const [selectedActionsVisible, setSelectedActionsVisible] = useState(false);

  // Build breed options from sows (id -> name), no extra API call
  const breedOptions = useMemo(() => {
    const map = new Map<number, string>();
    // Go through all sows to extract breeds
    sows.forEach(b => {
      const id = b.breed?.breed_id ?? (b as any).breed_id;
      const name = b.breed?.breed_name ?? (b as any).breed_name;
      if (id != null && typeof name === "string" && name.trim()) map.set(id, name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [sows]
  );

  // Build status options from sows (id -> name), no extra API call
  const statusOptions = useMemo(() => {
    const map = new Map<number, string>();
    // Go through all sows to extract unique statuses
    sows.forEach(s => {
      const id = s.status?.status_id ?? (s as any).status_id;
      const name = s.status?.status_name ?? (s as any).status_name;
      if (id != null && typeof name === "string" && name.trim()) map.set(id, name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [sows]
  );

  // Filter sows list based on selected filters and search query
  const filterSows = useMemo(() => {
    return sows.filter((s) => {

      // Match breeds with selected breed filter
      const breedId = s.breed?.breed_id ?? (s as any).breed_id ?? null;
      const matchBreed = filterSelectedBreedId == null || breedId === filterSelectedBreedId;

      // Match status with selected status filter
      const statusId = s.status?.status_id ?? (s as any).status_id ?? null;
      const matchStatus = filterSelectedStatusId == null || statusId === filterSelectedStatusId;

      // Match each letter in the tag number with the search query
      const searchName = searchQuery.trim().toLowerCase();
      const tag = (s.sow_tag_number ?? "").toString().toLowerCase();
      const matchSearch = searchName.length === 0 || tag.includes(searchName);

      return matchBreed && matchStatus && matchSearch;
    });
  }, [sows, filterSelectedBreedId, filterSelectedStatusId, searchQuery]);

  // Select multiple Sows
  const toggleSelect = useCallback((id: number) => {
    setSelectedSows(prev => {
      const next = new Set(prev);
      // Remove it if already selected, else add it
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Redirect to Sow screens based on action selected
  const handleSelectedSowAction = useCallback((action: "edit" | "delete" | "moreDetails", sow: Sow) => {
    if (action === "edit") navigation.navigate("EditSow", { sowId: sow.sow_id });
    if (action === "moreDetails") navigation.navigate("DetailsSow", { sowId: sow.sow_id });
    if (action === "delete") {
      setDeleteModalVisible(true);
      setDeleteSelectedSow(sow);
    }
  }, []);

  // Reload the sows list when the screen is focused
  const loadSows =useCallback( async () => {
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
  }, []);

  // Handle pull-to-refresh action
  const onRefresh = useCallback(async () => {
      setRefreshing(true);
      try {
        await loadSows();
      } finally {
        setRefreshing(false);
      }
    }, [loadSows]);

  // Navigate to AddSow screen
  const handleAddPress = () => {
    navigation.navigate("AddSow" as never);
  };

  // Navigate to DetailsSow screen
  const handleDetailsPress = (sowId: number) => {
    console.log("Ver detalles");
    navigation.navigate('DetailsSow', { sowId });
  };

  // Handle long press to show confirm delete modal
  const handleDeletePress = (sow_id: number, sow_tag_number: string) => {
    setDeleteSelectedSow({ sow_id: sow_id, sow_tag_number: sow_tag_number });
    setDeleteModalVisible(true);
    console.log("Delete");
  };

  /* Handle deleting boars by using the custom hook
  * Re-writing useDeleteEntity interface
  */
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
  const confirmDeleteSow = async () => {
    if (!deleteSelectedSow) return;
    setDeleteModalVisible(false);
    await deleteById(deleteSelectedSow.sow_id);
    setDeleteSelectedSow(null);
  };

  // Initial load
  useEffect(() => {
    loadSows();
  }, [loadSows]);

  // Reload the screen when coming back to it
  useFocusEffect(
    useCallback(() => {
      loadSows();
    }, [])
  );

  // In case of loading last too long
  if (loading) {
    return (
      <View style={styles.messagesAlignment}>
        <ActivityIndicator size="large" />
        <Text>Cargando cerdas...</Text>
      </View>
    );
  }

  // Show error message if any
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
              selectedId={filterSelectedStatusId}   // number | null
              onChange={setFilterSelectedStatusId}  // (id) => void
            />
            {/* Divider */}
            <View style={styles.sectionDivider} />
            {/* Breed Section */}
            <BreedFilter
              options={breedOptions}                 // [{label, value}]
              selectedId={filterSelectedBreedId}     // number | null
              onChange={setFilterSelectedBreedId}    // (id) => void
            />
            {/* Filter Buttons */}
            <View style={styles.filterBtnRow}>
              <Pressable
                style={[styles.filterBtn, { backgroundColor: "#e0e0e0" }]}
                onPress={() => { setFilterSelectedBreedId(null); setFilterSelectedStatusId(null); setFilterSheetVisible(false); }}
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
      {/*Breeding Sow List */}
      <FlatList<Sow>
        data={filterSows}
        keyExtractor={(item) => `${item.sow_id}`}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          // Compute active state for styling when the modal is open for the item
          const isActive = sowAction?.sow_id === item.sow_id && actionsModalVisible;
          /* Each row is pressable to view details or long-press to delete */
          return (
            <Pressable
              style={({ pressed }) => [
                styles.pressableRow,
              pressed && { backgroundColor: "#e0e0e0", opacity: 0.6, }
              ]}
              onPress={() => handleDetailsPress(item.sow_id)}
              onLongPress={() => handleDeletePress(item.sow_id, item.sow_tag_number)} 
            >
              {/* FlatList Content */}
              <View style={[styles.contentRow, isActive && styles.contentRowActive]}>
                <RowCheckbox
                  selected={selectedSows.has(item.sow_id)}
                  onPress={() => toggleSelect(item.sow_id)}
                  size={18}
                  radius={4}
                  width={1}
                  color={"#eee"}
                  style={styles.checkBox}
                />
                <Text style={[styles.textCell, {flex: 1.3}]}>
                  <Text style={{ fontWeight: '700' }}>Identificador: </Text>
                  {item.sow_tag_number ?? '-'}
                </Text>
                <Text style={[styles.textCell, {flex: 1}]}> 
                  <Text style={{ fontWeight: '700' }}>Estado: </Text>
                  {item.status?.status_name ?? "Sin estado"}
                </Text>
                <Text style={[styles.textCell, {width: '101%'}]}>
                  <Text style={{ fontWeight: '700' }}>Ingreso: </Text>
                  {item.entry_date ? item.entry_date.split("T")[0] : "-"}
                </Text>
                <Text style={[styles.textCell, {width: '101%'}]}>
                  <Text style={{ fontWeight: '700' }}>Partos: </Text>
                  {item.farrowing_number ?? "-"}
                </Text>       
                <View style={styles.detailsButton}>
                  {/* List Action: pop up a small view with actions for the item */}
                  <ListAction  onPress={() => { setSowAction(item); setActionsModalVisible(true); }} />
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.noSowsText}>No hay cerdas registradas.</Text>
        }
        ListHeaderComponent={
          <View style={styles.flatListHeader}>
            <Pressable
            style={({ pressed }) => [
                styles.filterBtnText,
              pressed && { backgroundColor: "#e0e0e0", opacity: 0.6, }
              ]}
              onPress={() => setFilterSheetVisible(true)
            }>
              <Text style={styles.filterLinkText}>Filtrar por…</Text>
            </Pressable>
            <SearchFilter
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </View>
        }
        ListHeaderComponentStyle={{ paddingTop: 2, paddingBottom: 4 }}
        contentContainerStyle={{ paddingBottom: 90 }}
      />
      {/* Modal for actions */}
      <Modal
        visible={actionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => { setActionsModalVisible(false); setSowAction(null); }}
      >
        <View style={styles.modalActionsContainer}>
          {/* Overlay catch clicks outside the panel and closes it */}
          <Pressable style={styles.modalActionsOverlay} onPress={() => { setActionsModalVisible(false); setSowAction(null); }} />
          {/* Container for the panel with buttons (will not touch the overlay) */}
          <View style={styles.modalActionsView}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>
              Acciones Disponibles: {sowAction?.sow_tag_number ?? sowAction?.sow_id}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <EditAction onPress={() => { setActionsModalVisible(false); /* luego navega/edit */ handleSelectedSowAction('edit', sowAction!); }} />
              <DetailsAction onPress={() => { setActionsModalVisible(false); handleSelectedSowAction('moreDetails', sowAction!); }} />
              <DeleteAction onPress={() => { setActionsModalVisible(false); handleSelectedSowAction('delete', sowAction!); }} />
            </View>
          </View>
        </View>
      </Modal>
      {/*  Selected or Add button depending on selection */}
      {selectedSows.size > 0 ? (
        // Floating Selected Actions Button
        <TouchableOpacity style={styles.pinnedSowButton} onPress={() => setSelectedActionsVisible(true)}>
        <Image
          source={require("../../../assets/icons/dots.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.pinnedSowButtonText}>{`(${selectedSows.size})   `}</Text>
        </TouchableOpacity>
      ):(
        // Floating Add Button 
        <TouchableOpacity style={styles.pinnedSowButton} onPress={handleAddPress}>
          <Image
            source={require("../../../assets/icons/add.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.pinnedSowButtonText}> Agregar</Text>
        </TouchableOpacity>
      )}
      {/* Deleting Pop up */}
      <ConfirmDeleteModal
        visible={deleteModalVisible && deleteSelectedSow !== null}
        name={deleteSelectedSow?.sow_tag_number}
        title="Eliminar cerda"
        message={`¿Seguro que desea eliminar a la cerda ${deleteSelectedSow?.sow_tag_number ?? ''}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        onConfirm={confirmDeleteSow}
        onCancel={() => { setDeleteModalVisible(false); setDeleteSelectedSow(null); }}
      />
      {/* Selection Section */}
      <Modal
        visible={selectedActionsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedActionsVisible(false)}
      >
        <Pressable style={styles.filterOverlay} onPress={() => setSelectedActionsVisible(false)}>
          <View style={styles.filterOverlayView}>
            <Text style={styles.filterOverlayTitle}>{`Cerdas Seleccionadas (${selectedSows.size})`}</Text>
            <View style={styles.filterBtnRow}>
              {/* PDF Extraction */}
              <Pressable
                style={styles.filterBtn}
                onPress={() => Alert.alert('Funcion no implementada')}
              >
                <Image
                  source={require("../../../assets/icons/pdf-file.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "700", textAlign: "center" }}>Extraer a PDF</Text>
              </Pressable>
              {/* Retire Sow */}
              <Pressable
                style={styles.filterBtn}
                onPress={() => Alert.alert('Funcion no implementada')}
              >
                <Image
                  source={require("../../../assets/icons/trash.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "700", textAlign: "center" }}>Desechar Cerdas</Text>
              </Pressable>
              {/* Clear selection */}
              <Pressable
                style={styles.filterBtn}
                onPress={() => [setSelectedSows(new Set()), setSelectedActionsVisible(false)]}
              >
                <Image
                  source={require("../../../assets/icons/uncheck.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "700", textAlign: "center"}}>Limpiar Selección</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
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
  },
  messagesAlignment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noSowsText: {
    textAlign: "center",
    marginTop: 20,
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
  // FlatList Header
  flatListHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLinkText: {
    fontSize: 14,
    fontWeight: "400",
  },
  filterBtnText: {
    minHeight: 40, 
    minWidth: 150, 
    alignContent: "center",  
    padding: 8, 
    borderRadius: 6,
  },
  // FlatList Rows
  pressableRow: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 5,
  },
  contentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  contentRowActive: {
    backgroundColor: '#e2e2e2',
  },
  textCell: { 
    color: "#333", 
    fontSize: 14, 
    marginBottom: 2,
  },
  checkBox: {
    position: 'absolute',
    left: -4,
    top: -3,
  },
  detailsButton: {
    width: '101%', // So the wrapper takes full width
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minHeight: 40,
    marginTop: -20,
    marginBottom: -5,
    marginRight: -20,
  },
  // Floating Buttons
  pinnedSowButton: {
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
  pinnedSowButtonText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 2,
  },
  // Modal Actions Styles
  modalActionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalActionsView: {
    minWidth: 300,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    zIndex: 500,
    elevation: 10, // sombra Android
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
});
