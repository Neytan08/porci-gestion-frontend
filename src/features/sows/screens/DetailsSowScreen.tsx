import type { RouteProp } from "@react-navigation/native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import EditAction from "../../../shared/components/actions/editAction";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import SowInfoTable from "../components/SowInfoTable";
import SowProfileHeader from "../components/SowProfileHeader";
import { useSowLoader } from "../hooks/useSowLoader";

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

  const datos = [
    { label: "Estado", value: sow.status?.status_name ?? "Sin estado" },
    { label: "Raza", value: sow.breeds?.breed_name?.trim() ?? "Sin raza" },
    { label: "Fecha de entrada", value: sow.entry_date.split("T")[0] },
    { label: "Cantidad de pezones", value: sow.mammary_glands ?? "-" },
    { label: "Peso(cm)", value: sow.weight ?? "-" },
    { label: "Largo(cm)", value: sow.length ?? "-" },
    { label: "Cantidad de partos", value: sow.farrowing_number ?? "-" },
    { label: "Descripción", value: sow.description?.trim() || "-" },
  ];

  return (
    <ScreenContainer>
      <View style={styles.scrollContent}>
        {/* Profile header — read-only in Details (no onEditTag) */}
        <View style={styles.imageAndNameContainer}>
          <SowProfileHeader tagNumber={sow.sow_tag_number} />
        </View>

        {/* Data table with edit shortcut in the header */}
        <Pressable
          style={({ pressed }) => [
            styles.editDetails,
            pressed && { backgroundColor: "#e0e0e0", opacity: 0.6 },
          ]}
        >
          <View style={styles.detailsView}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
              Detalles de la cerda
            </Text>
            <EditAction
              onPress={() => navigation.navigate("EditSow", { sowId })}
              size={24}
              color="#fff"
            />
          </View>
          <SowInfoTable datos={datos} />
        </Pressable>
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
    margin: 20,
  },
  editDetails: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  detailsView:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    padding: 8,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
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

