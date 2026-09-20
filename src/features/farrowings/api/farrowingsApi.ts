import client from "../../../shared/api/client";
import type {
	CreateFarrowingPayload,
	Farrowing,
	FarrowingsBySowResponse,
	WeanFarrowingPayload,
} from "../model/farrowing";

export type {
	CreateFarrowingPayload,
	Farrowing,
	FarrowingsBySowResponse,
	WeanFarrowingPayload,
};

export const getAllFarrowingsBySow = async (sowId: number): Promise<FarrowingsBySowResponse> => {
	const response = await client.get(`/api/farrowings/sow/${sowId}`);
	return response.data;
};

export const createFarrowing = async (payload: CreateFarrowingPayload): Promise<Farrowing> => {
	const response = await client.post("/api/farrowings", payload);
	return response.data;
};

export const weanFarrowing = async (
	farrowingId: number,
	payload: WeanFarrowingPayload,
): Promise<Farrowing> => {
	const response = await client.patch(`/api/farrowings/${farrowingId}/wean`, payload);
	return response.data;
};
