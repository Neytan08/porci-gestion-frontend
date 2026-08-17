import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback } from "react";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import { useDeleteEntity } from "../../../shared/hooks/useDeleteEntity";
import { deleteMatingEvent, type MatingEvent } from "../api/matingEventApi";

type MatingEventsNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"MatingEvents"
>;

interface MatingEventModalCallbacks {
	openDeleteModal: (event: MatingEvent) => void;
	closeActionsModal: () => void;
	closeDeleteModal: () => void;
}

interface UseMatingEventActionsParams {
	navigation: MatingEventsNavigationProp;
	/** Reloads the events list; called after a successful deletion. */
	loadAll: () => Promise<void>;
	modals: MatingEventModalCallbacks;
	eventToDelete: MatingEvent | null;
}

interface UseMatingEventActionsReturn {
	handleAdd: () => void;
	handleDetails: (eventId: number, selectedEventCount?: number) => void;
	handleMatingAction: (
		action: "edit" | "delete" | "moreDetails",
		event: MatingEvent,
	) => void;
	confirmDelete: () => Promise<void>;
	deleting: boolean;
}

/**
 * Hook for managing mating event navigation and delete operations.
 * Centralises navigation callbacks and useDeleteEntity setup
 * so the screen acts purely as an orchestrator.
 */
export function useMatingEventActions({
	navigation,
	loadAll,
	modals,
	eventToDelete,
}: UseMatingEventActionsParams): UseMatingEventActionsReturn {
	const { openDeleteModal, closeActionsModal, closeDeleteModal } = modals;

	const { deleting, deleteById } = useDeleteEntity<number>({
		deleteFn: deleteMatingEvent,
		onDeleted: loadAll,
		messages: {
			successTitle: "Eliminación completada",
			successMessage: "El evento de inseminación fue eliminado correctamente.",
			errorTitle: "Error",
			errorMessage:
				"No se pudo eliminar el evento de inseminación. Intente nuevamente.",
		},
	});

	const handleAdd = useCallback(() => {
		navigation.navigate("AddMatingEvent");
	}, [navigation]);

	const handleDetails = useCallback(
		(eventId: number, selectedEventCount?: number) => {
			navigation.navigate("DetailsMatingEvent", { eventId, selectedEventCount });
		},
		[navigation],
	);

	const handleMatingAction = useCallback(
		(action: "edit" | "delete" | "moreDetails", event: MatingEvent) => {
			closeActionsModal();
			if (action === "edit") {
				navigation.navigate("EditMatingEvent", { eventId: event.mating_id });
			} else if (action === "moreDetails") {
				navigation.navigate("DetailsMatingEvent", { eventId: event.mating_id });
			} else if (action === "delete") {
				openDeleteModal(event);
			}
		},
		[navigation, openDeleteModal, closeActionsModal],
	);

	const confirmDelete = useCallback(async () => {
		if (!eventToDelete) return;
		closeDeleteModal();
		await deleteById(eventToDelete.mating_id);
	}, [eventToDelete, closeDeleteModal, deleteById]);

	return {
		handleAdd,
		handleDetails,
		handleMatingAction,
		confirmDelete,
		deleting,
	};
}
