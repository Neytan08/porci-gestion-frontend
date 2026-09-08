import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { BreedDropdown } from "../../reference-data/breeds/components/BreedDropdown";
import { checkSowTagNumberExists, updateSow, validateSowStatusChange } from "../api/sowsApi";
import EditSowTagModal from "../components/EditSowTagModal";
import { StatusDropdown } from "../components/StatusDropdown";
import SowFormFields, { type SowFormFieldValues } from "../components/SowFormFields";
import SowProfileHeader from "../components/SowProfileHeader";
import { useSowLoader } from "../hooks/useSowLoader";
import { useSowsModals } from "../hooks/useSowsModals";
import { BREEDING_SOW_STATUSES, type SelectableBreedingSowStatus } from "../model/sow";
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
  const [validatingStatusChange, setValidatingStatusChange] = useState(false);
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

  // Validates manual status changes before mutating the form state.
  const handleStatusChange = useCallback(async (candidateStatus: SelectableBreedingSowStatus) => {
    if (!sow || validatingStatusChange || candidateStatus === sow.status) return;
    setValidatingStatusChange(true);
    try {
      await validateSowStatusChange(sowId, candidateStatus);

      setSow((currentSow) =>
        currentSow
          ? {
            ...currentSow,
            status: candidateStatus,
          }
          : currentSow,
      );
    } catch (error) {
      Alert.alert(
        "Error",
        getApiErrorMessage(error, {
          fallback: "No se pudo validar el cambio de estado. Intente nuevamente.",
        }),
      );
    } finally {
      setValidatingStatusChange(false);
    }
  },
    [sow, sowId, setSow, validatingStatusChange],
  );

  const handleUpdateSow = async () => {
    if (!sow || validatingStatusChange) return;
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

  const statusDropdownValue: SelectableBreedingSowStatus | null =
    sow.status === BREEDING_SOW_STATUSES.retirada ? null : sow.status;

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
          value={statusDropdownValue}
          disabled={validatingStatusChange}
          onChange={(newStatus) => {
            handleStatusChange(newStatus);
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
          disabled={validatingStatusChange}
          style={({ pressed }) => [
            styles.button,
            validatingStatusChange && styles.disabledButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleUpdateSow}
        >
          <Text style={styles.buttonText}>Actualizar</Text>
        </Pressable>
      </ScrollView>

      {/* Validation overlay for status changes */}
      <Modal visible={validatingStatusChange} transparent animationType="fade">
        <View style={styles.validationOverlay}>
          <View style={styles.validationModal}>
            <ActivityIndicator size="small" color="#2E7D32" />
            <Text style={styles.validationText}>Validando cambio de estado...</Text>
          </View>
        </View>
      </Modal>
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
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  validationOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 24,
  },
  validationModal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  validationText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },
});
