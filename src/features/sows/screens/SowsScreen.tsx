import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { deleteSowbyId, type Sow } from "../api/sowsApi";
import OptionsFilter from "../../../shared/components/filters/optionsFilter";
import SearchFilter from "../../../shared/components/filters/searchFilter";
import ConfirmDeleteModal from "../../../shared/components/modals/confirmDeleteModal";
import DeleteAction from "../../../shared/components/actions/deleteAction";
import DetailsAction from "../../../shared/components/actions/detailsAction";
import EditAction from "../../../shared/components/actions/editAction";
import ListAction from "../../../shared/components/actions/listAction";
import RowCheckbox from "../../../shared/components/selection/rowCheckBox";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import { useSowsAPI } from "../hooks/useSowsAPI";
import { useSowsFiltering } from "../hooks/useSowsFiltering";
import { useSowsModals } from "../hooks/useSowsModals";
import { useDeleteEntity } from "../../../shared/hooks/useDeleteEntity";
import { useMultiSelection } from "../../../shared/hooks/useMultiSelection";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Sows">;

export default function SowsScreen() {
  const navigation = useNavigation<NavigationProp>();

  // API and data fetching
  const { sows, loading, error, refreshing, loadSows, onRefresh } = useSowsAPI();

  // Filtering logic
  const {
    filters,
    filteredSows,
    breedOptions,
    statusOptions,
    setBreedFilter,
    setStatusFilter,
    setSearchQuery,
    clearAllFilters,
  } = useSowsFiltering(sows);

  // Multi-selection management
  const { selected: selectedSows, toggleSelect, deselectAll } = useMultiSelection();

  // Modal management
  const {
    filterSheetVisible,
    openFilterSheet,
    closeFilterSheet,
    actionsModalVisible,
    sowAction,
    openActionsModal,
    closeActionsModal,
    deleteModalVisible,
    deleteSelectedSow,
    openDeleteModal,
    closeDeleteModal,
    selectedActionsVisible,
    openSelectedActionsModal,
    closeSelectedActionsModal,
  } = useSowsModals();

  // Redirect to Sow screens based on action selected
  const handleSelectedSowAction = useCallback(
    (action: "edit" | "delete" | "moreDetails", sow: Sow) => {
      if (action === "edit") {
        console.log("Editar");
        navigation.navigate("EditSow", { sowId: sow.sow_id });
      }
      if (action === "moreDetails") navigation.navigate("DetailsSow", { sowId: sow.sow_id });
      if (action === "delete") {
        openDeleteModal(sow.sow_id, sow.sow_tag_number);
        closeActionsModal();
      }
    },
    [navigation, openDeleteModal, closeActionsModal],
  );

  // Reload the sows list when the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadSows();
    }, [loadSows]),
  );

  // Navigate to AddSow screen
  const handleAddPress = useCallback(() => {
    navigation.navigate("AddSow" as never);
  }, [navigation]);

  // Navigate to DetailsSow screen
  const handleDetailsPress = useCallback(
    (sowId: number) => {
      navigation.navigate("DetailsSow", { sowId });
    },
    [navigation],
  );

  // Handle long press to show confirm delete modal
  const handleDeletePress = useCallback(
    (sow_id: number, sow_tag_number: string) => {
      openDeleteModal(sow_id, sow_tag_number);
    },
    [openDeleteModal],
  );

  /* Handle deleting sows by using the custom hook
   * Re-writing useDeleteEntity interface
   */
  const { deleting, deleteById } = useDeleteEntity<number>({
    deleteFn: deleteSowbyId,
    onDeleted: loadSows,
    messages: {
      successTitle: "Eliminación completada",
      successMessage: "La cerda fue eliminada correctamente.",
      errorTitle: "Error",
      errorMessage: "No se pudo eliminar la cerda. Intente nuevamente.",
    },
  });

  // Confirm a sow was selected before delete it (using shared hook)
  const confirmDeleteSow = useCallback(async () => {
    if (!deleteSelectedSow) return;
    closeDeleteModal();
    await deleteById(deleteSelectedSow.sow_id);
  }, [deleteSelectedSow, closeDeleteModal, deleteById]);

  // Load sows on mount and every time the screen regains focus

  // In case of loading last too long
  if (loading) {
    console.log("Loading sows...");
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
    <ScreenContainer>
      <View style={styles.mainContainer}>
        {/* Filter Section */}
        <Modal
          visible={filterSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={closeFilterSheet}
        >
          <Pressable style={styles.filterOverlay} onPress={closeFilterSheet}>
            <View style={styles.filterOverlayView}>
              <Text style={styles.filterOverlayTitle}>Filtros</Text>
              {/* Status Filter */}
              <OptionsFilter
                options={statusOptions}
                selectedId={null}
                onChange={setStatusFilter}
                title="Estado"
              />
              {/* Divider */}
              <View style={styles.sectionDivider} />
              {/* Breed Filter */}
              <OptionsFilter
                options={breedOptions}
                selectedId={null}
                onChange={setBreedFilter}
                title="Raza"
              />
              {/* Filter Buttons */}
              <View style={styles.filterBtnRow}>
                <Pressable
                  style={[styles.filterBtn, { backgroundColor: "#e0e0e0" }]}
                  onPress={clearAllFilters}
                >
                  <Text style={{ fontWeight: "700", color: "#333" }}>Limpiar filtros</Text>
                </Pressable>
                <Pressable
                  style={[styles.filterBtn, { backgroundColor: "#2E7D32" }]}
                  onPress={closeFilterSheet}
                >
                  <Text style={{ fontWeight: "700", color: "#fff" }}>Aplicar</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
        {/*Breeding Sow List */}
        <FlatList<Sow>
          data={filteredSows}
          keyExtractor={(item) => `${item.sow_id}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => {
            // Compute active state for styling when the modal is open for the item
            const isActive = sowAction?.sow_id === item.sow_id && actionsModalVisible;
            /* Each row is pressable to see details or long-press to delete */
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.pressableRow,
                  pressed && { backgroundColor: "#e0e0e0", opacity: 0.6 },
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
                  <Text style={[styles.textCell, { flexBasis: "55%" }]}>
                    <Text style={{ fontWeight: "700" }}>Identificador: </Text>
                    {item.sow_tag_number ?? "-"}
                  </Text>
                  <Text style={[styles.textCell, { flexBasis: "45%" }]}>
                    <Text style={{ fontWeight: "700" }}>Estado: </Text>
                    {item.status?.status_name ?? "Sin estado"}
                  </Text>
                  <Text style={[styles.textCell, { flexBasis: "55%" }]}>
                    <Text style={{ fontWeight: "700" }}>Ingreso: </Text>
                    {item.entry_date ? item.entry_date.split("T")[0] : "-"}
                  </Text>
                  <Text style={[styles.textCell, { flexBasis: "40%" }]}>
                    <Text style={{ fontWeight: "700" }}>Partos: </Text>
                    {item.farrowing_number ?? "-"}
                  </Text>
                  <View style={styles.detailsButton}>
                    {/* List Action: pop up a small view with actions for the item */}
                    <ListAction
                      onPress={() => {
                        openActionsModal(item);
                      }}
                    />
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={styles.noSowsText}>No hay cerdas registradas.</Text>}
          ListHeaderComponent={
            <View style={styles.flatListHeader}>
              <Pressable
                style={({ pressed }) => [
                  styles.filterBtnText,
                  pressed && { backgroundColor: "#e0e0e0", opacity: 0.6 },
                ]}
                onPress={openFilterSheet}
              >
                <Text style={styles.filterLinkText}>Filtrar por</Text>
              </Pressable>
              <SearchFilter value={filters.searchQuery} onChange={setSearchQuery} />
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
          onRequestClose={closeActionsModal}
        >
          <View style={styles.modalActionsContainer}>
            {/* Overlay catch clicks outside the panel and closes it */}
            <Pressable style={styles.modalActionsOverlay} onPress={closeActionsModal} />
            {/* Container for the panel with buttons (will not touch the overlay) */}
            <View style={styles.modalActionsView}>
              <Text style={{ fontWeight: "700", marginBottom: 8 }}>
                Acciones Disponibles: {sowAction?.sow_tag_number ?? sowAction?.sow_id}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <EditAction
                  onPress={() => {
                    if (sowAction) {
                      handleSelectedSowAction("edit", sowAction);
                    }
                    closeActionsModal();
                  }}
                />
                <DetailsAction
                  onPress={() => {
                    closeActionsModal();
                    if (sowAction) {
                      handleSelectedSowAction("moreDetails", sowAction);
                    }
                  }}
                />
                <DeleteAction
                  onPress={() => {
                    closeActionsModal();
                    if (sowAction) {
                      handleSelectedSowAction("delete", sowAction);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/*  Selected or Add button depending on selection */}
        {selectedSows.size > 0 ? (
          // Floating Selected Actions Button
          <Pressable
            style={({ pressed }) => [
              styles.pinnedSowButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={openSelectedActionsModal}
          >
            <Image
              source={require("../../../../assets/icons/dots.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.pinnedSowButtonText}>{`(${selectedSows.size})   `}</Text>
          </Pressable>
        ) : (
          // Floating Add Button
          <Pressable
            style={({ pressed }) => [
              styles.pinnedSowButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleAddPress}
          >
            <Image
              source={require("../../../../assets/icons/add.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.pinnedSowButtonText}> Agregar</Text>
          </Pressable>
        )}
        {/* Deleting Pop up */}
        <ConfirmDeleteModal
          visible={deleteModalVisible && deleteSelectedSow !== null}
          name={deleteSelectedSow?.sow_tag_number}
          title="Eliminar cerda"
          message={`¿Seguro que desea eliminar a la cerda ${deleteSelectedSow?.sow_tag_number ?? ""}?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={deleting}
          onConfirm={confirmDeleteSow}
          onCancel={() => {
            closeDeleteModal();
          }}
        />
        {/* Selection Section */}
        <Modal
          visible={selectedActionsVisible}
          transparent
          animationType="fade"
          onRequestClose={closeSelectedActionsModal}
        >
          <Pressable style={styles.filterOverlay} onPress={closeSelectedActionsModal}>
            <View style={styles.filterOverlayView}>
              <Text
                style={styles.filterOverlayTitle}
              >{`Cerdas Seleccionadas (${selectedSows.size})`}</Text>
              <View style={styles.filterBtnRow}>
                {/* PDF Extraction */}
                <Pressable
                  style={styles.filterBtn}
                  onPress={() => Alert.alert("Funcion no implementada")}
                >
                  <Image
                    source={require("../../../../assets/icons/pdf-file.png")}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  <Text style={{ fontWeight: "700", textAlign: "center" }}>Extraer a PDF</Text>
                </Pressable>
                {/* Retire Sow */}
                <Pressable
                  style={styles.filterBtn}
                  onPress={() => Alert.alert("Funcion no implementada")}
                >
                  <Image
                    source={require("../../../../assets/icons/trash.png")}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  <Text style={{ fontWeight: "700", textAlign: "center" }}>Desechar Cerdas</Text>
                </Pressable>
                {/* Clear selection */}
                <Pressable
                  style={styles.filterBtn}
                  onPress={() => [deselectAll(), closeSelectedActionsModal()]}
                >
                  <Image
                    source={require("../../../../assets/icons/uncheck.png")}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  <Text style={{ fontWeight: "700", textAlign: "center" }}>Limpiar Selección</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  icon: { width: 42, height: 42 },
  safeAreaContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 4,
    // paddingTop: 10,
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
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
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
    paddingHorizontal: 4,
  },
  filterLinkText: {
    fontSize: 14,
    fontWeight: "400",
  },
  filterBtnText: {
    minHeight: 40,
    minWidth: 150,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  // FlatList Rows
  pressableRow: {
    flexDirection: "row",
    borderRadius: 10,
    marginBottom: 5,
  },
  contentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  contentRowActive: {
    backgroundColor: "#e2e2e2",
  },
  textCell: {
    color: "#333",
    fontSize: 14,
    marginBottom: 2,
  },
  checkBox: {
    position: "absolute",
    left: -4,
    top: -3,
  },
  detailsButton: {
    width: "101%", // So the wrapper takes full width
    alignItems: "flex-end",
    justifyContent: "flex-end",
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalActionsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalActionsView: {
    minWidth: 300,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    zIndex: 500,
    elevation: 10, // sombra Android
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
});

