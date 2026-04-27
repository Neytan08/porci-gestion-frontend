import client from "../../../../shared/api/client";

export type Breed = {
	breed_id: number;
	breed_name: string;
	description?: string;
};

export const getBreed = async (): Promise<Breed[]> => {
	const res = await client.get("/api/breeds/"); // Adjust it according to the API
	return res.data;
};

export const createBreed = async (payload: Partial<Breed>) => {
	const res = await client.post("/api/breeds/", payload);
	return res.data;
};
