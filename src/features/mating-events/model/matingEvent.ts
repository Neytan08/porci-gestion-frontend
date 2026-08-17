export type PregnancyResult = "Pendiente" | "Positivo" | "Negativo";
export const PREGNANCY_RESULT_OPTIONS: readonly PregnancyResult[] = [
	"Pendiente",
	"Positivo",
	"Negativo",
];

export type InseminationType = "Monta Natural" | "Inseminación";
export const INSEMINATION_TYPE_OPTIONS: readonly InseminationType[] = [
	"Monta Natural",
	"Inseminación",
];

export type MatingEvent = {
	mating_id: number;
	sow_id: number;
	boar_id: number | null;
	insemination_date: string | null;
	insemination_type: InseminationType | undefined;
	pregnancy_result: PregnancyResult | undefined;
	notes?: string | undefined;

	// Including related sow details
	breedingsows?: { sow_tag_number: string } | null;
	// Including related boar details
	boars?: { boar_tag_number: string } | null;

};

export type MatingEventsGroup<TEvent = MatingEvent> = {
	pregnancy_result: PregnancyResult | null;
	events: TEvent[];
};

