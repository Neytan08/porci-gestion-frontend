import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { getStatus, type Status } from "../api/statusApi";

/**
 * StatusDropdown is a reusable component that allows users to select a status
 * from a list of options fetched from the API. It displays the currently selected status
 * and opens a modal with all available statuses when pressed. 
 * The component handles loading states and provides feedback while fetching data.
 * Props:
 * - value: The currently selected status ID (number) or null if no status is selected.
 * - onChange: A callback function that is called when a new status is selected. 
 *   It receives the selected status ID and label as parameters.
 */
type StatusDropdownProps = {
	value: number | null;
	onChange: (value: number, label: string) => void;
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
	value,
	onChange,
}) => {
	const [statusOptions, setStatusOptions] = useState<
		{ label: string; value: number }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [statusModalVisible, setStatusModalVisible] = useState(false);

	const fetchStatus = useCallback(async () => {
		try {
			const data = await getStatus();
			const mapped = data.map((item: Status) => ({
				label: item.status_name,
				value: item.status_id,
			}));
			setStatusOptions(mapped);
		} catch (error) {
			console.error("Error cargando estados:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchStatus();
	}, [fetchStatus]);

	// Show loading indicator while fetching data
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" />
				<Text>Cargando estados...</Text>
			</View>
		);
	}

	// Handle status selection: find the label for the selected value and notify the parent
	const handleSelection = (itemValue: number) => {
		const selected = statusOptions.find((s) => s.value === itemValue);
		onChange(itemValue, selected?.label ?? "");
		setStatusModalVisible(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{"Estado *"}</Text>
			{/* Dropdown to open modal and show selected status */}
			<Pressable
				onPress={() => setStatusModalVisible(true)}
				style={({ pressed }) => [styles.dropdown, pressed && { opacity: 0.3 }]}
			>
				<Text style={styles.selectedStatus}>
					{statusOptions.find((item) => item.value === value)?.label ||
						"Seleccionar estado..."}
				</Text>
			</Pressable>
			{/* Modal for selecting status */}
			<Modal
				visible={statusModalVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setStatusModalVisible(false)}
			>
				{/* Modal overlay to close modal on press outside */}
				<Pressable
					style={styles.statusOverlay}
					onPress={() => setStatusModalVisible(false)}
				>
					{/* Modal content */}
					<View style={styles.modalContainer}>
						<Text style={styles.title}>Seleccionar Estado</Text>
						<FlatList
							data={statusOptions}
							keyExtractor={(item) => item.value.toString()}
							renderItem={({ item }) => (
								// Each status item
								<Pressable
									onPress={() => handleSelection(item.value)}
									style={({ pressed }) => [
										styles.itemRow,
										item.value === value && styles.selectedRow, // Apply styles for selected item row
										pressed && { opacity: 0.5 },
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
				</Pressable>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 10,
	},
	// Dropdown styles
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
	dropdown: {
		borderWidth: 1,
		borderColor: "#37474F",
		borderRadius: 10,
		padding: 10,
		backgroundColor: "#fff",
	},
	selectedStatus: {
		fontSize: 16,
		color: "#333",
	},
	// Modal styles
	statusOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.25)",
		justifyContent: "center",
	},
	modalContainer: {
		backgroundColor: "#fff",
		margin: 30,
		borderRadius: 10,
		paddingBlockEnd: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		textAlign: "center",
		margin: 10,
	},
	// Items styles
	itemRow: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		backgroundColor: "#fff",
	},
	selectedRow: {
		backgroundColor: "#e0f2f1",
	},
	itemRowText: {
		fontSize: 16,
		color: "#333",
	},
	selectedRowText: {
		color: "#2E7D32",
		fontWeight: "700",
	},
	// Loading container styles
	loadingContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
});
