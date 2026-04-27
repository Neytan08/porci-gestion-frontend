import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { createMatingEvent } from "../api/matingEventApi";
import { BoarPicker } from "../../boars/components/BoarsPicker";
import { BreedingSowPicker } from "../../sows/components/BreedingSowPicker";
import DatePickerField from "../../../shared/components/selection/datePicker";
import InseminationTypePicker, {
	type InseminationType,
} from "../components/InseminationTypeDropdown";
import PregnancyResultPicker, {
	type PregnancyResult,
} from "../components/PregnancyResultDropdown";
import ScreenContainer from "../../../shared/components/layout/screenContainer";

export default function AddMatingEventScreen() {
	const navigation = useNavigation();
	const [inseminationDate, setInseminationDate] = useState(new Date()); // Change this to use the date picker
	const [sowId, setSowId] = useState<number | null>(null); // Sow call
	const [boarId, setBoarId] = useState<number | null>(null); // Boar call
	const [form, setForm] = useState<{
		// In case of need to add more fields, extend this form state (needs to match the API)
		sow_id: string;
		boar_id: string;
		insemination_date: string;
		insemination_type?: InseminationType;
		pregnancy_result?: PregnancyResult;
		notes: string;
	}>({
		sow_id: "",
		boar_id: "",
		insemination_date: "",
		insemination_type: undefined,
		pregnancy_result: undefined,
		notes: "",
	});
	const isNatural = form.insemination_type === "Monta Natural";

	const handleSubmit = async () => {
		try {
			const finalData = {
				//Joining the data
				...form,
				insemination_date: inseminationDate.toISOString(),
				sow_id: Number(sowId),
			};
			// Validate required fields
			if (
				!finalData.sow_id ||
				!finalData.insemination_date ||
				!finalData.insemination_type ||
				!finalData.pregnancy_result
			) {
				Alert.alert(
					"Error",
					"Por favor, complete todos los campos obligatorios.",
				);
				return;
			}
			if (isNatural && !boarId) {
				Alert.alert(
					"Error",
					"Debe seleccionar un verraco para 'Monta Natural'.",
				);
				return;
			}
			const payload = {
				...finalData,
				boar_id: isNatural ? Number(boarId) : undefined, // solo enviar si aplica
				insemination_type: form.insemination_type,
				pregnancy_result: form.pregnancy_result,
				notes: form.notes || undefined,
			};
			await createMatingEvent(payload);
			Alert.alert("Éxito", "Evento de inseminación creado con éxito");
			navigation.goBack();
		} catch (error) {
			console.error("Error al agregar evento de inseminación:", error);
			Alert.alert("Error", "No se pudo crear el evento de inseminación");
		}
	};
	return (
		<ScreenContainer>
			<ScrollView style={styles.container}>
				<Text style={styles.title}>Agregar Evento de Inseminación o Monta</Text>
				<DatePickerField
					label="Fecha de Inseminación*"
					value={inseminationDate}
					onChange={setInseminationDate}
				/>
				<BreedingSowPicker
					label="Identificador Cerda*"
					value={sowId}
					onChange={(value: number | null) => setSowId(value)}
				/>
				<InseminationTypePicker
					label="Tipo de Inseminación o Monta*"
					value={form.insemination_type}
					onChange={(val) => {
						setForm({ ...form, insemination_type: val });
						if (val !== "Monta Natural") {
							setBoarId(null); // limpia si cambia a Artificial
						}
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
					label="Resultado*"
					value={form.pregnancy_result}
					onChange={(val) => setForm({ ...form, pregnancy_result: val })}
				/>
				<Text style={styles.label}>Notas</Text>
				<TextInput
					style={[styles.input, { height: 100, textAlignVertical: "top" }]}
					value={form.notes}
					onChangeText={(text) => setForm({ ...form, notes: text })}
					multiline
				/>
				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Guardar</Text>
				</TouchableOpacity>
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
		// borderColor: "#ccc",
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

