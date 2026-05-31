export type Boar = {
	boar_id: number;
	boar_tag_number: string;
	breed_id: number | null;
	birth_date: string;
	weight: number | null;
	length: number | null;
	removal_date?: string | null;
	removal_reason?: string | null;
	description?: string | null;
	breeds: { breed_id: number; breed_name: string } | null; // Added to include breed details
	age: { years: number; months: number } | null;
};

