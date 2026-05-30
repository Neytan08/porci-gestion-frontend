import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ListAction from "../../../shared/components/actions/listAction";
import RowCheckbox from "../../../shared/components/selection/rowCheckBox";
import type { MatingEvent } from "../api/matingEventApi";

type MatingEventListItemProps = {
	item: MatingEvent;
	/** Whether the contextual actions modal is open for this specific row. */
	isActive: boolean;
	/** Whether this event is part of the current multi-selection set. */
	selected: boolean;
	/** Toggle this event in the multi-selection set. */
	onToggleSelect: () => void;
	/** Open the contextual actions modal for this event. */
	onOpenActions: () => void;
};

/**
 * List row component for a single MatingEvent entry in MatingEventsScreen.
 * Supports multi-selection and contextual actions.
 */
function MatingEventListItem({
	item,
	isActive,
	selected,
	onToggleSelect,
	onOpenActions,
}: MatingEventListItemProps) {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.pressableRow,
				pressed && { backgroundColor: "#e0e0e0", opacity: 0.6 },
			]}
		>
			<View style={[styles.contentRow, isActive && styles.contentRowActive]}>
				<RowCheckbox
					selected={selected}
					onPress={onToggleSelect}
					size={18}
					radius={4}
					width={1}
					color={"#eee"}
					style={styles.checkBox}
				/>
				<Text style={[styles.textCell, { flexBasis: "50%" }]}>
					<Text style={{ fontWeight: "700" }}>Cerda: </Text>
					{item.breedingsows?.sow_tag_number ?? item.sow_id}
				</Text>
				<Text style={[styles.textCell, { flexBasis: "50%" }]}>
					<Text style={{ fontWeight: "700" }}>Verraco: </Text>
					{item.boars?.boar_tag_number ?? "N/A"}
				</Text>
				<Text style={[styles.textCell, { flexBasis: "50%" }]}>
					<Text style={{ fontWeight: "700" }}>Fecha: </Text>
					{item.insemination_date
						? item.insemination_date.split("T")[0]
						: "-"}
				</Text>
				<Text style={[styles.textCell, { flexBasis: "50%" }]}>
					<Text style={{ fontWeight: "700" }}>Tipo: </Text>
					{item.insemination_type ?? "-"}
				</Text>
				<Text style={[styles.textCell, { flexBasis: "100%" }]}>
					<Text style={{ fontWeight: "700" }}>Notas: </Text>
					{item.notes ?? "-"}
				</Text>
				<View style={styles.detailsButton}>
					<ListAction onPress={onOpenActions} />
				</View>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	pressableRow: {
		flexDirection: "row",
		borderRadius: 10,
		marginBottom: 5,
	},
	contentRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingVertical: 12,
		paddingHorizontal: 15,
		backgroundColor: "#fff",
		borderRadius: 10,
		margin: 5,
		borderWidth: 1,
		borderColor: "#eee",
	},
	contentRowActive: {
		backgroundColor: "#e2e2e2",
	},
	textCell: {
		color: "#333",
		fontSize: 14,
		marginBottom: 2,
	},
	checkBox: {
		position: "absolute",
		left: -4,
		top: -3,
	},
	detailsButton: {
		width: "101%",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		minHeight: 40,
		marginTop: -20,
		marginBottom: -5,
		marginRight: -20,
	},
});

export default memo(MatingEventListItem);
