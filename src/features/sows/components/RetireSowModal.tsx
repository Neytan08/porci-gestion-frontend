import { memo, useState } from "react";
import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import {
	ActivityIndicator,
	Alert,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import RetireAction from "../../../shared/components/actions/retireAction";
import {
	localDateToUtcMidnight,
	utcIsoOrDateToLocalForDisplay,
} from "../../../shared/utils/dateHelpers";
import { retireSows } from "../api/sowsApi";

type RetireSowModalProps = {
	selectedIds: number | number[];
	onConfirm: () => void | Promise<void>;
	label?: string;
	size?: number;
	color?: string;
	hitSlop?: number;
	containerStyle?: StyleProp<ViewStyle>;
	imageStyle?: StyleProp<ImageStyle>;
};

const getDefaultRemovalDate = () => localDateToUtcMidnight(new Date());

function RetireSowModal({
	selectedIds,
	onConfirm,
	label,
	size = 42,
	color = "#616161",
	hitSlop = 10,
	containerStyle,
	imageStyle,
}: RetireSowModalProps) {
	const [visible, setVisible] = useState(false);
	const [datePickerVisible, setDatePickerVisible] = useState(false);
	const [removalDate, setRemovalDate] = useState<Date | null>(getDefaultRemovalDate);
	const [removalReason, setRemovalReason] = useState("");
	const [loading, setLoading] = useState(false);

	const ids = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
	const validIds = ids.filter((id) => Number.isFinite(id) && id > 0);
	const trimmedReason = removalReason.trim();
	const formattedDate = removalDate
		? utcIsoOrDateToLocalForDisplay(removalDate)?.toLocaleDateString("es-CR", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
				hour12: false,
			})
		: "";

	const resetForm = () => {
		setRemovalDate(getDefaultRemovalDate());
		setRemovalReason("");
		setDatePickerVisible(false);
	};

	const closeModal = () => {
		if (loading) return;
		setVisible(false);
		resetForm();
	};

	const handleDateConfirm = (selectedDate: Date) => {
		setDatePickerVisible(false);
		setRemovalDate(localDateToUtcMidnight(selectedDate));
	};

	const handleConfirm = async () => {
		if (validIds.length === 0) {
			Alert.alert("Error", "Debe seleccionar al menos una cerda.");
			return;
		}

		if (!removalDate || trimmedReason.length === 0) {
			Alert.alert(
				"Campos requeridos",
				"Debe completar la fecha de retiro y la razon del retiro.",
			);
			return;
		}

		setLoading(true);
		try {
			await retireSows(Array.isArray(selectedIds) ? validIds : validIds[0], {
				removal_date: removalDate.toISOString(),
				removal_reason: trimmedReason,
			});
			await onConfirm();
			setVisible(false);
			resetForm();
		} catch (error) {
			Alert.alert(
				"Error",
				getApiErrorMessage(error, {
					fallback: "No se pudo completar el retiro de la cerda.",
				}),
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<RetireAction
				onPress={() => setVisible(true)}
				label={label}
				size={size}
				color={color}
				containerStyle={containerStyle}
				imageStyle={imageStyle}
				hitSlop={hitSlop}
				accessibilityLabel="Retirar cerdas"
			/>
			<Modal
				visible={visible}
				transparent
				animationType="fade"
				onRequestClose={closeModal}
			>
				<View style={styles.modalOverlay}>
					<Pressable style={styles.overlay} onPress={closeModal} />
					<View style={styles.modalContainer}>
						<Text style={styles.title}>Retirar cerdas</Text>

						<Text style={styles.label}>Fecha de retiro</Text>
						<Pressable
							style={styles.select}
							onPress={() => setDatePickerVisible(true)}
							disabled={loading}
						>
							<Text style={[styles.selectText, !removalDate && styles.placeholder]}>
								{formattedDate || "Seleccionar fecha"}
							</Text>
						</Pressable>

						<Text style={styles.label}>Razon del retiro</Text>
						<TextInput
							value={removalReason}
							onChangeText={setRemovalReason}
							placeholder="Ingrese la razon del retiro"
							placeholderTextColor="#9E9E9E"
							style={styles.reasonInput}
							multiline
							editable={!loading}
							textAlignVertical="top"
						/>

						<View style={styles.actionsRow}>
							<Pressable
								style={({ pressed }) => [
									styles.cancelButton,
									pressed && styles.pressed,
								]}
								onPress={closeModal}
								disabled={loading}
							>
								<Text style={styles.cancelButtonText}>Cancelar</Text>
							</Pressable>
							<Pressable
								style={({ pressed }) => [
									styles.confirmButton,
									pressed && styles.pressed,
									loading && styles.disabledButton,
								]}
								onPress={handleConfirm}
								disabled={loading}
							>
								{loading ? (
									<ActivityIndicator size="small" color="#fff" />
								) : (
									<Text style={styles.confirmButtonText}>Retirar</Text>
								)}
							</Pressable>
						</View>
					</View>
				</View>

				<DateTimePickerModal
					isVisible={datePickerVisible}
					mode="date"
					date={utcIsoOrDateToLocalForDisplay(removalDate) ?? new Date()}
					onConfirm={handleDateConfirm}
					onCancel={() => setDatePickerVisible(false)}
					locale="es-ES"
					confirmTextIOS="Aceptar"
					cancelTextIOS="Cancelar"
				/>
			</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.25)",
	},
	modalContainer: {
		width: "100%",
		maxWidth: 360,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 16,
	},
	title: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
	label: { fontSize: 15, marginBottom: 6 },
	select: {
		borderWidth: 1,
		borderColor: "#37474F",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginBottom: 15,
		backgroundColor: "#fff",
	},
	selectText: { fontSize: 15, color: "#263238" },
	placeholder: { color: "#9E9E9E" },
	reasonInput: {
		minHeight: 86,
		borderWidth: 1,
		borderColor: "#37474F",
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 12,
		marginBottom: 15,
		backgroundColor: "#fff",
		fontSize: 15,
		color: "#263238",
	},
	actionsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		gap: 10,
	},
	cancelButton: {
		minWidth: 100,
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 10,
		alignItems: "center",
		backgroundColor: "#ECEFF1",
	},
	confirmButton: {
		minWidth: 100,
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 10,
		alignItems: "center",
		backgroundColor: "#2E7D32",
	},
	disabledButton: {
		opacity: 0.7,
	},
	cancelButtonText: { color: "#263238", fontWeight: "700" },
	confirmButtonText: { color: "#fff", fontWeight: "700" },
	pressed: { opacity: 0.5 },
});

export default memo(RetireSowModal);
