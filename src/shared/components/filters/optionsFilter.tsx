import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FilteringOptionValue = string | number;

type FilteringOptionsFormat<TValue extends FilteringOptionValue> = {
	value: TValue;
	label: string;
};

type FilteringProps<TValue extends FilteringOptionValue> = {
	options: FilteringOptionsFormat<TValue>[];
	selectedId: TValue | null;
	onChange: (id: TValue | null) => void;
	title?: string;
	allLabel?: string;
};

function OptionsFilter<TValue extends FilteringOptionValue>({
	options,
	selectedId,
	onChange,
	title = "Opciones",
	allLabel = "Todos",
}: FilteringProps<TValue>) {
	return (
		<View style={styles.container}>
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
					onPress={() => onChange(opt.value)}
					style={({ pressed }) => [
						styles.optionRow,
						selectedId === opt.value && styles.optionRowSelected,
						pressed && { opacity: 0.5 },
					]}
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
}

const styles = StyleSheet.create({
	container: { paddingHorizontal: 0 },
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
	optionText: { fontSize: 16, color: "#333", paddingLeft: 10 },
	optionRowSelected: { backgroundColor: "#e0f2f1" },
	optionSelected: { color: "#2E7D32", fontWeight: "700" },
	optionAll: { color: "#555" },
});

export default memo(OptionsFilter) as typeof OptionsFilter;
