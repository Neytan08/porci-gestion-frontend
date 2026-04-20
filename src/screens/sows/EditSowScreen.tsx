import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { getSowbyId, type Sow, updateSow } from "../../api/sowsApi";
import { BreedDropdown } from "../../components/BreedDropdown";
import DatePickerField from "../../components/DatePickerField";
import { StatusDropdown } from "../../components/StatusDropdown";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import ScreenContainer from "../../components/uiControls/ScreenContainer";

// This ensures that the `sowId` parameter is correctly typed and available when navigating to this screen.
type EditRouteProp = RouteProp<RootStackParamList, "EditSow">;

export default function EditSow() {
	const [sow, setSowDetails] = useState<Sow | null>(null);
	const [loading, setLoading] = useState(true);
	const [isBannerTagNumberVisible, setBannerTagNumberVisible] = useState(false);
	const route = useRoute<EditRouteProp>();
	const { sowId } = route.params;
	const navigation = useNavigation();
	// const [error, setError] = useState<string | null>(null);

	// Load sow details by ID
	const loadSowDetails = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getSowbyId(sowId);
			setSowDetails(data);
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setLoading(false);
		}
	}, [sowId]);

	// Validation of required fields
	const validateSow = (sow: Partial<Sow>): boolean => {
		if (
			!sow.sow_tag_number ||
			!sow.entry_date ||
			!sow.breed_id ||
			!sow.mammary_glands ||
			!sow.status_id
		) {
			Alert.alert(
				"Error",
				"Por favor, complete todos los campos obligatorios.",
			);
			return false;
		}
		return true;
	};

	// Format data before sending to API (especially for numeric fields that come as strings from TextInput)
	const formattingSowDataForAPI = (sow: Sow): Partial<Sow> => {
		return {
			...sow,
			weight: sow.weight ? parseFloat(sow.weight.toString()) : null,
			length: sow.length ? parseFloat(sow.length.toString()) : null,
			mammary_glands: sow.mammary_glands
				? parseFloat(sow.mammary_glands.toString())
				: 0,
			farrowing_number: sow.farrowing_number
				? parseFloat(sow.farrowing_number.toString())
				: 0,
		};
	};

	const handleUpdateSow = async () => {
		if (!sow) return;
		try {
			if (!validateSow(sow)) return;
			await updateSow(sowId, formattingSowDataForAPI(sow));
			Alert.alert(
				"Actualización completada",
				"La cerda fue actualizada correctamente.",
			);
			navigation.goBack();
		} catch (error: any) {
			Alert.alert(
				"Error",
				"No se pudo actualizar la cerda. Intente nuevamente.",
			);
		} finally {
			setLoading(false);
		}
	};

