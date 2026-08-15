import client from "../../../shared/api/client";
import type { RetireSowsPayload, Sow } from "../model/sow";

export type { Sow, RetireSowsPayload };

export const getSows = async (): Promise<Sow[]> => {
	const res = await client.get("/api/breedingsows/");
	return res.data;
};

export const getSowById = async (id: number): Promise<Sow> => {
	const res = await client.get(`/api/breedingsows/${id}`);
	return res.data;
};

export const createSow = async (payload: Partial<Sow>) => {
	const res = await client.post("/api/breedingsows/", payload);
	return res.data;
};

export const updateSow = async (id: number, payload: Partial<Sow>) => {
	const res = await client.put(`/api/breedingsows/${id}`, payload);
	return res.data;
};

export const deleteSowById = async (id: number) => {
	const res = await client.delete(`/api/breedingsows/${id}`);
	return res.data;
};

/**
 * Retires one or more sows with the specified IDs.
 */
export const retireSows = async (
	sowIds: number | number[],
	payload: RetireSowsPayload,
) => {
	const res = await client.patch("/api/breedingsows/retire", {
		sow_ids: sowIds,
		...payload,
	});
	return res.data;
};

/**
 * Checks whether a sow with the given tag number already exists.
 * Used for client-side duplicate prevention before calling updateSow.
 */
export const checkSowTagNumberExists = async (sowTagNumber: string): Promise<boolean> => {
	const res = await client.get(`/api/breedingsows/check-sow-tag-number-exists/${sowTagNumber}`);
	return res.data;
};
