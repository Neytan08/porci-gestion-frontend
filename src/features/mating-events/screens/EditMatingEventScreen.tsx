import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import type { RootStackRouteProp } from "../../../app/navigation/rootStack.types";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { BoarPicker } from "../../boars/components/BoarsPicker";
import { BreedingSowPicker } from "../../sows/components/BreedingSowPicker";
import { updateMatingEvent } from "../api/matingEventApi";
import ReproductionTypePicker from "../components/ReproductionTypeDropdown";
import { REPRODUCTION_TYPES, type ReproductionType } from "../model/matingEvent";
import { useMatingEventLoader } from "../hooks/useMatingEventLoader";
import { buildMatingEventPayload } from "../utils/matingEventTransforms";
import { validateMatingEventRequiredFields } from "../utils/matingEventValidation";

type EditMatingEventRouteProp = RootStackRouteProp<"EditMatingEvent">;

/**
 * Form screen for editing an existing MatingEvent.
 * Pregnancy result is intentionally read-only here —
 * use the UpdatePregnancyResultModal (accessible from MatingEventsScreen) to change it.
 */
export default function EditMatingEventScreen() {
	const navigation = useNavigation();
	const route = useRoute<EditMatingEventRouteProp>();
	const { eventId } = route.params;

	const { event, loading, error, loadEvent } = useMatingEventLoader(eventId);

	const [inseminationDate, setInseminationDate] = useState(new Date());
	const [sowId, setSowId] = useState<number | null>(null);
	const [boarId, setBoarId] = useState<number | null>(null);
	const [reproductionType, setReproductionType] = useState<ReproductionType | undefined>(undefined);
	const [notes, setNotes] = useState("");

	// Pre-fill form once the event data loads
	useEffect(() => {
		if (!event) return;
		setInseminationDate(
			event.reproduction_date ? new Date(event.reproduction_date) : new Date(),
		);
		setSowId(event.sow_id);
		setBoarId(event.boar_id ?? null);
		setReproductionType(event.reproduction_type);
		setNotes(event.notes ?? "");
	}, [event]);

	useFocusEffect(
		useCallback(() => {
			loadEvent();
		}, [loadEvent]),
	);

	const isNatural = reproductionType === REPRODUCTION_TYPES.natural;

	const handleSubmit = async () => {
		if (
			!validateMatingEventRequiredFields({
				sowId,
				inseminationDate,
				reproductionType,
				// Pregnancy result is kept unchanged — not editable in this screen
				pregnancyResult: event?.pregnancy_result,
				boarId,
			})
		) {
			return;
		}
		try {
			const payload = buildMatingEventPayload({
				sow_id: sowId as number,
				boar_id: boarId,
				reproduction_date: inseminationDate.toISOString(),
				reproduction_type: reproductionType,
				// Keep the existing pregnancy result — it is managed through UpdatePregnancyResultModal
				pregnancy_result: event?.pregnancy_result,
				notes,
			});
			await updateMatingEvent(eventId, payload);
			Alert.alert("Éxito", "Evento de inseminación actualizado correctamente.");
			navigation.goBack();
		} catch (err) {
			Alert.alert(
				"Error",
				getApiErrorMessage(err, {
					fallback: "No se pudo actualizar el evento de inseminación.",
				}),
			);
		}
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<Text>Cargando evento...</Text>
			</View>
		);
	}

	if (error || !event) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>{error ?? "No se pudo cargar el evento."}</Text>
			</View>
		);
	}

	return (
		<ScreenContainer>
			<ScrollView style={styles.container}>
				<Text style={styles.title}>Editar Evento de Inseminación</Text>

				<DatePickerField
					label="Fecha de Inseminación *"
					value={inseminationDate}
					onChange={setInseminationDate}
				/>
				<BreedingSowPicker
					label="Identificador Cerda *"
					value={sowId}
					onChange={(value: number | null) => setSowId(value)}
				/>
				<ReproductionTypePicker
					label="Tipo de Inseminación o Monta *"
					value={reproductionType}
					onChange={(val) => {
						setReproductionType(val);
						if (val !== REPRODUCTION_TYPES.natural) setBoarId(null);
					}}
				/>
				{isNatural && (
					<BoarPicker
						label="Identificador Verraco *"
						value={boarId}
						onChange={(value: number | null) => setBoarId(value)}
					/>
				)}

				{/* Pregnancy result is read-only — change it from the list screen using the update modal */}
				<Text style={styles.label}>Resultado de embarazo</Text>
				<View style={styles.readonlyField}>
					<Text style={styles.readonlyText}>
						{event.pregnancy_result ?? "-"}
					</Text>
					<Text style={styles.readonlyHint}>
						Para modificar este campo use la opción "Cambiar estado" en la lista.
					</Text>
				</View>

				<Text style={styles.label}>Notas</Text>
				<TextInput
					style={[styles.input, { height: 100, textAlignVertical: "top" }]}
					value={notes}
					onChangeText={setNotes}
					multiline
				/>
				<Pressable
					style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
					onPress={handleSubmit}
				>
					<Text style={styles.buttonText}>Guardar Cambios</Text>
				</Pressable>
			</ScrollView>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#F9FAFB",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		color: "red",
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 20,
	},
	label: {
		fontSize: 15,
	},
	input: {
		borderWidth: 1,
		borderColor: "#37474F",
		borderRadius: 10,
		padding: 10,
		marginBottom: 15,
	},
	readonlyField: {
		borderWidth: 1,
		borderColor: "#d0d7de",
		borderRadius: 10,
		padding: 10,
		marginBottom: 15,
		backgroundColor: "#f5f5f5",
	},
	readonlyText: {
		fontSize: 15,
		color: "#263238",
	},
	readonlyHint: {
		fontSize: 12,
		color: "#888",
		marginTop: 4,
	},
	button: {
		backgroundColor: "#FFA000",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});

