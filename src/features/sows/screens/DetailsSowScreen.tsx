import type { RouteProp } from "@react-navigation/native";
import {
	useNavigation,
	useRoute,
	useFocusEffect,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getSowbyId, type Sow } from "../api/sowsApi";
import EditAction from "../../../shared/components/actions/editAction";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import ScreenContainer from "../../../shared/components/layout/screenContainer";

// Route prop for receiving sowId from navigation
type DetailsRouteProp = RouteProp<RootStackParamList, "DetailsSow">;
// Navigation prop for navigating to EditSow
type NavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"DetailsSow"
>;

export default function DetailsSowScreen() {
	const [sow, setSowDetails] = useState<Sow | null>(null);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation<NavigationProp>();
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const route = useRoute<DetailsRouteProp>();
	const { sowId } = route.params;

	const loadSowsDetails = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getSowbyId(sowId);
			console.log("Sow details loaded:", data);
			setSowDetails(data);
		} catch (err: any) {
			console.error("Error loading sow:", err);
			setError("No se pudo cargar la cerda.");
		} finally {
			setLoading(false);
		}
	}, [sowId]);

	const onRefresh = async () => {
		setRefreshing(true);
		await loadSowsDetails();
		setRefreshing(false);
	};

	const handleLongPress = (sowId: number) => {
		console.log("Ir a edicion de cerda:", sowId);
		navigation.navigate("EditSow", { sowId });
	};

	// Fetch latest data whenever screen focuses or ID changes
	useFocusEffect(
		useCallback(() => {
		loadSowsDetails();
	}, [loadSowsDetails]));

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
			</View>
		);
	}

	const datos = [
		{ label: "Estado", value: sow.status?.status_name ?? "Sin estado" },
		{ label: "Raza", value: sow.breeds?.breed_name?.trim() ?? "Sin raza" },
		{ label: "Fecha de entrada", value: sow.entry_date.split("T")[0] },
		{ label: "Cantidad de pezones", value: sow.mammary_glands ?? "-" },
		{ label: "Peso(cm)", value: sow.weight ?? "-" },
		{ label: "Largo(cm)", value: sow.length ?? "-" },
		{ label: "Cantidad de partos", value: sow.farrowing_number ?? "-" },
		{ label: "Descripción", value: sow.description?.trim() || "-" },
	];
	console.log("Datos para mostrar en tabla:", sow.breeds?.breed_name);
	return (
		<ScreenContainer>
			<View style={styles.scrollContent}>
				{/* Image and Name */}
				<View style={styles.imageAndNameContainer}>
					<View style={styles.imagePlaceholder} />
					<Text style={styles.name}>{sow.sow_tag_number}</Text>
				</View>
				{/* Data Table */}
				<Pressable
					style={({ pressed }) => [
						styles.editDetails,
						pressed && { backgroundColor: "#e0e0e0", opacity: 0.6 },
					]}
					// onLongPress={() => handleLongPress(sow.sow_id)}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							backgroundColor: "#2E7D32",
							padding: 8,
						}}
					>
						<Text style={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}>
							Detalles de la cerda
						</Text>
						<EditAction
							// style={styles.editAction}
							onPress={() => {
								console.log("Ir a edicion de cerda:", sow);
								navigation.navigate("EditSow", { sowId });
							}}
							size={24}
							color="#fff"
						/>
					</View>
					<View style={styles.table}>
						{datos.map((item) => (
							<View key={item.label} style={styles.row}>
								<Text style={styles.label}>{item.label}</Text>
								<Text style={styles.value}>{item.value}</Text>
							</View>
						))}
					</View>
				</Pressable>
			</View>
			{/* Botones al final */}
			<View style={styles.bottomButtons}>
				{["Historial", "Vacunas", "Eventos", "Editar"].map((title) => (
					<TouchableOpacity key={title} style={styles.button}>
						<Text style={styles.buttonText}>{title}</Text>
					</TouchableOpacity>
				))}
			</View>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	scrollContent: {
		flex: 1,
		padding: 5,
		// paddingBottom: 100, // espacio para los botones
	},
	imageAndNameContainer: {
		alignItems: "center",
		margin: 20,
	},
	imagePlaceholder: {
		width: 120,
		height: 120,
		backgroundColor: "#ccc",
		borderRadius: 10,
		marginBottom: 10,
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
	},
	table: {
		// borderTopWidth: 3,
		// borderColor: "#ddd",
		backgroundColor: "#fff",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderColor: "#eee",
		marginHorizontal: 5,
	},
	label: {
		fontWeight: "500",
		color: "#555",
		fontSize: 16,
		marginBottom: 5,
	},
	value: {
		fontSize: 15,
		color: "#333",
	},
	bottomButtons: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		backgroundColor: "#fff",
		borderTopWidth: 1,
		borderColor: "#ccc",
	},
	button: {
		flex: 1,
		paddingVertical: 20,
		alignItems: "center",
		justifyContent: "center",
		borderRightWidth: 1,
		borderColor: "#ccc",
	},
	buttonText: {
		fontWeight: "bold",
		color: "#007AFF",
	},
	editDetails: {
		paddingVertical: 10,
		paddingHorizontal: 5,
		borderRadius: 5,
	},
	editAction: {
		position: "absolute",
		// top: 10,
		right: 3,
	},
});

