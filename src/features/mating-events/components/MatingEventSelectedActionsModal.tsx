import { memo } from "react";
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import UpdatePregnancyResultModal from "./UpdatePregnancyResultModal";

type MatingEventSelectedActionsModalProps = {
	visible: boolean;
	selectedCount: number;
	selectedIds: number[];
	onUpdateConfirm: () => void;
	onClose: () => void;
	onDeselect: () => void;
};

/**
 * Bottom-sheet modal for batch operations on a selection of mating events.
 * Exposes: update pregnancy result, PDF export (placeholder), clear selection.
 */
function MatingEventSelectedActionsModal({
	visible,
	selectedCount,
	selectedIds,
	onUpdateConfirm,
	onClose,
	onDeselect,
}: MatingEventSelectedActionsModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<Pressable style={styles.overlay} onPress={onClose}>
				<View style={styles.sheet}>
					<Text
						style={styles.title}
					>{`Inseminaciones Seleccionadas (${selectedCount})`}</Text>
					<View style={styles.btnRow}>
						<UpdatePregnancyResultModal
							onConfirm={() => {
								onUpdateConfirm();
								onClose();
							}}
							selectedIds={selectedIds}
							size={42}
							label="Actualizar estado"
						/>
						<Pressable
							style={styles.btn}
							onPress={() => Alert.alert("Función no implementada")}
						>
							<Image
								source={require("../../../../assets/icons/pdf-file.png")}
								style={styles.icon}
								resizeMode="contain"
							/>
							<Text style={{ fontWeight: "700", textAlign: "center" }}>
								Extraer a PDF
							</Text>
						</Pressable>
						<Pressable
							style={styles.btn}
							onPress={() => {
								onDeselect();
								onClose();
							}}
						>
							<Image
								source={require("../../../../assets/icons/uncheck.png")}
								style={styles.icon}
								resizeMode="contain"
							/>
							<Text style={{ fontWeight: "700", textAlign: "center" }}>
								Limpiar selección
							</Text>
						</Pressable>
					</View>
				</View>
			</Pressable>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.25)",
		justifyContent: "flex-end",
	},
	sheet: {
		backgroundColor: "#fff",
		paddingTop: 12,
		paddingBottom: 8,
		paddingHorizontal: 16,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: "700",
		marginBottom: 8,
	},
	btnRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 10,
		marginTop: 12,
		marginBottom: 6,
	},
	btn: {
		flex: 1,
		alignItems: "center",
	},
	icon: { width: 42, height: 42 },
});

export default memo(MatingEventSelectedActionsModal);
