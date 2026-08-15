import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { RootStackScreenProps } from "../../../app/navigation/rootStack.types";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import DatePickerField from "../../../shared/components/selection/datePicker";
import { useLoadingAction } from "../../../shared/hooks/useLoadingAction";
import { localDateToUtcMidnight } from "../../../shared/utils/dateHelpers";
import { getSowById, type Sow } from "../../sows/api/sowsApi";
import { createFarrowing } from "../api/farrowingsApi";
import type { CreateFarrowingPayload } from "../model/farrowing";

type AddFarrowingProps = RootStackScreenProps<"AddFarrowing">;

type NumericField = {
	key: keyof Omit<CreateFarrowingPayload, "sow_id" | "farrowing_date" | "notes">;
	label: string;
};

const numericFields: NumericField[] = [
	{ key: "male_piglets", label: "Lechones machos *" },
	{ key: "female_piglets", label: "Lechones hembras *" },
	{ key: "still_births", label: "Nacidos muertos" },
	{ key: "mummies", label: "Momias" },
];

const initialNumericValues = {
	male_piglets: "",
	female_piglets: "",
	still_births: "",
	mummies: "",
};

type NumericValues = typeof initialNumericValues;

const parseNonNegativeInteger = (value: string) => {
	const trimmed = value.trim();
	if (!/^\d+$/.test(trimmed)) return null;
	return Number(trimmed);
};

const parseOptionalCount = (value: string) =>
	value.trim().length === 0 ? 0 : parseNonNegativeInteger(value);

export default function AddFarrowing({ route, navigation }: AddFarrowingProps) {
	const { sowId } = route.params;
	const [sow, setSow] = useState<Sow | null>(null);
	const [sowError, setSowError] = useState<string | null>(null);
	const [farrowingDate, setFarrowingDate] = useState(
		localDateToUtcMidnight(new Date()),
	);
	const [numericValues, setNumericValues] =
		useState<NumericValues>(initialNumericValues);
	const [notes, setNotes] = useState("");
	const [saving, setSaving] = useState(false);

	const fetchSow = useCallback(async () => {
		try {
			setSowError(null);
			const data = await getSowById(sowId);
			setSow(data);
		} catch (err) {
			setSowError(
				getApiErrorMessage(err, {
					fallback: "No se pudo cargar la cerda seleccionada.",
				}),
			);
		}
	}, [sowId]);

	const { loading, runWithLoading: loadSow } = useLoadingAction(fetchSow, {
		initialLoading: true,
	});

	useFocusEffect(
		useCallback(() => {
			loadSow();
		}, [loadSow]),
	);

	const updateNumericValue = (key: keyof NumericValues, value: string) => {
		setNumericValues((current) => ({ ...current, [key]: value }));
	};

	const buildPayload = (): CreateFarrowingPayload | null => {
		const parsedValues = {
			male_piglets: parseNonNegativeInteger(numericValues.male_piglets),
			female_piglets: parseNonNegativeInteger(numericValues.female_piglets),
			still_births: parseOptionalCount(numericValues.still_births),
			mummies: parseOptionalCount(numericValues.mummies),
		};

		if (parsedValues.male_piglets === null || parsedValues.female_piglets === null) {
			Alert.alert(
				"Error",
				"Complete los lechones machos y hembras con numeros enteros positivos o cero.",
			);
			return null;
		}

		if (parsedValues.still_births === null || parsedValues.mummies === null) {
			Alert.alert(
				"Error",
				"Nacidos muertos y momias deben ser numeros enteros positivos o cero.",
			);
			return null;
		}

		return {
			sow_id: sowId,
			farrowing_date: farrowingDate.toISOString(),
			male_piglets: parsedValues.male_piglets,
			female_piglets: parsedValues.female_piglets,
			still_births: parsedValues.still_births,
			mummies: parsedValues.mummies,
			notes: notes.trim() ? notes.trim() : undefined,
		};
	};

	const handleSubmit = async () => {
		const payload = buildPayload();
		if (!payload) return;

		try {
			setSaving(true);
			await createFarrowing(payload);
			Alert.alert("Exito", "Parto agregado correctamente.");
			navigation.goBack();
		} catch (err) {
			Alert.alert(
				"Error",
				getApiErrorMessage(err, {
					fallback: "No se pudo agregar el parto.",
				}),
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color="#2E7D32" />
				<Text>Cargando cerda...</Text>
			</View>
		);
	}

	if (sowError) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>{sowError}</Text>
			</View>
		);
	}

	return (
		<ScreenContainer>
			<ScrollView style={styles.container}>
				<Text style={styles.title}>Agregar Nuevo Parto</Text>

				<Text style={styles.label}>Identificador Cerda</Text>
				<View style={styles.readOnlyInput}>
					<Text style={styles.readOnlyText}>{sow?.sow_tag_number ?? sowId}</Text>
				</View>

				<DatePickerField
					label="Fecha de parto *"
					value={farrowingDate}
					onChange={setFarrowingDate}
				/>

				{numericFields.map((field) => (
					<View key={field.key}>
						<Text style={styles.label}>{field.label}</Text>
						<TextInput
							style={styles.input}
							value={numericValues[field.key]}
							onChangeText={(value) => updateNumericValue(field.key, value)}
							keyboardType="number-pad"
							placeholder="0"
						/>
					</View>
				))}

				<Text style={styles.label}>Notas</Text>
				<TextInput
					style={[styles.input, styles.notesInput]}
					value={notes}
					onChangeText={setNotes}
					multiline
					textAlignVertical="top"
				/>

				<Pressable
					style={({ pressed }) => [
						styles.button,
						(saving || pressed) && { opacity: 0.8 },
					]}
					onPress={handleSubmit}
					disabled={saving}
				>
					<Text style={styles.buttonText}>
						{saving ? "Guardando..." : "Guardar"}
					</Text>
				</Pressable>
			</ScrollView>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
		padding: 20,
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
	title: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 20,
	},
	label: {
		fontSize: 15,
		marginBottom: 5,
	},
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#37474F",
		borderRadius: 10,
		marginBottom: 15,
		padding: 10,
	},
	readOnlyInput: {
		backgroundColor: "#ECEFF1",
		borderWidth: 1,
		borderColor: "#B0BEC5",
		borderRadius: 10,
		marginBottom: 15,
		padding: 12,
	},
	readOnlyText: {
		color: "#263238",
		fontSize: 16,
		fontWeight: "700",
	},
	notesInput: {
		height: 100,
	},
	button: {
		alignItems: "center",
		backgroundColor: "#FFA000",
		borderRadius: 10,
		marginBottom: 30,
		padding: 15,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
