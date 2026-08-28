import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { BREEDING_SOW_STATUSES,	type SelectableBreedingSowStatus } from "../model/sow";

/**
 * StatusDropdown is a reusable component that allows users to select a status
 * from the fixed BreedingSow status list. It displays the currently selected status
 * and opens a modal with all available statuses when pressed.
 * Props:
 * - value: The currently selected status value or null if no status is selected.
 * - onChange: A callback function that is called when a new status is selected.
 */
type StatusDropdownProps = {
	value: SelectableBreedingSowStatus | null;
	onChange: (value: SelectableBreedingSowStatus) => void;
};

export const StatusDropdown = ({
	value,
	onChange,
}: StatusDropdownProps) => {
	const [statusModalVisible, setStatusModalVisible] = useState(false);
	const statusOptions = useMemo(() => {
		// Convert the status object to dropdown options while excluding retired sows from manual selection.
		const allowed = Object.values(BREEDING_SOW_STATUSES).filter(
			(status): status is SelectableBreedingSowStatus =>
				status !== BREEDING_SOW_STATUSES.retirada,
		);
		return allowed.map((status) => ({ label: status, value: status }));
	}, []);
	
	const handleSelection = (itemValue: SelectableBreedingSowStatus) => {
		onChange(itemValue);
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
										item.value === value && styles.selectedRow,
										pressed && { opacity: 0.5 },
									]}
								>
									<Text
										style={[
											styles.itemRowText,
											item.value === value && styles.selectedRowText,
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
	statusOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.25)",
		justifyContent: "center",
	},
	modalContainer: {
		backgroundColor: "#fff",
		margin: 30,
		borderRadius: 10,
		paddingBottom: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		textAlign: "center",
		margin: 10,
	},
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
});
