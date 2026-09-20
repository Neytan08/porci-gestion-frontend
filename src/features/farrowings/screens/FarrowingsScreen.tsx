import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import type { RootStackScreenProps } from "../../../app/navigation/rootStack.types";
import AddAction from "../../../shared/components/actions/addAction";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import { getAllFarrowingsBySow, type Farrowing } from "../api/farrowingsApi";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { useLoadingAction } from "../../../shared/hooks/useLoadingAction";
import { useRefreshingAction } from "../../../shared/hooks/useRefreshingAction";
import { getSowById, type Sow } from "../../sows/api/sowsApi";
import FarrowingCard from "../components/FarrowingCard";
import WeanFarrowingModal from "../components/WeanFarrowingModal";

type FarrowingsScreenProps = RootStackScreenProps<"Farrowings">;

const getDateTime = (value: string) => {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

export default function FarrowingsScreen({ route, navigation }: FarrowingsScreenProps) {
  const { sowId } = route.params;
  const [sow, setSow] = useState<Sow | null>(null);
  const [farrowings, setFarrowings] = useState<Farrowing[]>([]);
  const [selectedFarrowing, setSelectedFarrowing] = useState<Farrowing | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchScreenData = useCallback(async () => {
    try {
      setError(null);
      const [sowData, farrowingsResponse] = await Promise.all([
        getSowById(sowId),
        getAllFarrowingsBySow(sowId),
      ]);
      setSow(sowData);
      setFarrowings(farrowingsResponse.farrowings ?? []);
    } catch (err) {
      setError(
        getApiErrorMessage(err, {
          fallback: "No se pudieron cargar los nacimientos.",
        }),
      );
      setFarrowings([]);
    }
  }, [sowId]);

  const { loading, runWithLoading: loadScreenData } = useLoadingAction(fetchScreenData, {
    initialLoading: true,
  });
  const { refreshing, onRefresh } = useRefreshingAction(fetchScreenData, {
    disabled: loading,
  });

  /**
   * Sorts the farrowings by date in descending order (most recent first).
   * This ensures that the most recent farrowings are displayed at the top of the list.
   * The sorting is done in a useMemo hook to avoid unnecessary re-sorting on every render.
   */
  const sortedFarrowings = useMemo(
    () =>
      [...farrowings].sort(
        (left, right) => getDateTime(right.farrowing_date) - getDateTime(left.farrowing_date),
      ),
    [farrowings],
  );

  const sowLabel = sow?.sow_tag_number ?? `${sowId}`;

  /**
   * Sets the screen title to include the sow's tag number or ID.
   * UseLayoutEffect ensures the title is updated before the screen is rendered.
   */
//   useLayoutEffect(() => {
//     navigation.setOptions({ title: `Partos ${sowLabel}` });
//   }, [navigation, sowLabel]);

  useFocusEffect(
    useCallback(() => {
      loadScreenData();
    }, [loadScreenData]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Cargando partos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.mainContainer}>
        <FlatList<Farrowing>
          data={sortedFarrowings}
          keyExtractor={(item) => `${item.farrowing_id}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Cerda {sowLabel}</Text>
              <Text style={styles.headerSubtitle}>
                {sortedFarrowings.length} parto
                {sortedFarrowings.length === 1 ? "" : "s"}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <FarrowingCard
              item={item}
              onWean={() => setSelectedFarrowing(item)}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay partos registrados.</Text>}
          contentContainerStyle={styles.listContent}
        />

        <AddAction
          size={55}
          color="#2E7D32"
          containerStyle={styles.fab}
          pressedStyle={styles.fabPressed}
          onPress={() => navigation.navigate("AddFarrowing", { sowId })}
          accessibilityLabel="Agregar parto"
        />

        {selectedFarrowing && (
          <WeanFarrowingModal
            visible
            farrowingId={selectedFarrowing.farrowing_id}
            onClose={() => setSelectedFarrowing(null)}
            onConfirm={async () => {
              await fetchScreenData();
              setSelectedFarrowing(null);
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  header: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
  },
  headerTitle: {
    color: "#2E7D32",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#555",
    fontSize: 14,
    marginTop: 2,
  },
  emptyText: {
    color: "#666",
    marginTop: 24,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 90,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  fabPressed: {
    opacity: 0.3,
    transform: [{ scale: 0.98 }],
  },
});
