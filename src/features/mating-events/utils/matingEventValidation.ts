import { Alert } from "react-native";
import { type PregnancyResult, REPRODUCTION_TYPES, type ReproductionType } from "../model/matingEvent";

export interface MatingEventRequiredFields {
	sowId: number | null;
	inseminationDate: Date | null;
	reproductionType: ReproductionType | undefined;
	pregnancyResult: PregnancyResult | undefined;
	/** Required only when reproductionType is natural reproduction. */
	boarId: number | null;
}

/**
 * Validates all required fields for a mating event form.
 * Shows an Alert and returns false if any required field is missing.
 */
export function validateMatingEventRequiredFields(
	fields: MatingEventRequiredFields,
): boolean {
	const { sowId, inseminationDate, reproductionType, pregnancyResult } = fields;

	if (!sowId || !inseminationDate || !reproductionType || !pregnancyResult) {
		Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
		return false;
	}

	if (reproductionType === REPRODUCTION_TYPES.natural && !fields.boarId) {
		Alert.alert("Error", `Debe seleccionar un verraco para '${REPRODUCTION_TYPES.natural}'.`);
		return false;
	}

	return true;
}
