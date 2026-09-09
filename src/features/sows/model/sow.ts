export const BREEDING_SOW_STATUSES = {
	vacia: "Vacia",
	gestacion: "Gestación",
	lactancia: "Lactancia",
	noProductiva: "No Productiva",
	retirada: "Retirada",
} as const;

// Builds the status union from the object values so consumers use the shared constants.
export type BreedingSowStatus =
	(typeof BREEDING_SOW_STATUSES)[keyof typeof BREEDING_SOW_STATUSES];

// Retired sows are managed by the retire flow, so they are excluded from normal status selection.
export type SelectableBreedingSowStatus = Exclude<
	BreedingSowStatus,
	typeof BREEDING_SOW_STATUSES.retirada
>;

export type Sow = {
	sow_id: number;
	status: BreedingSowStatus;
	breed_id: number;
	sow_tag_number: string;
	entry_date: string;
	weight?: number | null;
	length?: number | null;
	mammary_glands: number;
	farrowing_number: number;
	last_weaning_date?: string | null;
	description?: string | null;
	removal_date?: string | null;
	removal_reason?: string | null;
	breed: { breed_id: number; breed_name: string } | null;
};

export type RetireSowsPayload = {
	removal_date: string;
	removal_reason: string;
};
