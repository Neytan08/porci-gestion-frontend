import { useState } from "react";
import { Alert } from "react-native";

// Types for customizable messages
type Messages = {
	successTitle?: string;
	successMessage?: string;
	errorTitle?: string;
	errorMessage?: string;
};

/* Parameters for the hook
    deleteFn: accepts a function that receives an ID and returns a Promise
    onDeleted: optional callback after successful deletion
    messages: optional custom messages for success and error alerts
*/
interface UseDeleteEntityParams<TId> {
	deleteFn: (id: TId) => Promise<any>; // Holds the entity delete function
	onDeleted?: () => Promise<void> | void; // e.g., reload list
	messages?: Messages; // Customizable messages
}

/*
 * Hook to handle entity deletion with feedback
 * Receives a TId generic type parameter
 * Returns deleting state and deleteById function
 */
export function useDeleteEntity<TId = number>({
	deleteFn,
	onDeleted,
	messages,
}: UseDeleteEntityParams<TId>) {
	const [deleting, setDeleting] = useState(false);

	// Function to delete an entity by ID
	const deleteById = async (id: TId) => {
		try {
			setDeleting(true);
			await deleteFn(id); // Call the provided delete function
			if (onDeleted) await onDeleted();
			Alert.alert(
				messages?.successTitle ?? "Eliminación completada",
				messages?.successMessage ?? "Se eliminó correctamente.",
			);
		} catch (err) {
			console.error("Error deleting entity:", err);
			Alert.alert(
				messages?.errorTitle ?? "Error",
				messages?.errorMessage ?? "No se pudo eliminar. Intente nuevamente.",
			);
			throw err;
		} finally {
			setDeleting(false);
		}
	};

	// Return the deleting state and deleteById function
	return { deleting, deleteById } as const;
}
