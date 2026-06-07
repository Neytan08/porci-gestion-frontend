import type { MatingEvent, PregnancyResult } from "../model/matingEvent";
import type { InseminationType } from "../components/InseminationTypeDropdown";

export interface MatingEventPayloadInput {
	sow_id: number;
	boar_id?: number | null;
	insemination_date: string;
	insemination_type: InseminationType | undefined;
	pregnancy_result: PregnancyResult | undefined;
	notes?: string;
}

/**
 * Normalises form values into a Partial<MatingEvent> ready for the API.
 * Omits boar_id when insemination type is not "Monta Natural".
 */
export function buildMatingEventPayload(
	input: MatingEventPayloadInput,
): Partial<MatingEvent> {
	const isNatural = input.insemination_type === "Monta Natural";

	return {
		sow_id: input.sow_id,
		boar_id: isNatural && input.boar_id ? input.boar_id : undefined,
		insemination_date: input.insemination_date,
		insemination_type: input.insemination_type,
		pregnancy_result: input.pregnancy_result,
		notes: input.notes || undefined,
	};
}
