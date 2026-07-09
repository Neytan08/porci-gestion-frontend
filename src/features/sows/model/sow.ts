export const BREEDING_SOW_STATUSES = [
	"Gestacion",
	"Lactancia",
	"Vacia",
	"No Productiva",
] as const;

export type BreedingSowStatus = (typeof BREEDING_SOW_STATUSES)[number];

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
