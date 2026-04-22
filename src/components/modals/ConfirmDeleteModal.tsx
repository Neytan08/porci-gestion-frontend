import type React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

/**
 * ConfirmDeleteModal is a reusable component that displays a confirmation dialog when the user attempts to delete an entity.
 * Props:
 * - visible: Controls the visibility of the modal.
 * - name: Optional name of the entity being deleted, used in the default message.
 * - title: Optional custom title for the modal.
 * - message: Optional custom message. If not provided, a default message using the name will be shown.
 * - confirmText: Text for the confirm button (default: "Eliminar").
 * - cancelText: Text for the cancel button (default: "Cancelar").
 * - loading: If true, disables the confirm button and shows a loading state.
 * - onConfirm: Callback function called when the user confirms deletion. Can return a promise for async actions.
 * - onCancel: Callback function called when the user cancels deletion.
 */
interface ConfirmDeleteModalProps {
	visible: boolean;
	name?: string | number | null;
	title?: string;
	message?: string | React.ReactNode; // Message can be a string or any React node (allow bold parts, links, etc.)
	confirmText?: string;
	cancelText?: string;
	loading?: boolean;
	onConfirm: () => void | Promise<void>;
	onCancel: () => void;
}

// Modal component to confirm deletion of an entity
export default function ConfirmDeleteModal({
	visible,
	name,
	title,
	message,
	confirmText = "Eliminar",
	cancelText = "Cancelar",
	loading = false,
	onConfirm,
	onCancel,
}: ConfirmDeleteModalProps) {
	const resolvedMessage =
		message ??
		`Seguro que desea eliminar ${name ? `a ${name}` : "este registro"}?`;
	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<View style={styles.card}>
					{!!title && <Text style={styles.title}>{title}</Text>}
					{/*  
                        You can pass a string for simple messages or a React node for complex formatting
                        You can use <Text> components with styles for bold, links, etc.
                    */}
					{typeof resolvedMessage === "string" ? (
						<Text style={styles.message}>{resolvedMessage}</Text>
					) : (
						<View style={styles.messageContainer}>{resolvedMessage}</View>
					)}
					<View style={styles.row}>
						<Pressable
							style={({ pressed }) => [
								styles.button,
								{ backgroundColor: "#ac0202ff" },
								loading && styles.disabled,
								pressed && styles.pressed,
							]}
							onPress={onConfirm}
							disabled={loading}
							accessibilityRole="button"
							accessibilityLabel={`${confirmText} ${name ?? "registro"}`}
						>
							<Text style={styles.buttonText}>{confirmText}</Text>
						</Pressable>
						<Pressable
							style={({ pressed }) => [
								styles.button,
								{ backgroundColor: "#007AFF" },
								pressed && styles.pressed,
							]}
							onPress={onCancel}
							accessibilityRole="button"
							accessibilityLabel={cancelText}
						>
							<Text style={styles.buttonText}>{cancelText}</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	card: {
		backgroundColor: "white",
		padding: 20,
		margin: 20,
		borderRadius: 10,
	},
	title: {
		fontWeight: "bold",
		fontSize: 18,
		marginBottom: 8,
	},
	message: {
		fontSize: 16,
		marginBottom: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	button: {
		flex: 1,
		padding: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		alignItems: "center",
	},
	disabled: {
		opacity: 0.7,
	},
	pressed: {
		opacity: 0.8,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	messageContainer: {
		marginBottom: 10,
	},
});
