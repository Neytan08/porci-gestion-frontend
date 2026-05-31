import { useCallback, useState } from "react";
import { Alert } from "react-native";

import type { UseDeleteEntityParams } from "../types";

/**
 * Shared hook for deleting an entity and showing user feedback.
 * The entity-specific delete function is injected from the caller.
 */
export function useDeleteEntity<TId = number>({
	deleteFn,
	onDeleted,
	messages,
}: UseDeleteEntityParams<TId>) {
	const [deleting, setDeleting] = useState(false);

	const deleteById = useCallback(async (id: TId) => {
		try {
			setDeleting(true);
			await deleteFn(id);

			if (onDeleted) {
				await onDeleted();
			}

			Alert.alert(
				messages?.successTitle ?? "Eliminación completada",
				messages?.successMessage ?? "Se eliminó correctamente.",
			);
		} catch (error) {
			console.error("Error deleting entity:", error);
			Alert.alert(
				messages?.errorTitle ?? "Error",
				messages?.errorMessage ?? "No se pudo eliminar. Intente nuevamente.",
			);
			throw error;
		} finally {
			setDeleting(false);
		}
	}, [deleteFn, messages, onDeleted]);

	return { deleting, deleteById } as const;
}
