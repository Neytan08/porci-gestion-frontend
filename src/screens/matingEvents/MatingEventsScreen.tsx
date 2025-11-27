import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, FlatList, TouchableOpacity, TouchableWithoutFeedback, Pressable, ActivityIndicator, StyleSheet, RefreshControl, Modal, Alert, Image, TextInput, Text } from "react-native";
import { useNavigation,  useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { getAllGroupedByPregnancyResult, MatingEvent, deleteMatingEvent } from "../../api/matingEventApi";
import DeleteAction from "../../components/uiControls/DeleteAction";
import RowCheckbox from "../../components/uiControls/RowCheckbox";
import EditAction from "../../components/uiControls/EditAction";
import DetailsAction from "../../components/uiControls/DetailsAction";
import ListAction from "../../components/uiControls/ListAction";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MatingEvents'>;
//TODO: This needs to be changed, needs to have a different handle 
type PregnancyResult = "Pendiente" | "Positivo" | "Negativo";

export default function MattingEventsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [counts, setCounts] = useState<{ pendiente: number; positivo: number; negativo: number }>({
    pendiente: 0, positivo: 0, negativo: 0,
  });
  const [selectedTab, setSelectedTab] = useState<PregnancyResult | null>(null);
  const [eventsByResult, setEventsByResult] = useState<Record<PregnancyResult, MatingEvent[]>>({
    Pendiente: [],
    Positivo: [],
    Negativo: [],
  });
  const [loadingAll, setLoadingAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionForEvent, setActionForEvent] = useState<MatingEvent | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [matingToDelete, setMatingToDelete] = useState<{ event: MatingEvent } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectedActionsVisible, setSelectedActionsVisible] = useState(false);

  // Navigate to AddMatingEvent screen
  const handleAddPress = () => {
    navigation.navigate("AddMatingEvent" as never);
  };
  // Select one sow and clear the previous selection
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Redirect to edit or delete based on action 
  const handleSelectedSowAction = useCallback((action: "edit" | "delete" | "moreDetails", event: MatingEvent) => {
    // if (action === "edit") navigation.navigate("EditMatingEvent", { matingEventId: event.mating_id });
    if (action === "edit") {Alert.alert('Need to implement', 'Edit boar functionality is not implemented yet.')};
    if (action === "moreDetails") {Alert.alert('Need to implement', 'More details functionality is not implemented yet.')};
    if (action === "delete") {
      setDeleteModalVisible(true);
      setMatingToDelete({ event });
    }
  }, []);
  
  // Carga inicial: trae listas por resultado y calcula conteos por length
  const loadAll = useCallback(async () => {
    setLoadingAll(true);
    try {
      const groups = await getAllGroupedByPregnancyResult();

      // Normalize to steady buckets
      const map: Record<PregnancyResult, MatingEvent[]> = {
        Pendiente: [],
        Positivo: [],
        Negativo: [],
      };

      for (const g of groups) {
        const key = g.pregnancy_result as PregnancyResult | null;
        if (key && key in map) {
          map[key] = Array.isArray(g.events) ? g.events : [];
        }
      }
      setEventsByResult(map);
      setCounts({
        pendiente: map.Pendiente.length,
        positivo: map.Positivo.length,
        negativo: map.Negativo.length,
      });
    } catch (e) {
      setEventsByResult({ Pendiente: [], Positivo: [], Negativo: [] });
      setCounts({ pendiente: 0, positivo: 0, negativo: 0 });
    } finally {
      setLoadingAll(false);
    }
  }, []);

  // Handle deleting sows by using the custom hook
  const { deleting, deleteById } = useDeleteEntity<number>({
    deleteFn: deleteMatingEvent,
    onDeleted: loadAll,
    messages: {
      successTitle: 'Eliminación completada',
      successMessage: 'El evento de apareamiento fue eliminado correctamente.',
      errorTitle: 'Error',
      errorMessage: 'No se pudo eliminar el evento de apareamiento. Intente nuevamente.',
    }
  });

  // Confirm a mating event was selected before delete it (using shared hook)
  const deleteMatingEventHandler = async () => {
    if (!matingToDelete) return;
    setDeleteModalVisible(false);
    await deleteById(matingToDelete.event.mating_id);
    setMatingToDelete(null);
  };

  useEffect(() => {
    // Al entrar: carga data para conteos; la lista queda vacía hasta que el usuario seleccione un header.
    loadAll();
  }, [loadAll]);

  // Reload the screen when coming back to it
  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadAll();
    } finally {
      setRefreshing(false);
    }
  }, [loadAll]);

  const headers = useMemo(() => ([
    { key: "Pendiente" as const, label: `Pendiente (${counts.pendiente})` },
    { key: "Positivo" as const, label: `Positivos (${counts.positivo})` },
    { key: "Negativo" as const, label: `Negativos (${counts.negativo})` },
  ]), [counts]
  );

  const listData = selectedTab ? eventsByResult[selectedTab] : [];
  return (
    <View style={styles.mainContainer}>
      <View style={styles.tabsRow}>
        {/* Tab buttons by headers */}
        {headers.map(h => {
          const isSelected = selectedTab === h.key;
          return (
            <Pressable
              key={h.key}
              style={[styles.tabItem, isSelected && styles.tabItemSelected]}
              onPress={() => setSelectedTab(h.key)}
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
          renderItem={({ item }) => {
            // compute active state for styling when the modal is open for this item
            const isActive = actionForEvent?.mating_id === item.mating_id && actionModalVisible;

            // Make this pressable and show the actions on press add see them in a column below
            return (
              <Pressable
                onPress={() => {
                }}
                // style={{ borderWidth: 1 }}
              >
                {/* Row Content */}
                <View style={[styles.row, isActive && styles.rowActive]}>
                  <RowCheckbox
                    selected={selectedIds.has(item.mating_id)}
                    onPress={() => toggleSelect(item.mating_id)}
                    size={18}
                    radius={4}
                    width={1}
                    color={"#eee"}
                    style={styles.checkBox}
                  />
                  <Text style={[styles.cell, { flex: 0.9 }]}>Cerda: {item.breedingsows?.sow_tag_number ?? item.sow_id}</Text>
                  <Text style={[styles.cell, { flex: 0.8 }]}>
                    Fecha: {item.insemination_date ? item.insemination_date.split("T")[0] : "-"}
                  </Text>
                  <Text style={[styles.cell, { width: '101%', marginBlock: 8 }]}>
                    Notas: {item.notes ?? "-"}
                  </Text>          
                  <View style={styles.detailsButton}>
                    {/* Details Action: toggle a small view under the detailsButton for this item */}
                    <ListAction  onPress={() => { setActionForEvent(item); setActionModalVisible(true); }} />
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 24, color: "#666" }}>
              Sin registros
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 90, paddingTop: 8 }}
        />
      )}
      {/* Modal for actions */}
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => { setActionModalVisible(false); setActionForEvent(null); }} // Android back button
      >
        <View style={styles.modalContainer}>
          {/* Overlay que captura toques fuera del panel y cierra */}
          <Pressable style={styles.modalOverlay} onPress={() => { setActionModalVisible(false); setActionForEvent(null); }} />
          {/* Contenedor del panel con botones (no tocará el overlay) */}
          <View style={styles.modalPanel}>
            <Text style={{ fontWeight: '700', marginBottom: 8 }}>
              Acciones Disponibles
              {/* para: {actionForEvent?.breedingsows?.sow_tag_number ?? actionForEvent?.sow_id} */}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <EditAction onPress={() => { setActionModalVisible(false); /* luego navega/edit */ handleSelectedSowAction('edit', actionForEvent!); }} />
              <DetailsAction onPress={() => { setActionModalVisible(false); handleSelectedSowAction('moreDetails', actionForEvent!); }} />
              <DeleteAction onPress={() => { setActionModalVisible(false); handleSelectedSowAction('delete', actionForEvent!); }} />
            </View>
          </View>
        </View>
      </Modal>
      {/* Selected or Add button depending on selection */}
      {selectedIds.size > 0 ? (
        <TouchableOpacity style={styles.addMatingButton} onPress={() => setSelectedActionsVisible(true)}>
        <Image
          source={require("../../../assets/icons/dots.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.addSowText}>{`(${selectedIds.size})   `}</Text>
        </TouchableOpacity>
        ):(
        // Floating Add Button 
        <TouchableOpacity style={styles.addMatingButton} onPress={handleAddPress}>
          <Image
            source={require("../../../assets/icons/add.png")}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.addSowText}>Agregar</Text>
        </TouchableOpacity>
      )}
      {/* Deleting Pop up */}
      <ConfirmDeleteModal
        visible={deleteModalVisible && matingToDelete !== null}
        title="Eliminar Inseminación"
        message={(
          <Text>
            ¿Seguro que desea eliminar la inseminación tipo <Text style={{ fontWeight: 'bold' }}>{matingToDelete?.event.insemination_type ?? ''}</Text>
            a la cerda <Text style={{ fontWeight: 'bold' }}>{matingToDelete?.event.breedingsows?.sow_tag_number ?? ''}</Text>?
          </Text>
        )}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        onConfirm={deleteMatingEventHandler}
        onCancel={() => { setDeleteModalVisible(false); setMatingToDelete(null); }}
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
            <Text style={styles.filterOverlayTitle}>{`Inseminaciones Seleccionadas (${selectedIds.size})`}</Text>
            <View style={styles.filterBtnRow}>
              <Pressable
                style={styles.filterBtn}
                onPress={() => Alert.alert('Funcion no implementada')}
              >
                <Image
                  source={require("../../../assets/icons/change-status.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "700", marginLeft: 8 }}>Cambiar estado de inseminación</Text>
              </Pressable>
              <Pressable
                style={styles.filterBtn}
                onPress={() => Alert.alert('Funcion no implementada')}
              >
                <Image
                  source={require("../../../assets/icons/pdf-file.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "700", marginLeft: 8 }}>Extraer a PDF</Text>
              </Pressable>
              <Pressable
                style={styles.filterBtn}
                onPress={() => [setSelectedIds(new Set()), setSelectedActionsVisible(false)]}
              >
                <Image
                  source={require("../../../assets/icons/uncheck.png")}
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={{ fontWeight: "700", marginLeft: 8 }}>Limpiar selección</Text>
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
    zIndex: 150,
  },
  //
  tabsRow: {
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // width: "96%", // Ancho del contenedor para observar el efecto
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 8,
    borderWidth: 1,
    // zIndex: 500,
    borderColor: "#eee",
  },
  rowActive: {
    backgroundColor: '#e2e2e2',
  },
  cell: { color: "#333" },
  checkBox: {
    // justifyContent: "center",
    // alignItems: "center",
    position: 'absolute',
    left: -4,
    top: -3,
    // borderTopLeftRadius: 8,
    // borderColor: "#eee",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  detailsButton: {
    width: '101%', // So the wrapper takes full width
    // height: 40,
    // borderWidth: 1,
    // position: 'absolute',
    // right: 10,
    // bottom: 10,
    // top: 10,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    // minWidth: 40,           // tamaño mínimo del área visible
    minHeight: 40,
    // width: '100%',
    marginTop: -20,
    marginBottom: -5,
    marginRight: -20,
    // paddingRight: 4,             // espacio interno que aumenta el área clicable visualmente
    // borderRadius: 8,       // redondeo para apariencia de botón
    // flexShrink: 0,
    // backgroundColor: 'transparent', // fondo para que la sombra sea visible
    // sombra iOS
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // sombra Android
    // elevation: 6,
    // zIndex: 20,
    // overflow: 'visible',    // permitir que la sombra se vea
  },
  // Floating Add Button
  addMatingButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFA000", // color naranja similar al ejemplo
    // width: 140,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // o 'flex-end' si quieres que aparezca abajo
    alignItems: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)', // ligero sombreado opcional
  },
  modalPanel: {
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
  // Buttons
  filterBtnRow: {
    flexDirection: "column",
    // justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  filterBtn: {
    flexDirection: "row",
    minHeight: 40,
    paddingVertical: 10,
    borderRadius: 10,
    borderTopWidth: 1,
    alignItems: "center",
  },
});