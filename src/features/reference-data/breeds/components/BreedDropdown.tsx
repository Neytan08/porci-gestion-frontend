import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import type { Breed } from "../api/breedApi";
import { createBreed, getBreed } from "../api/breedApi";
import {
	areStringsEqual,
	containsSpecialCharacters,
} from "../../../../shared/utils/stringHelpers";

/**
 * BreedDropdown is a reusable component that allows users to select a breed from a list or add a new breed.
 * Props:
 * - value: The currently selected breed ID.
 * - onChange: A callback function that is called when a new breed is selected or created. 
 *   It receives the selected breed ID and label as parameters.
 */
type BreedDropdownProps = {
	value: number | null;
	onChange: (value: number, label: string) => void;
};

export const BreedDropdown: React.FC<BreedDropdownProps> = ({
	value,
	onChange,
}) => {
	const [loading, setLoading] = useState(true);
	const [breedsOptions, setBreeds] = useState<
		{ label: string; value: number }[]
	>([]);
	const [addingModalVisible, setAddingModalVisible] = useState(false);
	const [breedOptionsModalVisible, setBreedOptionsModalVisible] =
		useState(false);
	// State for new breed being added
	const [newBreed, setNewBreed] = useState<Breed>({
		breed_id: 0,
		breed_name: "",
		description: "",
	});

	// Fetch breeds from API
	const fetchBreeds = useCallback(async () => {
		try {
			const data = await getBreed();
			const mapped = data.map((item: Breed) => ({
				label: item.breed_name,
				value: item.breed_id,
			}));
			setBreeds(mapped);
		} catch (error) {
			console.error("Error fetching breeds:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBreeds();
	}, [fetchBreeds]);

	// Show loading indicator while fetching data
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" />
				<Text>Cargando razas...</Text>
			</View>
		);
	}
	// Checking if the new Breed already exists
	const isDuplicate = breedsOptions.some((b) =>
		areStringsEqual(b.label, newBreed.breed_name),
	);

	// Handle creating a new breed
	const handleCreateBreed = async () => {
		// Not allowing empty names or names with special characters
		if (
			!newBreed.breed_name.trim() ||
			containsSpecialCharacters(newBreed.breed_name)
		) {
			Alert.alert(
				"Error",
				"El nombre de la raza es obligatorio y no debe contener caracteres especiales.",
			);
			return;
		}
		// Checking for duplicates
		if (isDuplicate) {
			Alert.alert("Error", "Ya existe una raza con ese nombre.");
			return;
		}
		try {
			const createdBreed = await createBreed(newBreed);
			Alert.alert("Éxito", "Raza agregada correctamente.");
			// Add the new breed as a new picker option
			const updatedBreeds = [
				...breedsOptions,
				{ label: createdBreed.breed_name, value: createdBreed.breed_id },
			];
			setBreeds(updatedBreeds);
			onChange(createdBreed.breed_id, createdBreed.breed_name); // Set the newly created breed as the selected breed
			setAddingModalVisible(false);
			setNewBreed({ breed_id: 0, breed_name: "", description: "" }); // Clear new breed input fields
		} catch (error) {
			console.error("Error creating breed:", error);
		}
	};

	// Handle breed selection: find the label for the selected value and notify the parent
	const handleSelection = (itemValue: number) => {
		const selected = breedsOptions.find((b) => b.value === itemValue);
		onChange(itemValue, selected?.label ?? "");
		setBreedOptionsModalVisible(false);
	};
	return (
		<View style={styles.container}>
			<Text style={styles.label}>{"Raza *"}</Text>
			{/* Dropdown and adding breed */}
			<View style={styles.breedRow}>
				{/* Dropdown to open modal and show breed options */}
				<Pressable
					onPress={() => setBreedOptionsModalVisible(true)}
					style={({ pressed }) => [styles.breedDropdown, pressed && { opacity: 0.3 }]}
				>
					<Text style={styles.selectedBreed}>
						{breedsOptions.find((item) => item.value === value)?.label ||
							"Seleccionar raza..."}
					</Text>
				</Pressable>
				{/* Adding breed button + */}
				<Pressable onPress={() => setAddingModalVisible(true)} style={({ pressed }) => pressed && { opacity: 0.3 }}>
					<Text style={{ fontSize: 22, color: "#FFA000" }}>
						+
					</Text>
				</Pressable>
			</View>
			{/* Modal for selecting breed */}
			<Modal
				visible={breedOptionsModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setBreedOptionsModalVisible(false)}
			>
				{/* Overlay to close modal when tapping outside */}
				<Pressable
					style={styles.breedOverlay}
					onPress={() => setBreedOptionsModalVisible(false)}
				>
					<View style={{ ...styles.modalContainer }}>
						<View
							style={{
								...styles.modalView,
								maxHeight: "80%",
								paddingBlockEnd: 10,
							}}
						>
							<Text style={styles.breedTitle}>Seleccionar Raza</Text>
							<FlatList
								data={breedsOptions}
								keyExtractor={(item) => item.value.toString()}
								renderItem={({ item }) => (
									// Each breed item
									<Pressable
										onPress={() => handleSelection(item.value)}
										style={({ pressed }) => [
											styles.itemRow,
											item.value === value && styles.selectedRow,  // Apply styles for selected item row
											pressed && { opacity: 0.5 },  // Apply opacity when pressed
										]}
									>
										<Text
											style={[
												styles.itemRowText,
												item.value === value && styles.selectedRowText, // Apply styles for selected item text
											]}
										>
											{item.label}
										</Text>
									</Pressable>
								)}
							/>
						</View>
					</View>
				</Pressable>
			</Modal>
			{/* Modal for adding new breed */}
			<Modal visible={addingModalVisible} transparent animationType="slide">
				<View style={styles.modalContainer}>
					<View
						style={{
							...styles.modalView,
							paddingHorizontal: 15,
							paddingVertical: 10,
						}}
					>
						<Text style={styles.addingModalTitle}>Agregar nueva raza</Text>
						<TextInput
							placeholder="Nombre de la raza"
							value={newBreed.breed_name}
							onChangeText={(text) =>
								setNewBreed({ ...newBreed, breed_name: text })
							}
							style={styles.addingModalInputs}
						/>
						<TextInput
							placeholder="Descripción (opcional)"
							value={newBreed.description}
							onChangeText={(text) =>
								setNewBreed({ ...newBreed, description: text })
							}
							style={styles.addingModalInputs}
						/>
						<View style={styles.addingModalViewButtons}>
						<Pressable
							style={({ pressed }) => [styles.addingModalButtons, pressed && { opacity: 0.5 }]}
							onPress={() => handleCreateBreed()}
						>
							<Text style={styles.addingModalButtonText}>Guardar</Text>
						</Pressable>
						<Pressable
							style={({ pressed }) => [styles.addingModalButtons, pressed && { opacity: 0.5 }]}
							onPress={() => {
								setAddingModalVisible(false);
								setNewBreed({ breed_id: 0, breed_name: "", description: "" }); // Clear new breed input
							}}
						>
							<Text style={styles.addingModalButtonText}>Cancelar</Text>
						</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { marginVertical: 10 },
	// Dropdown styles
	label: { fontSize: 16, marginBottom: 5 },
	breedRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	breedDropdown: {
		borderWidth: 1,
		borderColor: "#37474F",
		borderRadius: 10,
		padding: 10,
		width: "95%",
		backgroundColor: "#fff",
	},
	selectedBreed: {
		fontSize: 16,
		color: "#333",
	},
	// Breed selection modal styles
	breedOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.25)",
		justifyContent: "center",
	},
	breedTitle: {
		fontSize: 18,
		fontWeight: "700",
		textAlign: "center",
		margin: 10,
	},
	itemRow: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		backgroundColor: "#fff",
	},
	itemRowText: {
		fontSize: 16,
		color: "#333",
	},
	selectedRow: {
		backgroundColor: "#e0f2f1",
	},
	selectedRowText: {
		color: "#2E7D32",
		fontWeight: "700", // Bold font weight for selected item
	},
	// Modal common styles
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	modalView: {
		backgroundColor: "white",
		margin: 30,
		borderRadius: 10,
	},
	// Styles for the adding modal
	addingModalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	addingModalInputs: {
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#37474F",
		padding: 8,
	},
	// Styles for the adding modal buttons
	addingModalViewButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	addingModalButtons: {
		flex: 1,
		padding: 10,
		marginHorizontal: 5,
		backgroundColor: "#007AFF",
		borderRadius: 5,
		alignItems: "center",
	},
	addingModalButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	loadingContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
});

