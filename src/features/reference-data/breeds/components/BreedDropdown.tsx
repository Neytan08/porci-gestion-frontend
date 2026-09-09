import { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import AddAction from "../../../../shared/components/actions/addAction";
import { useBreedOptions } from "../hooks/useBreedOptions";
import type { Breed } from "../model/breed";
import { CreateBreedModal } from "./CreateBreedModal";

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

export const BreedDropdown = ({
	value,
	onChange,
}: BreedDropdownProps) => {
	// Stores the remote breed options and exposes a local append helper after creation.
	const { options: breedsOptions, loading, appendOption } = useBreedOptions();
	// Controls the modal used to register a brand-new breed.
	const [addingModalVisible, setAddingModalVisible] = useState(false);
	// Controls the modal that lists the existing breeds for selection.
	const [breedOptionsModalVisible, setBreedOptionsModalVisible] = useState(false);
	// Resolves the label shown in the trigger based on the selected breed id.
	const selectedBreedLabel =
		breedsOptions.find((item) => item.value === value)?.label ?? "Seleccionar raza...";

	// Show loading indicator while fetching data
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" />
				<Text>Cargando razas...</Text>
			</View>
		);
	}

	const handleSelection = (itemValue: number) => {
		const selected = breedsOptions.find((b) => b.value === itemValue);
		onChange(itemValue, selected?.label ?? "");
		setBreedOptionsModalVisible(false);
	};

	const handleBreedCreated = (createdBreed: Breed) => {
		appendOption(createdBreed);
		onChange(createdBreed.breed_id, createdBreed.breed_name);
		setAddingModalVisible(false);
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
					<Text style={styles.selectedBreed}>{selectedBreedLabel}</Text>
				</Pressable>
				{/* Adding breed button + */}
				<AddAction
					onPress={() => setAddingModalVisible(true)}
					size={35}
					color="#2E7D32"
					accessibilityLabel="Agregar raza"
					pressedStyle={{ opacity: 0.3 }}
					containerStyle={{ marginLeft: 10 }}
				/>
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
								paddingBottom: 10,
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
			<CreateBreedModal
				visible={addingModalVisible}
				breedOptions={breedsOptions}
				onClose={() => setAddingModalVisible(false)}
				onCreated={handleBreedCreated}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { marginVertical: 10 },
	// Dropdown styles
	label: { fontSize: 16, marginBottom: 5 },
	breedRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	breedDropdown: {
		borderWidth: 1,
		borderColor: "#37474F",
		borderRadius: 10,
		padding: 10,
		width: "90%",
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
	loadingContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
});

