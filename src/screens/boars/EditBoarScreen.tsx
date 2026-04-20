import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { type Boar, getBoarById, updateBoar } from "../../api/boarsApi";
import { BreedDropdown } from "../../components/BreedDropdown";
import DatePickerField from "../../components/DatePickerField";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import ScreenContainer from "../../components/uiControls/ScreenContainer";

type EditBoarRouteProp = RouteProp<RootStackParamList, "EditBoar">;

export default function EditBoar() {
	const [boar, setBoarInfo] = useState<Boar | null>(null);
	const [loading, setLoading] = useState(true);
	const [modalEditTagNumberVisible, setModalEditTagNumberVisible] =
		useState(false);
	const route = useRoute<EditBoarRouteProp>();
	const { boarId } = route.params;
	const navigation = useNavigation();
	// const [error, setError] = useState<string | null>(null);

	// Load boar details by ID
	const loadBoarInfo = useCallback(async () => {
		try {
			setLoading(true);
			const boarData = await getBoarById(boarId);
			setBoarInfo(boarData);
		} catch (error: any) {
			Alert.alert(
				"Error",
				"No se pudo cargar la información del verraco. Intente nuevamente.",
			);
		} finally {
			setLoading(false);
		}
	}, [boarId]);

	// Validation function to ensure required fields are filled before submitting
	const validateBoar = (boar: Partial<Boar>): boolean => {
		if (!boar.boar_tag_number || !boar.birth_date || !boar.breed_id) {
			Alert.alert(
				"Error",
				"Por favor, complete todos los campos obligatorios.",
			);
			return false;
		}
		return true;
	};

	// Format data before sending to API (especially for numeric fields that come as strings from TextInput)
	const formattingBoarDataForAPI = (boar: Boar): Partial<Boar> => {
		return {
			...boar,
			weight: boar.weight ? parseFloat(boar.weight.toString()) : null,
			length: boar.length ? parseFloat(boar.length.toString()) : null,
		};
	};

	const handleUpdateBoar = async () => {
		if (!boar) return;
		try {
			setLoading(true);
			if (!validateBoar(boar)) return;
			await updateBoar(boarId, formattingBoarDataForAPI(boar));
			Alert.alert(
				"Éxito",
				"La información del verraco se ha actualizado correctamente.",
			);
			navigation.goBack();
		} catch (error: any) {
			Alert.alert(
				"Error",
				"No se pudo actualizar la información del verraco. Intente nuevamente.",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadBoarInfo();
	}, [loadBoarInfo]);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
				<Text>Cargando verraco...</Text>
			</View>
		);
	}
	if (!boar) {
		return (
			<View style={styles.center}>
				<Text style={{ color: "red" }}>No se pudo cargar el verraco.</Text>
				<TouchableOpacity onPress={loadBoarInfo}>
					<Text style={{ color: "blue" }}>Reintentar</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<ScreenContainer>
			<ScrollView contentContainerStyle={styles.scrollContainer}>
				<View style={styles.imagePlaceholder} />
				{/* Boar Tag Number Editable */}
				<TouchableOpacity onPress={() => setModalEditTagNumberVisible(true)}>
					<Text style={styles.boarTagNumber}>{boar.boar_tag_number}</Text>
				</TouchableOpacity>
				{/* Boar Tag Number Edit Modal */}
				<Modal
					visible={modalEditTagNumberVisible}
					transparent
					animationType="slide"
				>
					<View style={[styles.center, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
						<View style={styles.editTagNumberContainer}>
							<Text style={styles.editTagNumberTitle}>Editar Identificador</Text>
							<TextInput
								style={styles.editTagNumberInput}
								value={boar.boar_tag_number}
								onChangeText={(text) =>
									setBoarInfo({ ...boar, boar_tag_number: text })
								}
							/>
							<View style={styles.editTagNumberButtonsContainer}>
								<TouchableOpacity
									style={styles.editTagNumberButton}
									onPress={() => {
										/* Checking if the input is empty */
										const trimmed = boar.boar_tag_number.trim();
										if (!trimmed) {
											Alert.alert(
												"Error",
												"El identificador no puede estar vacío.",
											);
											return;
										}
										setBoarInfo({ ...boar, boar_tag_number: trimmed });
										setModalEditTagNumberVisible(false);
									}}
								>
									<Text style={styles.editTagNumberButtonText}>Aceptar</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.editTagNumberButton}
									onPress={() => setModalEditTagNumberVisible(false)}
								>
									<Text style={styles.editTagNumberButtonText}>Cancelar</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
				<View>
					{/* Breed Dropdown */}
					<BreedDropdown
						value={boar.breeds?.breed_id || null}
						onChange={(newBreedId: number, label: string) => {
							setBoarInfo({
								...boar,
								breed_id: newBreedId,
								// Update breed details in the state to keep it consistent
								breeds: {
									breed_id: newBreedId,
									breed_name: label,
								},
							});
						}}
					/>
				</View>
				<View>
					{/* Birth Date Picker */}
					<DatePickerField
						label="Fecha de Nacimiento *"
						value={boar.birth_date ? new Date(boar.birth_date) : new Date()}
						onChange={(newDate: Date) => {
							setBoarInfo({ ...boar, birth_date: newDate.toISOString() });
						}}
					/>
				</View>
				{/* Additional Fields */}
				<View style={styles.detailsContainer}>
					{[
						{
							label: "Peso(kg)",
							value: boar?.weight,
							key: "weight",
							keyboardType: "numeric" as const,
						},
						{
							label: "Largo(cm)",
							value: boar?.length,
							key: "length",
							keyboardType: "numeric" as const,
						},
						{
							label: "Descripción",
							value: boar?.description,
							key: "description",
							multiline: true,
						},
					].map((item) => (
						<View key={item.key} style={styles.row}>
							<Text style={styles.label}>{item.label}</Text>
							<TextInput
								style={styles.input}
								accessibilityLabel={`Editar ${item.label}`}
								value={item.value?.toString() || ""}
								keyboardType={item.keyboardType || "default"}
								multiline={item.multiline || false}
								numberOfLines={item.multiline ? 4 : 1}
								onChangeText={(text) => {
									setBoarInfo({ ...boar, [item.key]: text });
								}}
							/>
						</View>
					))}
				</View>
				<TouchableOpacity style={styles.button} onPress={handleUpdateBoar}>
					<Text style={styles.buttonText}>Actualizar</Text>
				</TouchableOpacity>
			</ScrollView>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
	},
	scrollContainer: {
		flex: 1,
		padding: 20,
		backgroundColor: "#F9FAFB",
	},
	imagePlaceholder: {
		width: 120,
		height: 120,
		backgroundColor: "#ccc",
		borderRadius: 10,
		marginBottom: 10,
		alignSelf: "center",
	},
	boarTagNumber: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	editTagNumberContainer: {
		position: "absolute",
		top: "40%",
		left: "10%",
		width: "80%",
		padding: 20,
		backgroundColor: "#fff",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
	},
	editTagNumberTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
	},
	editTagNumberInput: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
	},
	editTagNumberButtonsContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	editTagNumberButton: {
		flex: 1,
		padding: 10,
		marginHorizontal: 5,
		backgroundColor: "#007AFF",
		borderRadius: 5,
		alignItems: "center",
	},
	editTagNumberButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	detailsContainer: {
		borderColor: "#ddd",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderColor: "#eee",
	},
	label: {
		fontWeight: "600",
		color: "#555",
		flex: 1,
	},
	input: {
		flex: 2,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 5,
		backgroundColor: "#fff",
	},
	button: {
		marginTop: 20,
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
