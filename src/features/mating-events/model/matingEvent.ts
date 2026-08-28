/**
 * Source of truth for pregnancy result values stored by the API.
 *
 * Mandatory rule: do not hardcode these string values in screens, hooks,
 * components, or utilities. Import PREGNANCY_RESULTS for business logic and
 * PREGNANCY_RESULT_OPTIONS for UI lists instead.
 */
export const PREGNANCY_RESULTS = {
	pendiente: "Pendiente",
	positivo: "Positivo",
	negativo: "Negativo",
} as const;

/**
 * Type-safe union generated from PREGNANCY_RESULTS.
 * This keeps TypeScript aligned with the shared runtime constants.
 */
export type PregnancyResult =
	(typeof PREGNANCY_RESULTS)[keyof typeof PREGNANCY_RESULTS];

/**
 * Ordered list of pregnancy result values for dropdowns, modals, tabs, and maps.
 * Derive UI options from PREGNANCY_RESULTS so values stay centralized.
 */
export const PREGNANCY_RESULT_OPTIONS: readonly PregnancyResult[] =
	Object.values(PREGNANCY_RESULTS);

/**
 * Source of truth for reproduction type values stored in the reproduction_type
 * API field.
 *
 * Mandatory rule: do not hardcode these string values in screens, hooks,
 * components, or utilities. Import REPRODUCTION_TYPES for business logic and
 * REPRODUCTION_TYPE_OPTIONS for UI lists instead.
 */
export const REPRODUCTION_TYPES = {
	natural: "Monta Natural",
	artificial: "Inseminación Artificial",
} as const;

/**
 * Type-safe union generated from REPRODUCTION_TYPES.
 * This keeps TypeScript aligned with the shared runtime constants.
 */
export type ReproductionType =
	(typeof REPRODUCTION_TYPES)[keyof typeof REPRODUCTION_TYPES];

/**
 * Ordered list of reproduction type values for dropdowns, modals, tabs, and maps.
 * Derive UI options from REPRODUCTION_TYPES so values stay centralized.
 */
export const REPRODUCTION_TYPE_OPTIONS: readonly ReproductionType[] =
	Object.values(REPRODUCTION_TYPES);

export type MatingEvent = {
	mating_id: number;
	sow_id: number;
	boar_id: number | null;
	reproduction_date: string | null;
	reproduction_type: ReproductionType | undefined;
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
