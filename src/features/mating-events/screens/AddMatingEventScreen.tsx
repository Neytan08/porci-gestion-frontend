import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert,	Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { createMatingEvent } from "../api/matingEventApi";
import { BoarPicker } from "../../boars/components/BoarsPicker";
import { BreedingSowPicker } from "../../sows/components/BreedingSowPicker";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { localDateToUtcMidnight } from "../../../shared/utils/dateHelpers";
import InseminationTypePicker from "../components/InseminationTypeDropdown";
import PregnancyResultPicker from "../components/PregnancyResultDropdown";
import type { PregnancyResult, InseminationType } from "../model/matingEvent";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import { buildMatingEventPayload } from "../utils/matingEventTransforms";
import { validateMatingEventRequiredFields } from "../utils/matingEventValidation";

export default function AddMatingEventScreen() {
	const navigation = useNavigation();
	const [inseminationDate, setInseminationDate] = useState(localDateToUtcMidnight(new Date()));
	const [sowId, setSowId] = useState<number | null>(null);
	const [boarId, setBoarId] = useState<number | null>(null);
	const [inseminationType, setInseminationType] = useState<InseminationType | undefined>(undefined);
	const [pregnancyResult, setPregnancyResult] = useState<PregnancyResult | undefined>("Pendiente");
	const [notes, setNotes] = useState("");

	const isNatural = inseminationType === "Monta Natural";

	const handleSubmit = async () => {
		if (
			!validateMatingEventRequiredFields({
				sowId,
				inseminationDate,
				inseminationType,
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
				insemination_date: inseminationDate.toISOString(),
				insemination_type: inseminationType,
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
				<Text style={styles.title}>Agregar Evento de Inseminación o Monta</Text>
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
				<InseminationTypePicker
					label="Tipo de Inseminación o Monta *"
					value={inseminationType}
					onChange={(val) => {
						setInseminationType(val);
						if (val !== "Monta Natural") setBoarId(null);
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

