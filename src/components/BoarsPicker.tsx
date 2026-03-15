import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { type Boar, getBoars } from "../api/boarsApi";

type BoarPickerProps = {
	label?: string;
	value: number | null;
	onChange: (value: number | null) => void;
	placeholder?: string;
};

export const BoarPicker: React.FC<BoarPickerProps> = ({
	label = "Identificador Verraco",
	value,
	onChange,
	placeholder = "Seleccionar verraco...",
}) => {
	const [boarOptions, setBoarOptions] = useState<
		{ label: string; value: number }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [visible, setVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		fetchBoars();
	}, []);

	// Fetch status from API
	const fetchBoars = async () => {
		try {
			const data = await getBoars();
			const mapped = data.map((item: Boar) => ({
				label: item.boar_tag_number,
				value: item.boar_id,
			}));
			setBoarOptions(mapped);
		} catch (error) {
			console.error("Error cargando estados:", error);
		} finally {
			setLoading(false);
		}
	};
	// Filtered list
	const filteredBoars = useMemo(() => {
		return boarOptions.filter((s) => {
			const q = searchQuery.trim().toLowerCase();

			const tag = (s.label ?? "").toString().toLowerCase();
			const matchSearch = q.length === 0 || tag.includes(q);

			return matchSearch;
		});
	}, [boarOptions, searchQuery]);

	const selectedLabel = useMemo(() => {
		if (value == null) return null;
		const found = boarOptions.find((o) => o.value === value);
		return found?.label ?? null;
	}, [value, boarOptions]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" />
				<Text>Cargando verracos...</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			<Pressable style={styles.select} onPress={() => setVisible(true)}>
				<Text style={[styles.selectText, !selectedLabel && styles.placeholder]}>
					{selectedLabel ?? placeholder}
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
								onChange(null);
								setVisible(false);
							}}
						>
							<Text style={[styles.optionText, styles.optionAll]}>
								— Sin seleccionar —
							</Text>
						</Pressable>
						<TextInput
							style={styles.searchInput}
							placeholder="Buscar verraco..."
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
						{filteredBoars.map((opt) => (
							<Pressable
								key={opt.value}
								style={styles.optionRow}
								onPress={() => {
									onChange(opt.value);
									setVisible(false);
								}}
							>
								<Text
									style={[
										styles.optionText,
										value === opt.value && styles.optionSelected,
									]}
								>
									{" "}
									{opt.label}
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
	container: { marginVertical: 10 },
	label: { fontSize: 16, marginBottom: 6 },
	loadingContainer: { flexDirection: "row", alignItems: "center", gap: 10 },

	// Estilo tipo InseminationTypePicker
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
	searchInput: {
		height: 38,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		fontSize: 12,
	},
	optionText: { fontSize: 16, color: "#333" },
	optionSelected: { color: "#2E7D32", fontWeight: "700" },
	optionAll: { color: "#555" },
});
