import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	Modal,
	Pressable,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { type Boar, deleteBoar, getBoars } from "../../api/boarsApi";
import SearchFilter from "../../components/filters/SearchFilter";
import ConfirmDeleteModal from "../../components/modals/ConfirmDeleteModal";
import DeleteAction from "../../components/uiControls/DeleteAction";
import DetailsAction from "../../components/uiControls/DetailsAction";
import EditAction from "../../components/uiControls/EditAction";
import ListAction from "../../components/uiControls/ListAction";
import RowCheckbox from "../../components/uiControls/RowCheckbox";
import { useDeleteEntity } from "../../hooks/useDeleteEntity";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import ScreenContainer from "../../components/uiControls/ScreenContainer";
import OptionsFilter from "../../components/filters/OptionsFilter";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Boars">;

export default function BoarsScreen() {
	const navigation = useNavigation<NavigationProp>();
	const [boars, setBoars] = useState<Boar[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [deleteSelectedBoar, setDeleteSelectedBoar] = useState<{
		boar_id: number;
		boar_tag_number: string;
	} | null>(null);
	const [filterSheetVisible, setFilterSheetVisible] = useState(false);
	const [filterSelectedBreedId, setFilterSelectedBreedId] = useState<
		number | null
	>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [selectedBoars, setSelectedBoars] = useState<Set<number>>(new Set());
	const [actionsModalVisible, setActionsModalVisible] = useState(false);
	const [boarAction, setBoarAction] = useState<Boar | false>(false);
	const [selectedActionsVisible, setSelectedActionsVisible] = useState(false);

	// Build breed options from boars (id -> name), no extra API call
	const breedOptions = useMemo(() => {
		const map = new Map<number, string>();
		// Go through all boars to extract unique breeds
		boars.forEach((b) => {
			const id = b.breeds?.breed_id ?? (b as any).breed_id;
			const name = b.breeds?.breed_name ?? (b as any).breed_name;
			if (id != null && typeof name === "string" && name.trim())
				map.set(id, name);
		});
		return Array.from(map, ([value, label]) => ({ value, label }));
	}, [boars]);

	// Filter boars list based on selected breed and search query
	const filterBoars = useMemo(() => {
		return boars.filter((b) => {
			// Match breeds with selected breed filter
			const breedId = b.breeds?.breed_id ?? (b as any).breed_id ?? null;
			const matchBreed =
				filterSelectedBreedId == null || breedId === filterSelectedBreedId;

			// Match each letter in the tag number with the search query
			const q = searchQuery.trim().toLowerCase();
			const tag = (b.boar_tag_number ?? "").toString().toLowerCase();
			const matchSearch = q.length === 0 || tag.includes(q);

			return matchBreed && matchSearch;
		});
	}, [boars, filterSelectedBreedId, searchQuery]);

	// Select multiple boars
	const toggleSelect = useCallback((id: number) => {
		setSelectedBoars((prev) => {
			const next = new Set(prev);
			// Remove it if already selected, else add it
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	// Redirect to edit or delete based on action
	const handleSelectedBoarAction = useCallback(
		(action: "edit" | "delete" | "moreDetails", boar: Boar | false) => {
			// if (action === "edit") navigation.navigate("EditBoar", { boarId: boar.boar_id });
			if (boar === false) return;
			if (action === "edit")
				navigation.navigate("EditBoar", { boarId: boar.boar_id });
			if (action === "moreDetails") {
				Alert.alert(
					"Need to implement",
					"More details functionality is not implemented yet.",
				);
			}
			if (action === "delete") {
				setDeleteModalVisible(true);
				setDeleteSelectedBoar(boar);
			}
		}, [navigation],
	);

	// Fetch boars from API
	const loadBoars = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getBoars();
			// console.log('Loaded boars:', data);
			setBoars(data);
		} catch (err: any) {
			if (err?.code === "ECONNABORTED") {
				setError("La solicitud tardó demasiado. Intente nuevamente.");
			} else if (err?.isAxiosError) {
				setError("Error de red o servidor. Verifique su conexión.");
			} else {
				setError("No se pudo cargar la lista de verracos.");
			}
			console.error("Error loading boars:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	// Pull-to-refresh handler
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await loadBoars();
		setRefreshing(false);
	}, [loadBoars]);

	// Navigate to AddBoar screen
	const handleAddPress = () => {
		navigation.navigate("AddBoar" as never);
	};

	// Handle long press to show delete modal
	const handleDeletePress = (boar_id: number, boar_tag_number: string) => {
		setDeleteSelectedBoar({
			boar_id: boar_id,
			boar_tag_number: boar_tag_number,
		});
		setDeleteModalVisible(true);
		console.log("Delete");
	};

	/* Handle deleting boars by using the custom hook
	 * Re-writing useDeleteEntity interface
	 */
	const { deleting, deleteById } = useDeleteEntity<number>({
		deleteFn: deleteBoar,
		onDeleted: loadBoars,
		messages: {
			successTitle: "Eliminación completada",
			successMessage: "El verraco fue eliminado correctamente.",
			errorTitle: "Error",
			errorMessage: "No se pudo eliminar el verraco. Intente nuevamente.",
		},
	});

	// Confirm a boar was selected before delete it (using shared hook)
	const confirmDeleteBoar = async () => {
		if (!deleteSelectedBoar) return;
		setDeleteModalVisible(false);
		await deleteById(deleteSelectedBoar.boar_id);
		setDeleteSelectedBoar(null);
	};

	// Load boars on mount and every time the screen regains focus
	useFocusEffect(
		useCallback(() => {
			loadBoars();
		}, [loadBoars]),
	);

	// In case of loading last too long
	if (loading) {
		return (
			<View style={styles.messageAlignment}>
				<ActivityIndicator size="large" />
				<Text>Cargando verracos...</Text>
			</View>
		);
	}

	// Show error message if any
	if (error) {
		return (
			<View style={styles.messageAlignment}>
				<Text style={{ color: "red" }}>{error}</Text>
			</View>
		);
	}

	return (
		<ScreenContainer>
			<View style={styles.mainContainer}>
				{/* Filter Section */}
				<Modal
					visible={filterSheetVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setFilterSheetVisible(false)}
				>
					<Pressable
						style={styles.filterOverlay}
						onPress={() => setFilterSheetVisible(false)}
					>
						<View style={styles.filterOverlayView}>
							<Text style={styles.filterOverlayTitle}>Filtros</Text>
							{/* Breed Filter */}
							<OptionsFilter
								options={breedOptions} // [{label, value}]
								selectedId={filterSelectedBreedId} // number | null
								onChange={setFilterSelectedBreedId} // (id) => void
								title="Raza"
							/>
							{/* Filter Actions */}
							<View style={styles.filterBtnRow}>
								<Pressable
									style={[styles.filterBtn, { backgroundColor: "#e0e0e0" }]}
									onPress={() => {
										setFilterSelectedBreedId(null);
										setFilterSheetVisible(false);
									}}
								>
									<Text style={{ fontWeight: "700", color: "#333" }}>
										Limpiar filtros
									</Text>
								</Pressable>
								<Pressable
									style={[styles.filterBtn, { backgroundColor: "#2E7D32" }]}
									onPress={() => setFilterSheetVisible(false)}
								>
									<Text style={{ fontWeight: "700", color: "#fff" }}>
										Aplicar
									</Text>
								</Pressable>
							</View>
						</View>
					</Pressable>
				</Modal>
				{/* Boars list */}
				<FlatList<Boar>
					data={filterBoars}
					keyExtractor={(item) => `${item.boar_id}`}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					renderItem={({ item }) => {
						// Compute active state for styling when the modal is open for the item
						const isActive =
							boarAction && boarAction.boar_id === item.boar_id && actionsModalVisible;
						return (
							<Pressable
								style={({ pressed }) => [
									styles.pressableRow,
									pressed && { backgroundColor: "#e0e0e0", opacity: 0.6 },
								]}
								onPress={() =>
									Alert.alert(
										"Need to implement",
										"Edit boar functionality is not implemented yet.",
									)
								}
								onLongPress={() =>
									handleDeletePress(item.boar_id, item.boar_tag_number)
								}
							>
								{/* FlatList Content */}
								<View
									style={[styles.contentRow, isActive && styles.contentRowActive]}
								>
									<RowCheckbox
										selected={selectedBoars.has(item.boar_id)}
										onPress={() => toggleSelect(item.boar_id)}
										size={18}
										radius={4}
										width={1}
										color={"#eee"}
										style={styles.checkBox}
									/>
									<Text style={[styles.textCell, { flexBasis: "55%" }]}>
										<Text style={{ fontWeight: "700" }}>Nombre: </Text>
										{item.boar_tag_number ?? "-"}
									</Text>
									<Text style={[styles.textCell, { flexBasis: "45%" }]}>
										<Text style={{ fontWeight: "700" }}>Raza: </Text>
										{item.breeds?.breed_name ?? "-"}
									</Text>
									<Text style={[styles.textCell, { flexBasis: "100%" }]}>
										<Text style={{ fontWeight: "700" }}>Fecha Nacimiento: </Text>
										{item.birth_date ? item.birth_date.split("T")[0] : "-"}
									</Text>
									<Text style={[styles.textCell, { flexBasis: "100%" }]}>
										<Text style={{ fontWeight: "700" }}>Edad: </Text>
										{/* Display age with correct pluralization */}
										{item.age
											? `${item.age.years} año${item.age.years === 1 ? "" : "s"} y ${item.age.months} mes${item.age.months === 1 ? "" : "es"}`
											: "-"}
									</Text>
									<Text style={[styles.textCell, { flexBasis: "100%" }]}>
										<Text style={{ fontWeight: "700" }}>Descripción: </Text>
										{item.description ?? "Sin descripción"}
									</Text>
									<View style={styles.detailsButton}>
										{/* List Action: pop up a small view with actions for the item */}
										<ListAction
											onPress={() => {
												setBoarAction(item);
												setActionsModalVisible(true);
											}}
										/>
									</View>
								</View>
							</Pressable>
						);
					}}
					ListEmptyComponent={
						<Text style={styles.noBoarsText}>No hay verracos registrados.</Text>
					}
					ListHeaderComponent={
						<View style={styles.flatListHeader}>
							<Pressable style={({ pressed }) => [
									styles.filterBtnText,
									pressed && { backgroundColor: "#e0e0e0", opacity: 0.6 },
								]}
								onPress={() => setFilterSheetVisible(true)}
							>
								<Text style={styles.filterLinkText}>Filtrar por…</Text>
							</Pressable>
							<SearchFilter value={searchQuery} onChange={setSearchQuery} />
						</View>
					}
					ListHeaderComponentStyle={{ paddingTop: 2, paddingBottom: 4 }}
					contentContainerStyle={{ paddingBottom: 90 }}
				/>
				{/* Modal for actions */}
				<Modal
					visible={actionsModalVisible}
					transparent
					animationType="fade"
					onRequestClose={() => {
						setActionsModalVisible(false);
						setBoarAction(false);
					}} // Android back button
				>
					<View style={styles.modalActionsContainer}>
						{/* Overlay catch clicks outside the panel and closes it */}
						<Pressable
							style={styles.modalActionsOverlay}
							onPress={() => {
								setActionsModalVisible(false);
								setBoarAction(false);
							}}
						/>
						{/* Container for the panel with buttons (will not touch the overlay) */}
						<View style={styles.modalActionsView}>
							{boarAction && (
								<Text style={{ fontWeight: "700", marginBottom: 8 }}>
									Acciones Disponibles:{" "}
									{boarAction.boar_tag_number ?? boarAction.boar_id}
								</Text>
							)}
							<View
								style={{ flexDirection: "row", justifyContent: "space-between" }}
							>
								<EditAction
									onPress={() => {
										setActionsModalVisible(false); /* luego navega/edit */
										handleSelectedBoarAction("edit", boarAction);
									}}
								/>
								<DetailsAction
									onPress={() => {
										setActionsModalVisible(false);
										handleSelectedBoarAction("moreDetails", boarAction);
									}}
								/>
								<DeleteAction
									onPress={() => {
										setActionsModalVisible(false);
										handleSelectedBoarAction("delete", boarAction);
									}}
								/>
							</View>
						</View>
					</View>
				</Modal>
				{selectedBoars.size > 0 ? (
					// Floating Selected Actions Button
					<TouchableOpacity
						style={styles.pinnedBoarButton}
						onPress={() => setSelectedActionsVisible(true)}
					>
						<Image
							source={require("../../../assets/icons/dots.png")}
							style={styles.icon}
							resizeMode="contain"
						/>
						<Text
							style={styles.pinnedBoarButtonText}
						>{`(${selectedBoars.size})   `}</Text>
					</TouchableOpacity>
				) : (
					// Floating Add Button
					<TouchableOpacity
						style={styles.pinnedBoarButton}
						onPress={handleAddPress}
					>
						<Image
							source={require("../../../assets/icons/add.png")}
							style={styles.icon}
							resizeMode="contain"
						/>
						<Text style={styles.pinnedBoarButtonText}> Agregar</Text>
					</TouchableOpacity>
				)}
				{/* Deleting Pop up */}
				<ConfirmDeleteModal
					visible={deleteModalVisible && deleteSelectedBoar !== null}
					name={deleteSelectedBoar?.boar_tag_number}
					title="Eliminar verraco"
					message={`¿Seguro que desea eliminar al verraco ${deleteSelectedBoar?.boar_tag_number ?? ""}?`}
					confirmText="Eliminar"
					cancelText="Cancelar"
					loading={deleting}
					onConfirm={confirmDeleteBoar}
					onCancel={() => {
						setDeleteModalVisible(false);
						setDeleteSelectedBoar(null);
					}}
				/>
				{/* Selection Section */}
				<Modal
					visible={selectedActionsVisible}
					transparent
					animationType="fade"
					onRequestClose={() => setSelectedActionsVisible(false)}
				>
					<Pressable
						style={styles.filterOverlay}
						onPress={() => setSelectedActionsVisible(false)}
					>
						<View style={styles.filterOverlayView}>
							<Text
								style={styles.filterOverlayTitle}
							>{`Verracos Seleccionados (${selectedBoars.size})`}</Text>
							<View style={styles.filterBtnRow}>
								{/* PDF Extraction */}
								<Pressable
									style={styles.filterBtn}
									onPress={() => Alert.alert("Funcion no implementada")}
								>
									<Image
										source={require("../../../assets/icons/pdf-file.png")}
										style={styles.icon}
										resizeMode="contain"
									/>
									<Text style={{ fontWeight: "700", textAlign: "center" }}>
										Extraer a PDF
									</Text>
								</Pressable>
								{/* Retire Boar */}
								<Pressable
									style={styles.filterBtn}
									onPress={() => Alert.alert("Funcion no implementada")}
								>
									<Image
										source={require("../../../assets/icons/trash.png")}
										style={styles.icon}
										resizeMode="contain"
									/>
									<Text style={{ fontWeight: "700", textAlign: "center" }}>
										Desechar Verracos
									</Text>
								</Pressable>
								{/* Clear selection */}
								<Pressable
									style={styles.filterBtn}
									onPress={() => [
										setSelectedBoars(new Set()),
										setSelectedActionsVisible(false),
									]}
								>
									<Image
										source={require("../../../assets/icons/uncheck.png")}
										style={styles.icon}
										resizeMode="contain"
									/>
									<Text style={{ fontWeight: "700", textAlign: "center" }}>
										Limpiar Selección
									</Text>
								</Pressable>
							</View>
						</View>
					</Pressable>
				</Modal>
			</View>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	icon: { width: 42, height: 42 },
	mainContainer: {
		flex: 1,
		backgroundColor: "#F9FAFB",
		paddingHorizontal: 4,
	},
	messageAlignment: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	noBoarsText: {
		textAlign: "center",
		marginTop: 20,
	},
	// Filter Modal Styles
	filterOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.25)",
		justifyContent: "flex-end",
	},
	filterOverlayView: {
		backgroundColor: "#fff",
		paddingTop: 12,
		paddingBottom: 8,
		paddingHorizontal: 16,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
	filterOverlayTitle: {
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 8,
	},
	sectionDivider: {
		height: 1,
		backgroundColor: "#eee",
		marginVertical: 8,
	},
	filterBtnRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 10,
		marginTop: 12,
		marginBottom: 6,
	},
	filterBtn: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: "center",
	},
	// FlatList Header
	flatListHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 4,
	},
	filterLinkText: {
		fontSize: 14,
		fontWeight: "400",
	},
	filterBtnText: {
		minHeight: 40,
		minWidth: 150,
		alignContent: "center",
		justifyContent: "center",
		borderRadius: 6,
	},
	// FlatList Rows
	pressableRow: {
		flexDirection: "row",
		borderRadius: 10,
		marginBottom: 5,
	},
	contentRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingVertical: 12,
		paddingHorizontal: 15,
		backgroundColor: "#fff",
		borderRadius: 10,
		margin: 5,
		borderWidth: 1,
		borderColor: "#eee",
	},
	contentRowActive: {
		backgroundColor: "#e2e2e2",
	},
	textCell: {
		color: "#333",
		fontSize: 14,
		marginBottom: 2,
	},
	checkBox: {
		position: "absolute",
		left: -4,
		top: -3,
	},
	detailsButton: {
		width: "101%", // So the wrapper takes full width
		alignItems: "flex-end",
		justifyContent: "flex-end",
		minHeight: 40,
		marginTop: -20,
		marginBottom: -5,
		marginRight: -20,
	},
	// Floating Buttons
	pinnedBoarButton: {
		flexDirection: "row",
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#FFA000", // color naranja similar al ejemplo
		width: 140,
		height: 50,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5, // sombra en Android
		shadowColor: "#000",
		shadowOpacity: 0.3,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4, // sombra en iOS
	},
	pinnedBoarButtonText: {
		fontSize: 20,
		color: "#fff",
		marginBottom: 2,
	},
	// Modal Actions Styles
	modalActionsContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalActionsOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.2)",
	},
	modalActionsView: {
		minWidth: 300,
		marginHorizontal: 16,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 12,
		zIndex: 500,
		elevation: 10, // sombra Android
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 8,
	},
});
