import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import AddAction from "../../../shared/components/actions/addAction";
import SearchFilter from "../../../shared/components/filters/searchFilter";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import ConfirmDeleteModal from "../../../shared/components/modals/confirmDeleteModal";
import { useMultiSelection } from "../../../shared/hooks/useMultiSelection";
import type { Sow } from "../api/sowsApi";
import SowActionsModal from "../components/SowActionsModal";
import SowFilterSheet from "../components/SowFilterSheet";
import SowListItem from "../components/SowListItem";
import SowSelectedActionsModal from "../components/SowSelectedActionsModal";
import { useSowActions } from "../hooks/useSowActions";
import { useSowsAPI } from "../hooks/useSowsAPI";
import { useSowsFiltering } from "../hooks/useSowsFiltering";
import { useSowsModals } from "../hooks/useSowsModals";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Sows">;

/**
 * Main sows list screen.
 * Orchestrates data fetching, filtering, multi-selection, modal state, and navigation
 * by delegating to dedicated hooks and components.
 */
export default function SowsScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Data fetching and refresh
  const { sows, loading, error, refreshing, loadSows, onRefresh } = useSowsAPI();

  // Filtering and search
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

  // Multi-row selection
  const { selected: selectedSows, toggleSelect, deselectAll } = useMultiSelection();

  // All modal open/close state
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

  // Navigation and delete actions
  const { 
    handleAdd, 
    handleDetails, 
    handleDeletePress, 
    handleSowAction, 
    confirmDelete, 
    deleting 
  } = useSowActions({
    navigation,
    loadSows,
    modals: { openDeleteModal, closeActionsModal, closeDeleteModal },
    deleteSelectedSow,
  });

  // Reload the list every time this screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadSows();
    }, [loadSows]),
  ); 

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
    <ScreenContainer>
      <View style={styles.mainContainer}>
        {/* Filter bottom-sheet */}
        <SowFilterSheet
          visible={filterSheetVisible}
          onClose={closeFilterSheet}
          onClear={clearAllFilters}
          statusOptions={statusOptions}
          breedOptions={breedOptions}
          onStatusChange={setStatusFilter}
          onBreedChange={setBreedFilter}
          selectedStatus={filters.status}
          selectedBreedId={filters.breedId}
        />

        {/* Sow list */}
        <FlatList<Sow>
          data={filteredSows}
          keyExtractor={(item) => `${item.sow_id}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <SowListItem
              item={item}
              isActive={sowAction?.sow_id === item.sow_id && actionsModalVisible}
              selected={selectedSows.has(item.sow_id)}
              onPress={() => {
                handleDetails(item.sow_id, selectedSows.size);
                clearAllFilters();
              }}
              onLongPress={() => handleDeletePress(item.sow_id, item.sow_tag_number)}
              onToggleSelect={() => toggleSelect(item.sow_id)}
              onOpenActions={() => {
                openActionsModal(item);
                deselectAll();
              }}
            />
          )}
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

        {/* Per-row contextual actions modal */}
        <SowActionsModal
          visible={actionsModalVisible}
          sow={sowAction}
          onEdit={() => sowAction && handleSowAction("edit", sowAction)}
          onDetails={() => sowAction && handleSowAction("moreDetails", sowAction)}
          onDelete={() => sowAction && handleSowAction("delete", sowAction)}
          onClose={closeActionsModal}
          onRetired={async () => {
            await loadSows();
            clearAllFilters();
          }}
          onBeforeAction={clearAllFilters}
        />

        {/* Floating button — switches between Add and multi-selection actions */}
        {selectedSows.size > 0 ? (
          <Pressable
            style={({ pressed }) => [
              styles.pinnedSowButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={openSelectedActionsModal}
          >
          <Text style={styles.pinnedSowButtonText}>{` ${selectedSows.size} `}</Text>
          </Pressable>
        ) : (
          <AddAction
            label="Agregar"
            size={55}
            containerStyle={styles.pinnedSowAddButton}
            color="#2E7D32"
            pressedStyle={{ opacity: 0.3 , transform: [{ scale: 0.98 }]}}
            onPress={() => {
              handleAdd();
              clearAllFilters();
            }}
          />
        )}

        {/* Delete confirmation */}
        <ConfirmDeleteModal
          visible={deleteModalVisible && deleteSelectedSow !== null}
          name={deleteSelectedSow?.sow_tag_number}
          title="Eliminar cerda"
          message={`¿Seguro que desea eliminar a la cerda ${deleteSelectedSow?.sow_tag_number ?? ""}?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={deleting}
          onConfirm={() => {
            confirmDelete();
            clearAllFilters();
          }}
          onCancel={closeDeleteModal}
        />

        {/* Batch actions modal for the current multi-selection */}
        <SowSelectedActionsModal
          visible={selectedActionsVisible}
          selectedCount={selectedSows.size}
          selectedIds={Array.from(selectedSows)}
          onClose={closeSelectedActionsModal}
          onDeselect={deselectAll}
          onRetired={async () => {
            await loadSows();
            clearAllFilters();
          }}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  icon: { width: 50, height: 50 },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 4,
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
  pinnedSowButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#2E7D32",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  pinnedSowAddButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  pinnedSowButtonText: {
    fontSize: 25,
    textAlign: "center",
    color: "#fff",
  },
});
