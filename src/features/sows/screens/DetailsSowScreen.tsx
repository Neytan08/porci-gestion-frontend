import type { RouteProp } from "@react-navigation/native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import SowInfoTable from "../components/SowInfoTable";
import SowProfileHeader from "../components/SowProfileHeader";
import { useSowLoader } from "../hooks/useSowLoader";
import { buildSowRows } from "../utils/sowDetailsRows";

// Route prop for receiving sowId from navigation
type DetailsRouteProp = RouteProp<RootStackParamList, "DetailsSow">;
// Navigation prop for navigating to EditSow
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "DetailsSow">;

/**
 * Read-only detail screen for a single Sow.
 * Reloads data every time the screen gains focus via useFocusEffect.
 * Delegates data fetching to useSowLoader and rendering to SowProfileHeader and SowInfoTable.
 */
export default function DetailsSowScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const { sowId } = route.params;

  const { sow, loading, error, loadSow } = useSowLoader(sowId);

  const datos = useMemo(() => (sow ? buildSowRows(sow) : []), [sow]);

  // Reload whenever the screen regains focus (e.g. after navigating back from Edit)
  useFocusEffect(
    useCallback(() => {
      loadSow();
    }, [loadSow]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando cerda...</Text>
      </View>
    );
  }

  if (error || !sow) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error ?? "No se pudo cargar la cerda."}</Text>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.scrollContent}>
        {/* Profile header — read-only in Details (no onEditTag) */}
        <View style={styles.imageAndNameContainer}>
          <SowProfileHeader tagNumber={sow.sow_tag_number} />
        </View>
        <SowInfoTable
          rows={datos}
          onEdit={() => navigation.navigate("EditSow", { sowId })}
        />
      </View>

      {/* Navigation buttons */}
      <View style={styles.bottomButtons}>
        {["Historial", "Vacunas", "Eventos", "Editar"].map((title) => (
          <TouchableOpacity key={title} style={styles.button}>
            <Text style={styles.buttonText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flex: 1,
    padding: 5,
  },
  imageAndNameContainer: {
    alignItems: "center",
    margin: 10,
  },
  bottomButtons: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});

