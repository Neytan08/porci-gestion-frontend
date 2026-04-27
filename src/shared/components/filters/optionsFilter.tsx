import type React from "react";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FilteringOptionsFormat = { value: number; label: string };

type FilteringProps = {
	options: FilteringOptionsFormat[];
	selectedId: number | null;
	onChange: (id: number | null) => void;
	title?: string;
	allLabel?: string;
};

const OptionsFilter: React.FC<FilteringProps> = ({
	options,
	selectedId,
	onChange,
	title = "Opciones",
	allLabel = "Todos",
}) => {
	return (
		<View>
			<Text style={styles.sectionTitle}>{title}</Text>
			<Pressable
				style={styles.optionRow}
				onPress={() => onChange(null)}
				accessibilityRole="button"
				accessibilityLabel={`Seleccionar ${allLabel}`}
			>
				<Text style={[styles.optionText, styles.optionAll]}>{allLabel}</Text>
			</Pressable>

			{options.map((opt) => (
				<Pressable
					key={opt.value}
					style={styles.optionRow}
					onPress={() => onChange(opt.value)}
				>
					<Text
						style={[
							styles.optionText,
							selectedId === opt.value && styles.optionSelected,
						]}
					>
						{opt.label}
					</Text>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: 17,
		fontWeight: "700",
		color: "#555",
		marginTop: 8,
		marginBottom: 4,
	},
	optionRow: {
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#eee",
	},
	optionText: { fontSize: 16, color: "#333" },
	optionSelected: { color: "#2E7D32", fontWeight: "700" },
	optionAll: { color: "#555" },
});

export default memo(OptionsFilter);
