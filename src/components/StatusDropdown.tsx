import type React from "react";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getStatus, type Status } from "../api/statusApi";

// What StatusDropdown expects as props
type StatusDropdownProps = {
	value: number | null;
	onChange: (value: number) => void;
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

	useEffect(() => {
		fetchStatus();
	}, []);

	// Fetch status from API
	const fetchStatus = async () => {
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
	};

	// Show loading indicator while fetching data
	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" />
				<Text>Cargando estados...</Text>
			</View>
		);
	}

	// Handle selection of a status
	const handleSelection = (itemValue: number) => {
		onChange(itemValue);
		setStatusModalVisible(false);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{"Estado *"}</Text>
			{/* Dropdown to open modal and show selected status */}
			<TouchableOpacity
				onPress={() => setStatusModalVisible(true)}
				style={styles.dropdown}
			>
				<Text style={styles.selectedStatus}>
					{statusOptions.find((item) => item.value === value)?.label ||
						"Seleccionar estado..."}
				</Text>
			</TouchableOpacity>
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
								<TouchableOpacity
									onPress={() => handleSelection(item.value)}
									style={[
										styles.itemRow,
										item.value === value && styles.selectedRow, // Apply styles for selected item row
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
								</TouchableOpacity>
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
