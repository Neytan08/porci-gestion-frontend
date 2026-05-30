import { Alert } from "react-native";
import type { InseminationType } from "../components/InseminationTypeDropdown";
import type { PregnancyResult } from "../components/PregnancyResultDropdown";

export interface MatingEventRequiredFields {
	sowId: number | null;
	inseminationDate: Date | null;
	inseminationType: InseminationType | undefined;
	pregnancyResult: PregnancyResult | undefined;
	/** Required only when inseminationType is "Monta Natural". */
	boarId: number | null;
}

/**
 * Validates all required fields for a mating event form.
 * Shows an Alert and returns false if any required field is missing.
 */
export function validateMatingEventRequiredFields(
	fields: MatingEventRequiredFields,
): boolean {
	const { sowId, inseminationDate, inseminationType, pregnancyResult } = fields;

	if (!sowId || !inseminationDate || !inseminationType || !pregnancyResult) {
		Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
		return false;
	}

	if (inseminationType === "Monta Natural" && !fields.boarId) {
		Alert.alert("Error", "Debe seleccionar un verraco para 'Monta Natural'.");
		return false;
	}

	return true;
}
