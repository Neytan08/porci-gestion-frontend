import type React from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { getSows, type Sow } from "../api/sowsApi";

type BreedingSowPickerProps = {
	label?: string;
	value: number | null;
	onChange: (value: number | null) => void;
	placeholder?: string;
};

export const BreedingSowPicker: React.FC<BreedingSowPickerProps> = ({
	label = "Identificador Cerda",
	value,
	onChange,
	placeholder = "Seleccionar cerda...",
}) => {
	const [sowOptions, setSowOptions] = useState<
		{ label: string; value: number }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [visible, setVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Fetch status from API
	const fetchSows = useCallback(async () => {
		try {
			const data = await getSows();
			const mapped = data.map((item: Sow) => ({
				label: item.sow_tag_number,
				value: item.sow_id,
			}));
			setSowOptions(mapped);
		} catch (error) {
			console.error("Error cargando cerdas:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchSows();
		}, [fetchSows]),
	);

	// Filtered list
	const filteredSows = useMemo(() => {
		return sowOptions.filter((s) => {
			const q = searchQuery.trim().toLowerCase();

			const tag = (s.label ?? "").toString().toLowerCase();
			const matchSearch = q.length === 0 || tag.includes(q);

			return matchSearch;
		});
	}, [sowOptions, searchQuery]);

	const selectedLabel = useMemo(() => {
		if (value == null) return null;
		const found = sowOptions.find((o) => o.value === value);
		return found?.label ?? null;
	}, [value, sowOptions]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="small" />
				<Text>Cargando cerdas...</Text>
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
							placeholder="Buscar cerda..."
							value={searchQuery}
							onChangeText={setSearchQuery}
						/>
						{filteredSows.map((opt) => (
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

