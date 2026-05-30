import { memo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import DeleteAction from "../../../shared/components/actions/deleteAction";
import type { MatingEvent } from "../api/matingEventApi";
import UpdatePregnancyResultModal from "./UpdatePregnancyResultModal";

type MatingEventActionsModalProps = {
	visible: boolean;
	event: MatingEvent | null;
	onUpdateConfirm: () => void;
	onDelete: () => void;
	onClose: () => void;
};

/**
 * Contextual actions modal for a single mating event row in MatingEventsScreen.
 * Renders UpdatePregnancyResult and Delete action buttons.
 */
function MatingEventActionsModal({
	visible,
	event,
	onUpdateConfirm,
	onDelete,
	onClose,
}: MatingEventActionsModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.container}>
				<Pressable style={styles.overlay} onPress={onClose} />
				<View style={styles.panel}>
					<Text style={styles.title}>Acciones Disponibles</Text>
					<View style={styles.actions}>
						<UpdatePregnancyResultModal
							onConfirm={() => {
								onUpdateConfirm();
								onClose();
							}}
							selectedIds={event ? [event.mating_id] : []}
							size={25}
						/>
						<DeleteAction onPress={onDelete} />
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.2)",
	},
	panel: {
		minWidth: 300,
		marginHorizontal: 16,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 12,
		elevation: 10,
		shadowColor: "#000",
		shadowOpacity: 0.15,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 8,
	},
	title: {
		fontWeight: "700",
		marginBottom: 8,
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});

export default memo(MatingEventActionsModal);
