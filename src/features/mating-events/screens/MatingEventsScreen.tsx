import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import ConfirmDeleteModal from "../../../shared/components/modals/confirmDeleteModal";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import { useMultiSelection } from "../../../shared/hooks/useMultiSelection";
import type { MatingEvent } from "../api/matingEventApi";
import MatingEventActionsModal from "../components/MatingEventActionsModal";
import MatingEventListItem from "../components/MatingEventListItem";
import MatingEventSelectedActionsModal from "../components/MatingEventSelectedActionsModal";
import { useMatingEventActions } from "../hooks/useMatingEventActions";
import { useMatingEventsAPI } from "../hooks/useMatingEventsAPI";
import type { PregnancyResult } from "../model/matingEvent";
import { useMatingEventsModals } from "../hooks/useMatingEventsModals";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "MatingEvents">;

/**
 * Main mating events list screen.
 * Orchestrates data fetching, tab-based grouping, multi-selection, modals, and navigation
 * by delegating to dedicated hooks and components.
 */
export default function MatingEventsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { eventsByResult, counts, loadingAll, refreshing, loadAll, onRefresh } =
    useMatingEventsAPI();

  const { selected: selectedEvents, toggleSelect, deselectAll } = useMultiSelection();

  const {
    actionsModalVisible,
    actionForEvent,
    deleteModalVisible,
    eventToDelete,
    selectedActionsVisible,
    openActionsModal,
    closeActionsModal,
    openDeleteModal,
    closeDeleteModal,
    openSelectedActionsModal,
    closeSelectedActionsModal,
  } = useMatingEventsModals();

  const { handleAdd, handleDetails, handleMatingAction, confirmDelete, deleting } =
    useMatingEventActions({
      navigation,
      loadAll,
      modals: { openDeleteModal, closeActionsModal, closeDeleteModal },
      eventToDelete,
    });

  const headers = useMemo(
    () => [
      { key: "Pendiente" as PregnancyResult, label: `Pendiente (${counts.pendiente})` },
      { key: "Positivo" as PregnancyResult, label: `Positivos (${counts.positivo})` },
      { key: "Negativo" as PregnancyResult, label: `Negativos (${counts.negativo})` },
    ],
    [counts],
  );

  const [selectedTab, setSelectedTab] = useState<PregnancyResult | null>(null);
  const listData: MatingEvent[] = selectedTab ? eventsByResult[selectedTab] : [];

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll]),
  );

  return (
    <ScreenContainer>
      <View style={styles.mainContainer}>
        {/* Tab row */}
        <View style={styles.tabsRowHeaders}>
          {headers.map((h) => {
            const isSelected = selectedTab === h.key;
            return (
              <Pressable
                key={h.key}
                style={[styles.tabItem, isSelected && styles.tabItemSelected]}
                onPress={() => {
                  setSelectedTab(h.key);
                  deselectAll();
                }}
                disabled={loadingAll}
              >
                <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                  {h.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {loadingAll && !selectedTab ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#2E7D32" />
          </View>
        ) : (
          <FlatList<MatingEvent>
            data={listData}
            keyExtractor={(item) => `${item.mating_id}`}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <MatingEventListItem
                item={item}
                isActive={actionForEvent?.mating_id === item.mating_id && actionsModalVisible}
                selected={selectedEvents.has(item.mating_id)}
                onPress={() => handleDetails(item.mating_id)}
                onToggleSelect={() => toggleSelect(item.mating_id)}
                onOpenActions={() => openActionsModal(item)}
              />
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Sin registros</Text>}
            contentContainerStyle={{ paddingBottom: 90, paddingTop: 8 }}
          />
        )}

        {/* Per-row actions modal */}
        <MatingEventActionsModal
          visible={actionsModalVisible}
          event={actionForEvent}
          onUpdateConfirm={loadAll}
          onEdit={() => actionForEvent && handleMatingAction("edit", actionForEvent)}
          onDetails={() => actionForEvent && handleMatingAction("moreDetails", actionForEvent)}
          onDelete={() => actionForEvent && handleMatingAction("delete", actionForEvent)}
          onClose={closeActionsModal}
        />

        {/* Delete confirmation modal */}
        <ConfirmDeleteModal
          visible={deleteModalVisible && eventToDelete !== null}
          title="Eliminar Inseminación"
          message={
            <Text>
              ¿Seguro que desea eliminar la inseminación tipo{" "}
              <Text style={{ fontWeight: "bold" }}>{eventToDelete?.insemination_type ?? ""}</Text> a
              la cerda{" "}
              <Text style={{ fontWeight: "bold" }}>
                {eventToDelete?.breedingsows?.sow_tag_number ?? ""}
              </Text>
              ?
            </Text>
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />

        {/* Bulk selection modal */}
        <MatingEventSelectedActionsModal
          visible={selectedActionsVisible}
          selectedCount={selectedEvents.size}
          selectedIds={Array.from(selectedEvents)}
          onUpdateConfirm={() => {
            loadAll();
            deselectAll();
          }}
          onClose={closeSelectedActionsModal}
          onDeselect={deselectAll}
        />

        {/* Floating action button — Add or bulk actions */}
        {selectedEvents.size > 0 ? (
          <TouchableOpacity style={styles.fab} onPress={openSelectedActionsModal}>
            <Image
              source={require("../../../../assets/icons/dots.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.fabText}>{`(${selectedEvents.size})   `}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.fab} onPress={handleAdd}>
            <Image
              source={require("../../../../assets/icons/add.png")}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.fabText}>Agregar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenContainer>
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
  tabsRowHeaders: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  tabItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabItemSelected: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  tabText: {
    fontSize: 14,
    color: "#2b2b2b",
    fontWeight: "700",
  },
  tabTextSelected: {
    color: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
  },
  fab: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFA000",
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 2,
  },
});
