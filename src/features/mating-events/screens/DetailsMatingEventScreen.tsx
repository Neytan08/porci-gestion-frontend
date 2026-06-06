import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import type { RootStackRouteProp } from "../../../app/navigation/rootStack.types";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import { useMatingEventLoader } from "../hooks/useMatingEventLoader";
import { formatIsoDate } from "../../../shared/utils/dateHelpers";

type DetailsMatingEventRouteProp = RootStackRouteProp<"DetailsMatingEvent">;

/**
 * Read-only detail screen for a single MatingEvent.
 * Reloads data every time the screen gains focus.
 */
export default function DetailsMatingEventScreen() {
	const route = useRoute<DetailsMatingEventRouteProp>();
	const { eventId } = route.params;

	const { event, loading, error, loadEvent } = useMatingEventLoader(eventId);

	useFocusEffect(
		useCallback(() => {
			loadEvent();
		}, [loadEvent]),
	);

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
				<Text>Cargando evento...</Text>
			</View>
		);
	}

	if (error || !event) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>
					{error ?? "No se pudo cargar el evento."}
				</Text>
			</View>
		);
	}

	const rows: { label: string; value: string | number | null | undefined }[] = [
		{ label: "Cerda", value: event.breedingsows?.sow_tag_number ?? event.sow_id },
		{ label: "Verraco", value: event.boars?.boar_tag_number ?? "N/A" },
		{
			label: "Fecha de inseminación",
			value: event.insemination_date ? formatIsoDate(event.insemination_date) : "-",
		},
		{ label: "Tipo", value: event.insemination_type ?? "-" },
		{ label: "Resultado", value: event.pregnancy_result ?? "-" },
		{ label: "Notas", value: event.notes ?? "-" }, 
	];

	return (
		<ScreenContainer>
			<ScrollView contentContainerStyle={styles.container}>
				<Text style={styles.title}>Detalles del Evento de Inseminación</Text>
				{rows.map((row) => (
					<View key={row.label} style={styles.row}>
						<Text style={styles.rowLabel}>{row.label}</Text>
						<Text style={styles.rowValue}>{String(row.value ?? "-")}</Text>
					</View>
				))}
			</ScrollView>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#F9FAFB",
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		color: "red",
	},
	title: {
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 20,
		color: "#263238",
	},
	row: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 14,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "#eee",
	},
	rowLabel: {
		fontSize: 12,
		color: "#666",
		marginBottom: 2,
	},
	rowValue: {
		fontSize: 15,
		color: "#263238",
		fontWeight: "500",
	},
});

