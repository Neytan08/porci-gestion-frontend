export type Sow = {
	sow_id: number;
	status_id: number;
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
	status: { status_id: number; status_name: string };
	breed: { breed_id: number; breed_name: string } | null;
};
