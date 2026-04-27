export type MatingEvent = {
	mating_id: number;
	sow_id: number;
	boar_id: number | null;
	insemination_date: string | null;
	insemination_type: "Monta Natural" | "Artificial" | undefined;
	pregnancy_result: "Pendiente" | "Positivo" | "Negativo" | undefined;
	notes?: string | undefined;

	// Including related sow details
	breedingsows?: { sow_tag_number: string } | null;
	// Including related boar details
	boars?: { boar_tag_number: string } | null;

};

export type MatingEventsGroup<TEvent = MatingEvent> = {
	pregnancy_result: "Pendiente" | "Positivo" | "Negativo" | null;
	events: TEvent[];
};

