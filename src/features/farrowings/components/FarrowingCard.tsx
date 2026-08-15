import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatIsoDate } from "../../../shared/utils/dateHelpers";
import type { Farrowing } from "../model/farrowing";

type FarrowingCardProps = {
	item: Farrowing;
};

const numberOrDash = (value: number | null | undefined) => value ?? "-";

/**
 * Compact read-only card for a farrowing record.
 * It intentionally hides internal identifiers that do not help the user in this context.
 */
function FarrowingCard({ item }: FarrowingCardProps) {
	return (
		<View style={styles.card}>
			<View style={styles.headerRow}>
				<Text style={styles.title}>Parto</Text>
				<Text style={styles.date}>{formatIsoDate(item.farrowing_date)}</Text>
			</View>

			<View style={styles.grid}>
				<Text style={styles.cell}>
					<Text style={styles.label}>Machos: </Text>
					{numberOrDash(item.male_piglets)}
				</Text>
				<Text style={styles.cell}>
					<Text style={styles.label}>Hembras: </Text>
					{numberOrDash(item.female_piglets)}
				</Text>
				<Text style={styles.cell}>
					<Text style={styles.label}>Vivos: </Text>
					{numberOrDash(item.live_births)}
				</Text>
				<Text style={styles.cell}>
					<Text style={styles.label}>Muertos: </Text>
					{numberOrDash(item.still_births)}
				</Text>
				<Text style={styles.cell}>
					<Text style={styles.label}>Momias: </Text>
					{numberOrDash(item.mummies)}
				</Text>
				<Text style={styles.cell}>
					<Text style={styles.label}>Destetados: </Text>
					{numberOrDash(item.weaned_piglets)}
				</Text>
				<Text style={styles.cellWide}>
					<Text style={styles.label}>Fecha de destete: </Text>
					{formatIsoDate(item.weaning_date)}
				</Text>
				<Text style={styles.cellWide}>
					<Text style={styles.label}>Notas: </Text>
					{item.notes?.trim() ? item.notes : "-"}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#eee",
		marginHorizontal: 5,
		marginBottom: 8,
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	title: {
		color: "#2E7D32",
		fontSize: 16,
		fontWeight: "700",
	},
	date: {
		color: "#333",
		fontSize: 14,
		fontWeight: "700",
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	cell: {
		color: "#333",
		flexBasis: "50%",
		fontSize: 14,
		marginBottom: 3,
	},
	cellWide: {
		color: "#333",
		flexBasis: "100%",
		fontSize: 14,
		marginTop: 2,
	},
	label: {
		fontWeight: "700",
	},
});

export default memo(FarrowingCard);
