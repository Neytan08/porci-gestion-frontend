import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import type {
	RootStackParamList,
	RootStackRouteProp,
} from "../../../app/navigation/rootStack.types";
import ActionIconButton from "../../../shared/components/actions/actionIconButton";
import ScreenContainer from "../../../shared/components/layout/screenContainer";
import { formatIsoDate } from "../../../shared/utils/dateHelpers";
import { useMatingEventLoader } from "../hooks/useMatingEventLoader";

type DetailsMatingEventRouteProp = RootStackRouteProp<"DetailsMatingEvent">;
type DetailsMatingEventNavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"DetailsMatingEvent"
>;

type DetailRowProps = {
	label: string;
	value: string;
	actionOnPress?: () => void;
	actionAccessibilityLabel?: string;
};

const rightArrowIcon = require("../../../../assets/icons/right-arrow.png");

function DetailRow({
	label,
	value,
	actionOnPress,
	actionAccessibilityLabel,
}: DetailRowProps) {
	const showsAction = typeof actionOnPress === "function";

	return (
		<View style={styles.row}>
			<View style={styles.rowContent}>
				<Text style={styles.rowLabel}>{label}</Text>
				<Text style={styles.rowValue}>{value}</Text>
			</View>
			{showsAction ? (
				<ActionIconButton
					onPress={actionOnPress}
					iconSource={rightArrowIcon}
					hitSlop={30}
					size={35}
					tintColor="#2E7D32"
					containerStyle={styles.rowActionButton}
					pressedStyle={styles.rowActionButtonPressed}
					accessibilityLabel={actionAccessibilityLabel ?? `Ver ${label.toLowerCase()}`}
				/>
			) : null}
		</View>
	);
}

/**
 * Read-only detail screen for a single MatingEvent.
 * Reloads data every time the screen gains focus.
 */
export default function DetailsMatingEventScreen() {
	const navigation = useNavigation<DetailsMatingEventNavigationProp>();
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

	const sowValue = String(event.breedingsows?.sow_tag_number ?? event.sow_id);
	const boarId = event.boar_id;
	const boarValue = String(event.boars?.boar_tag_number ?? "N/A");
	const detailRows = [
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
				<DetailRow
					label="Cerda"
					value={sowValue}
					actionOnPress={() => navigation.navigate("DetailsSow", { sowId: event.sow_id })}
					actionAccessibilityLabel="Ver detalle de la cerda"
				/>
				{/* Some insemination flows do not store a boar reference, so this row stays read-only. */}
				<DetailRow
					label="Verraco"
					value={boarValue}
					actionOnPress={
						boarId == null
							? undefined
							: () => navigation.navigate("DetailsBoar", { boarId })
					}
					actionAccessibilityLabel="Ver detalle del verraco"
				/>
				{detailRows.map((row) => (
					<DetailRow key={row.label} label={row.label} value={String(row.value ?? "-")} />
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
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 14,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "#eee",
	},
	rowContent: {
		flex: 1,
		paddingRight: 12,
	},
	rowLabel: {
		fontSize: 14,
		color: "#666",
		marginBottom: 2,
	},
	rowValue: {
		fontSize: 15,
		color: "#263238",
		fontWeight: "500",
	},
	rowActionButton: {
		width: 35,
		height: 35,
		borderRadius: 17.5,
	},
	rowActionButtonPressed: {
		backgroundColor: "#E8F5E9",
	},
});

