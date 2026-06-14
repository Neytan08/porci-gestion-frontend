import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { BreedDropdown } from "../../reference-data/breeds/components/BreedDropdown";
import { checkSowTagNumberExists, updateSow } from "../api/sowsApi";
import EditSowTagModal from "../components/EditSowTagModal";
import { StatusDropdown } from "../components/StatusDropdown";
import SowFormFields, { type SowFormFieldValues } from "../components/SowFormFields";
import SowProfileHeader from "../components/SowProfileHeader";
import { useSowLoader } from "../hooks/useSowLoader";
import { useSowsModals } from "../hooks/useSowsModals";
import { buildSowApiPayload } from "../utils/sowTransforms";
import { validateSowRequiredFields, validateSowTagNumberFormat } from "../utils/sowValidation";

type EditRouteProp = RouteProp<RootStackParamList, "EditSow">;

// Keys from SowFormFieldValues that represent numeric inputs
const NUMERIC_SOW_KEYS: ReadonlyArray<keyof SowFormFieldValues> = [
  "mammary_glands",
  "weight",
  "length",
  "farrowing_number",
] as const;

/**
 * Edit screen for an existing sow.
 * Loads sow data via useSowLoader, delegates field rendering to SowFormFields,
 * tag-number editing to EditSowTagModal, and uses getApiErrorMessage for
 * consistent error feedback across the app.
 */
export default function EditSow() {
  const navigation = useNavigation();
  const route = useRoute<EditRouteProp>();
  const { sowId } = route.params;
  const { sow, setSow, loading, loadSow } = useSowLoader(sowId);
  const { editSowTagVisible, openEditSowTag, closeEditSowTag } = useSowsModals();
  // Stores the tag number that came from the server so we can skip the
  // duplicate check when the user saves without changing it.
  const originalTagRef = useRef<string | null>(null);

  // Load sow data once on mount
  useEffect(() => {
    loadSow();
  }, [loadSow]);

  // Capture the original tag the first time sow data arrives.
  useEffect(() => {
    if (sow && originalTagRef.current === null) {
      originalTagRef.current = sow.sow_tag_number;
    }
  }, [sow]);

  const handleUpdateSow = async () => {
    if (!sow) return;
    if (
      !validateSowRequiredFields({
        tagNumber: sow.sow_tag_number,
        status: sow.status,
        breedId: sow.breed_id,
        mammaryGlands: sow.mammary_glands,
        entryDate: sow.entry_date,
      })
    )
      return;
    if (!validateSowTagNumberFormat(sow.sow_tag_number)) return;
    try {
      // Only check for duplicates if the tag number was changed.
      const tagChanged = sow.sow_tag_number !== originalTagRef.current;
      if (tagChanged) {
        const isDuplicate = await checkSowTagNumberExists(sow.sow_tag_number);
        if (isDuplicate) {
          Alert.alert("Error", "Ya existe un registro con este identificador. Por favor, use un identificador único.");
          return;
        }
      }
      await updateSow(sowId, buildSowApiPayload(sow));
      Alert.alert("Actualización completada", "La cerda fue actualizada correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", getApiErrorMessage(error, { fallback: "No se pudo actualizar la cerda." }));
    }
  };

  // Convert numeric sow fields to strings for SowFormFields (controlled string inputs)
  const formValues: SowFormFieldValues = {
    mammary_glands: sow?.mammary_glands?.toString() ?? "",
    weight: sow?.weight?.toString() ?? "",
    length: sow?.length?.toString() ?? "",
    farrowing_number: sow?.farrowing_number?.toString() ?? "",
    description: sow?.description ?? "",
  };

  // Convert string values back to appropriate types on each field change
  const handleFormChange = useCallback(
    (key: keyof SowFormFieldValues, value: string) => {
      if (!sow) return;
      const numericKeys = NUMERIC_SOW_KEYS;
    //   setSow({ ...sow, [key]: numericKeys.includes(key) ? Number(value) || 0 : value });
		setSow({ ...sow, [key]: numericKeys.includes(key) ? (value === '' ? null : parseFloat(value)) : value });
    },
    [sow, setSow],
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando cerda...</Text>
      </View>
    );
  }

  if (!sow) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>No se pudo cargar la cerda.</Text>
        <Pressable onPress={loadSow}>
          <Text style={{ color: "blue" }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView style={styles.mainContainer}>
        {/* Editable profile header — tap the name to open the rename modal */}
        <SowProfileHeader tagNumber={sow.sow_tag_number} onEditTag={openEditSowTag} />

        {/* Modal for editing the sow tag number */}
        <EditSowTagModal
          visible={editSowTagVisible}
          initialValue={sow.sow_tag_number}
          onConfirm={(trimmed) => {
            setSow({ ...sow, sow_tag_number: trimmed });
            closeEditSowTag();
          }}
          onCancel={closeEditSowTag}
        />

        <StatusDropdown
          value={sow.status ?? null}
          onChange={(newStatus) => {
            setSow({
              ...sow,
              status: newStatus,
            });
          }}
        />
        <BreedDropdown
          value={sow.breed_id || null}
          onChange={(newBreedId: number, label: string) => {
            setSow({
              ...sow,
              breed_id: newBreedId,
              breed: { breed_id: newBreedId, breed_name: label },
            });
          }}
        />
        <DatePickerField
          label="Fecha de Ingreso *"
          value={sow.entry_date ? new Date(sow.entry_date) : new Date()}
          onChange={(newDate: Date) => setSow({ ...sow, entry_date: newDate.toISOString() })}
        />

        {/* Shared form fields for numeric/text sow attributes */}
        <SowFormFields values={formValues} onChange={handleFormChange} />

        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          onPress={handleUpdateSow}
        >
          <Text style={styles.buttonText}>Actualizar</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: "#FFA000",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
