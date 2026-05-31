import client from "../../../shared/api/client";
import type { Boar } from "../model/boar";

export type { Boar };

export const getBoars = async (): Promise<Boar[]> => {
	const response = await client.get("/api/boars");
	return response.data;
};

export const getBoarById = async (id: number): Promise<Boar> => {
	const response = await client.get(`/api/boars/${id}`);
	return response.data;
};

export const createBoar = async (payload: Partial<Boar>) => {
	const response = await client.post("/api/boars", payload);
	return response.data;
};

export const updateBoar = async (id: number, payload: Partial<Boar>) => {
	const response = await client.put(`/api/boars/${id}`, payload);
	return response.data;
};

export const deleteBoar = async (id: number) => {
	const response = await client.delete(`/api/boars/${id}`);
	return response.data;
};

/**
 * Checks whether a boar with the given tag number already exists (case-insensitive).
 * Used for client-side duplicate prevention before calling createBoar or updateBoar.
 */
export const checkBoarTagNumberExists = async (boarTagNumber: string): Promise<boolean> => {
	const response = await client.get(`/api/boars/check-boar-tag-number-exists/${boarTagNumber}`);
	return response.data;
};
