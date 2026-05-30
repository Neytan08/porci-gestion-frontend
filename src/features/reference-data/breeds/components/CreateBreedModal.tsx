import { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
	areStringsEqual,
	containsSpecialCharacters,
} from "../../../../shared/utils/stringHelpers";
import { createBreed } from "../api/breedApi";
import type { BreedOption } from "../hooks/useBreedOptions";
import type { Breed } from "../model/breed";

type CreateBreedModalProps = {
	visible: boolean;
	breedOptions: BreedOption[];
	onClose: () => void;
	/**
	 * Returns the freshly created breed so the parent can update its local options
	 * and mark it as the current selection without a full refetch.
	 */
	onCreated: (breed: Breed) => void;
};

const createEmptyBreed = (): Breed => ({
	breed_id: 0,
	breed_name: "",
	description: "",
});

/**
 * Encapsulates the creation flow for a new breed, including local form state,
 * validation, persistence and notifying the parent when creation succeeds.
 */
export function CreateBreedModal({
	visible,
	breedOptions,
	onClose,
	onCreated,
}: CreateBreedModalProps) {
	const [newBreed, setNewBreed] = useState<Breed>(createEmptyBreed);

	const isDuplicate = breedOptions.some((option) =>
		areStringsEqual(option.label, newBreed.breed_name),
	);

	const resetForm = () => {
		setNewBreed(createEmptyBreed());
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleCreateBreed = async () => {
		const trimmedBreedName = newBreed.breed_name.trim();
		const trimmedDescription = newBreed.description?.trim() ?? "";

		if (!trimmedBreedName || containsSpecialCharacters(newBreed.breed_name)) {
			Alert.alert(
				"Error",
				"El nombre de la raza es obligatorio y no debe contener caracteres especiales.",
			);
			return;
		}

		if (isDuplicate) {
			Alert.alert("Error", "Ya existe una raza con ese nombre.");
			return;
		}

		try {
			const createdBreed = await createBreed({
				...newBreed,
				breed_name: trimmedBreedName,
				description: trimmedDescription,
			});

			Alert.alert("Exito", "Raza agregada correctamente.");
			onCreated(createdBreed);
			handleClose();
		} catch (error) {
			console.error("Error creating breed:", error);
		}
	};

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
			<View style={styles.modalContainer}>
				<View style={styles.modalView}>
					<Text style={styles.title}>Agregar nueva raza</Text>
					<TextInput
						placeholder="Nombre de la raza"
						value={newBreed.breed_name}
						onChangeText={(breedName) =>
							setNewBreed((currentBreed) => ({
								...currentBreed,
								breed_name: breedName,
							}))
						}
						style={styles.input}
						autoFocus
					/>
					<TextInput
						placeholder="Descripcion (opcional)"
						value={newBreed.description}
						onChangeText={(description) =>
							setNewBreed((currentBreed) => ({
								...currentBreed,
								description,
							}))
						}
						style={styles.input}
					/>
					<View style={styles.actionsRow}>
						<Pressable
							style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
							onPress={handleCreateBreed}
						>
							<Text style={styles.actionButtonText}>Guardar</Text>
						</Pressable>
						<Pressable
							style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
							onPress={handleClose}
						>
							<Text style={styles.actionButtonText}>Cancelar</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	modalView: {
		backgroundColor: "#fff",
		margin: 30,
		borderRadius: 10,
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	input: {
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#37474F",
		padding: 8,
	},
	actionsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	actionButton: {
		flex: 1,
		padding: 10,
		marginHorizontal: 5,
		backgroundColor: "#FFA000",
		borderRadius: 5,
		alignItems: "center",
	},
	actionButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	pressed: {
		opacity: 0.5,
	},
});