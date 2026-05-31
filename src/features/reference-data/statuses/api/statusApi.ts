import client from "../../../../shared/api/client";
import type { Status } from "../model/status";

export type { Status };

export const getStatus = async (): Promise<Status[]> => {
	const res = await client.get("/api/status/"); // Adjust it according to your API
	return res.data;
};

export const getStatusById = async (id: number): Promise<Status> => {
	const res = await client.get(`/api/status/${id}`);
	return res.data;
};

// si necesitÃ¡s POST/PUT/DELETE:
// export const createSow = async (payload: Partial<Sow>) => {
//   const res = await client.post('/api/breedingsows/', payload);
//   return res.data;
// };
