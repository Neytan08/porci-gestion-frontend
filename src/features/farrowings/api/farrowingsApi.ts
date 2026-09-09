import client from "../../../shared/api/client";
import type {
	CreateFarrowingPayload,
	Farrowing,
	FarrowingsBySowResponse,
} from "../model/farrowing";

export type { CreateFarrowingPayload, Farrowing, FarrowingsBySowResponse };

export const getAllFarrowingsBySow = async (
	sowId: number,
): Promise<FarrowingsBySowResponse> => {
	const response = await client.get(`/api/farrowings/sow/${sowId}`);
	return response.data;
};

export const createFarrowing = async (
	payload: CreateFarrowingPayload,
): Promise<Farrowing> => {
	const response = await client.post("/api/farrowings", payload);
	return response.data;
};