// Load data once the component is mounted
useEffect(() => {
	loadSowDetails();
}, [loadSowDetails]);
	
	if (loading) {
		console.log("Loading sow in edit view...");
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
				<Pressable onPress={loadSowDetails}>
					<Text style={{ color: "blue" }}>Reintentar</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<ScreenContainer>
			<View style={styles.mainContainer}>
				{/* Formulario editable */}
				<View style={styles.header}>
					<View style={styles.imagePlaceholder} />
					{/* Sow Tag Number Editable */}
					<Pressable onPress={() => setBannerTagNumberVisible(true)}>
						<Text style={styles.name}>{sow.sow_tag_number}</Text>
					</Pressable>
					<Modal
						visible={isBannerTagNumberVisible}
						transparent
						animationType="slide"
					>
						<View style={[styles.center, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
							<View style={styles.banner}>
								<Text style={styles.bannerTitle}>Ingrese el nombre</Text>
								<TextInput
									style={styles.bannerInput}
									value={sow.sow_tag_number}
									onChangeText={(text) => {
										setSowDetails({ ...sow, sow_tag_number: text });
									}}
								/>
								<View style={styles.bannerButtons}>
									<Pressable
										style={({ pressed }) => [
											styles.bannerButton,
											pressed && { opacity: 0.8 },
										]}
										onPress={() => {
											/* Checking if the input is empty */
											const trimmed = sow.sow_tag_number.trim();
											if (!trimmed) {
												Alert.alert("Error", "El nombre no puede estar vacío.");
												return;
											}
											setSowDetails({ ...sow, sow_tag_number: trimmed });
											setBannerTagNumberVisible(false);
										}}
									>
										<Text style={styles.bannerButtonText}>Aceptar</Text>
									</Pressable>
									<Pressable
										style={({ pressed }) => [
											styles.bannerButton,
											pressed && { opacity: 0.8 },
										]}
										onPress={() => setBannerTagNumberVisible(false)}
									>
										<Text style={styles.bannerButtonText}>Cancelar</Text>
									</Pressable>
								</View>
							</View>
						</View>
					</Modal>
				</View>
				{/* Dropdowns and Date Picker */}
				<View>
					<StatusDropdown
						value={sow.status_id || null}
						onChange={(newStatusId: number, label: string) => {
							setSowDetails({
								...sow,
								status_id: newStatusId,
								// Update status details in the state to keep it consistent
								status: {
									status_id: newStatusId,
									status_name: label,
								},
							});
						}}
					/>
				</View>
				<View>
					<BreedDropdown
						value={sow.breed_id || null}
						onChange={(newBreedId: number, label: string) => {
							setSowDetails({
								...sow,
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
					<DatePickerField
						label="Fecha de Ingreso *"
						value={sow.entry_date ? new Date(sow.entry_date) : new Date()}
						onChange={(newDate: Date) => {
							setSowDetails({ ...sow, entry_date: newDate.toISOString() });
						}}
					/>
				</View>
				{/* Additional Fields */}
				<View style={styles.table}>
					{[
						{
							label: "Cantidad de pezones *",
							value: sow.mammary_glands,
							key: "mammary_glands",
							keyboardType: "numeric" as const,
						},
						{
							label: "Peso(cm)",
							value: sow.weight,
							key: "weight",
							keyboardType: "numeric" as const,
						},
						{
							label: "Largo(cm)",
							value: sow.length,
							key: "length",
							keyboardType: "numeric" as const,
						},
						{
							label: "Cantidad de partos",
							value: sow.farrowing_number,
							key: "farrowing_number",
							keyboardType: "numeric" as const,
						},
						{
							label: "Descripción",
							value: sow.description,
							key: "description",
							multiline: true,
						},
					].map((item) => (
						<View key={item.key} style={styles.row}>
							<Text style={styles.label}>{item.label}</Text>
							<TextInput
								accessibilityLabel={`Editar ${item.label}`}
								style={styles.input}
								value={item.value?.toString() ?? ""}
								keyboardType={item.keyboardType || "default"}
								multiline={item.multiline}
								numberOfLines={item.multiline ? 4 : 1}
								onChangeText={(text) =>
									setSowDetails({
										...sow,
										[item.key]:
											item.keyboardType === "numeric" ? Number(text) || 0 : text,
									})
								}
							/>
						</View>
					))}
				</View>
				<Pressable
					style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
					onPress={handleUpdateSow}
				>
					<Text style={styles.buttonText}>Actualizar</Text>
				</Pressable>
			</View>
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
	header: {
		alignItems: "center",
		marginBottom: 20,
	},
	imagePlaceholder: {
		width: 120,
		height: 120,
		backgroundColor: "#ccc",
		borderRadius: 10,
		marginBottom: 10,
		alignSelf: "center",
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
	},
	table: {
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
	banner: {
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
	bannerTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	bannerInput: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 20,
	},
	bannerButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	bannerButton: {
		flex: 1,
		padding: 10,
		marginHorizontal: 5,
		backgroundColor: "#007AFF",
		borderRadius: 5,
		alignItems: "center",
	},
	bannerButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
});
