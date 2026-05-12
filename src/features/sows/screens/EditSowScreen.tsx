import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { BreedDropdown } from "../../reference-data/breeds/components/BreedDropdown";
import { StatusDropdown } from "../../reference-data/statuses/components/StatusDropdown";
import { updateSow } from "../api/sowsApi";
import SowFormFields, { EDIT_SOW_FIELDS, type SowFormFieldValues } from "../components/SowFormFields";
import SowProfileHeader from "../components/SowProfileHeader";
import SowTagNumberBanner from "../components/SowTagNumberBanner";
import { useSowLoader } from "../hooks/useSowLoader";
import { useSowsModals } from "../hooks/useSowsModals";

type EditRouteProp = RouteProp<RootStackParamList, "EditSow">;

/**
 * Edit screen for an existing sow.
 * Loads sow data via useSowLoader, delegates field rendering to SowFormFields,
 * tag-number editing to SowTagNumberBanner, and uses getApiErrorMessage for
 * consistent error feedback across the app.
 */
export default function EditSow() {
	
	const route = useRoute<EditRouteProp>();
	const { sowId } = route.params;
	const navigation = useNavigation();

	const { sow, setSow, loading, loadSow } = useSowLoader(sowId);
	const { editSowTagVisible, openEditSowTag, closeEditSowTag } = useSowsModals();
	
	// Load sow data once on mount
	useEffect(() => {
		loadSow();
	}, [loadSow]);

	// Validate required fields before submitting
	const validateSow = (): boolean => {
		if (!sow?.sow_tag_number || !sow.entry_date || !sow.breed_id || !sow.mammary_glands || !sow.status_id) {
			Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
			return false;
		}
		return true;
	};

	// Normalise numeric fields that arrive as numbers but may be edited as strings
	const formatForAPI = (s: typeof sow & {}) => ({
		...s,
		weight: s.weight ? parseFloat(s.weight.toString()) : null,
		length: s.length ? parseFloat(s.length.toString()) : null,
		mammary_glands: s.mammary_glands ? parseFloat(s.mammary_glands.toString()) : 0,
		farrowing_number: s.farrowing_number ? parseFloat(s.farrowing_number.toString()) : 0,
	});

	const handleUpdateSow = async () => {
		if (!sow) return;
		try {
			if (!validateSow()) return;
			await updateSow(sowId, formatForAPI(sow));
			Alert.alert("Actualización completada", "La cerda fue actualizada correctamente.");
			navigation.goBack();
		} catch (error) {
			Alert.alert("Error", getApiErrorMessage(error));
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
			const numericKeys = ['mammary_glands', 'weight', 'length', 'farrowing_number'];
			setSow({ ...sow, [key]: numericKeys.includes(key) ? (Number(value) || 0) : value });
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
				<SowProfileHeader
					tagNumber={sow.sow_tag_number}
					onEditTag={openEditSowTag}
				/>

				{/* Inline modal for editing the tag number */}
				<SowTagNumberBanner
					visible={editSowTagVisible}
					value={sow.sow_tag_number}
					onChange={(text) => setSow({ ...sow, sow_tag_number: text })}
					onConfirm={(trimmed) => {
						setSow({ ...sow, sow_tag_number: trimmed });
						closeEditSowTag();
					}}
					onCancel={closeEditSowTag}
				/>

				<StatusDropdown
					value={sow.status_id || null}
					onChange={(newStatusId: number, label: string) => {
						setSow({ ...sow, status_id: newStatusId, status: { status_id: newStatusId, status_name: label } });
					}}
				/>
				<BreedDropdown
					value={sow.breed_id || null}
					onChange={(newBreedId: number, label: string) => {
						setSow({ ...sow, breed_id: newBreedId, breeds: { breed_id: newBreedId, breed_name: label } });
					}}
				/>
				<DatePickerField
					label="Fecha de Ingreso *"
					value={sow.entry_date ? new Date(sow.entry_date) : new Date()}
					onChange={(newDate: Date) => setSow({ ...sow, entry_date: newDate.toISOString() })}
				/>

				{/* Shared form fields for numeric/text sow attributes */}
				<SowFormFields
					values={formValues}
					onChange={handleFormChange}
					fields={EDIT_SOW_FIELDS}
				/>

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
		backgroundColor: "#007AFF",
		borderRadius: 5,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

