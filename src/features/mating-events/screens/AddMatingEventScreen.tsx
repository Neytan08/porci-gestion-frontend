import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import type { RootStackScreenProps } from "../../../app/navigation/rootStack.types";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { localDateToUtcMidnight } from "../../../shared/utils/dateHelpers";
import { BoarPicker } from "../../boars/components/BoarsPicker";
import { BreedingSowPicker } from "../../sows/components/BreedingSowPicker";
import { createMatingEvent } from "../api/matingEventApi";
import PregnancyResultPicker from "../components/PregnancyResultDropdown";
import ReproductionTypePicker from "../components/ReproductionTypeDropdown";
import { PREGNANCY_RESULTS,	REPRODUCTION_TYPES,	type PregnancyResult, type ReproductionType } from "../model/matingEvent";
import { buildMatingEventPayload } from "../utils/matingEventTransforms";
import { validateMatingEventRequiredFields } from "../utils/matingEventValidation";

type AddMatingEventScreenProps = RootStackScreenProps<"AddMatingEvent">;

export default function AddMatingEventScreen({ route, navigation }: AddMatingEventScreenProps) {
	// DetailsSowScreen may pass an eligible sowId so this shared form opens with that sow already selected.
	const preselectedSowId = route.params?.sowId ?? null;
	const [inseminationDate, setInseminationDate] = useState(localDateToUtcMidnight(new Date()));
	const [sowId, setSowId] = useState<number | null>(preselectedSowId);
	const [boarId, setBoarId] = useState<number | null>(null);
	const [reproductionType, setReproductionType] = useState<ReproductionType | undefined>(undefined);
	const [pregnancyResult, setPregnancyResult] = useState<PregnancyResult | undefined>(
		PREGNANCY_RESULTS.pendiente,
	);
	const [notes, setNotes] = useState("");

	const isNatural = reproductionType === REPRODUCTION_TYPES.natural;

	const handleSubmit = async () => {
		if (
			!validateMatingEventRequiredFields({
				sowId,
				inseminationDate,
				reproductionType,
				pregnancyResult,
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
				pregnancy_result: pregnancyResult,
				notes,
			});
			await createMatingEvent(payload);
			Alert.alert("Éxito", "Evento de inseminación creado con éxito.");
			navigation.goBack();
		} catch (error) {
			Alert.alert(
				"Error",
				getApiErrorMessage(error, { fallback: "No se pudo crear el evento de inseminación." }),
			);
		}
	};

	return (
		<ScreenContainer>
			<ScrollView style={styles.container}>
				<Text style={styles.title}>Agregar Evento de Reproducción</Text>
				<DatePickerField
					label="Fecha de Reproducción *"
					value={inseminationDate}
					onChange={setInseminationDate}
				/>
				<BreedingSowPicker
					label="Identificador Cerda *"
					value={sowId}
					onChange={(value: number | null) => setSowId(value)}
				/>
				<ReproductionTypePicker
					label="Tipo de Reproducción *"
					value={reproductionType}
					onChange={(val) => {
						setReproductionType(val);
						if (val !== REPRODUCTION_TYPES.natural) setBoarId(null);
					}}
				/>
				{isNatural && (
					<BoarPicker
						label="Identificador Verraco*"
						value={boarId}
						onChange={(value: number | null) => setBoarId(value)}
					/>
				)}

				<PregnancyResultPicker
					label="Resultado *"
					value={pregnancyResult}
					onChange={setPregnancyResult}
				/>
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
					<Text style={styles.buttonText}>Guardar</Text>
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
