import { type MatingEvent, type PregnancyResult, REPRODUCTION_TYPES, type ReproductionType } from "../model/matingEvent";

export interface MatingEventPayloadInput {
	sow_id: number;
	boar_id?: number | null;
	reproduction_date: string;
	reproduction_type: ReproductionType | undefined;
	pregnancy_result: PregnancyResult | undefined;
	notes?: string;
}

/**
 * Normalises form values into a Partial<MatingEvent> ready for the API.
 * Omits boar_id when insemination type is not natural reproduction.
 */
export function buildMatingEventPayload(
	input: MatingEventPayloadInput,
): Partial<MatingEvent> {
	const isNatural = input.reproduction_type === REPRODUCTION_TYPES.natural;

	return {
		sow_id: input.sow_id,
		boar_id: isNatural && input.boar_id ? input.boar_id : undefined,
		reproduction_date: input.reproduction_date,
		reproduction_type: input.reproduction_type,
		pregnancy_result: input.pregnancy_result,
		notes: input.notes || undefined,
	};
}
