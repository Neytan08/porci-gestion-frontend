import type React from "react";
import { memo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export type PregnancyResult = "Pendiente" | "Positivo" | "Negativo";
const OPTIONS: PregnancyResult[] = ["Pendiente", "Positivo", "Negativo"];

type Props = {
	label?: string;
	value?: PregnancyResult;
	onChange: (value: PregnancyResult | undefined) => void;
	placeholder?: string;
};

const PregnancyResultPicker: React.FC<Props> = ({
	label = "Resultado Inseminación",
	value,
	onChange,
	placeholder = "Seleccionar resultado",
}) => {
	const [visible, setVisible] = useState(false);

	return (
		<View>
			<Text style={styles.label}>{label}</Text>
			<Pressable style={styles.select} onPress={() => setVisible(true)}>
				<Text style={[styles.selectText, !value && styles.placeholder]}>
					{value ?? placeholder}
				</Text>
			</Pressable>

			<Modal
				visible={visible}
				transparent
				animationType="fade"
				onRequestClose={() => setVisible(false)}
			>
				<Pressable style={styles.overlay} onPress={() => setVisible(false)}>
					<View style={styles.sheet}>
						<Text style={styles.title}>{label}</Text>

						<Pressable
							style={styles.optionRow}
							onPress={() => {
								onChange(undefined);
								setVisible(false);
							}}
						>
							<Text style={[styles.optionText, styles.optionAll]}>
								— Sin seleccionar —
							</Text>
						</Pressable>

						{OPTIONS.map((opt) => (
							<Pressable
								key={opt}
								style={styles.optionRow}
								onPress={() => {
									onChange(opt);
									setVisible(false);
								}}
							>
								<Text
									style={[
										styles.optionText,
										value === opt && styles.optionSelected,
									]}
								>
									{opt}
								</Text>
							</Pressable>
						))}
					</View>
				</Pressable>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
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
	title: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
	optionRow: {
		paddingVertical: 12,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#eee",
	},
	optionText: { fontSize: 16, color: "#333" },
	optionSelected: { color: "#2E7D32", fontWeight: "700" },
	optionAll: { color: "#555" },
});

export default memo(PregnancyResultPicker);
