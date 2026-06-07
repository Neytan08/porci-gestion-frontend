import client from "../../../shared/api/client";
import type {
	MatingEvent,
	MatingEventsGroup,
	PregnancyResult,
} from "../model/matingEvent";

export type { MatingEvent, MatingEventsGroup, PregnancyResult };

// Mating Events grouped by pregnancy result matching API response
export const getMatingEvents = async (): Promise<MatingEvent[]> => {
	const response = await client.get("/api/matingevents");
	return response.data;
};
export const getMatingEventById = async (id: number): Promise<MatingEvent> => {
	const response = await client.get(`/api/matingevents/${id}`);
	return response.data;
};

export const createMatingEvent = async (payload: Partial<MatingEvent>) => {
	const response = await client.post("/api/matingevents", payload);
	return response.data;
};

export const updateMatingEvent = async (
	id: number,
	payload: Partial<MatingEvent>,
) => {
	const response = await client.put(`/api/matingevents/${id}`, payload);
	return response.data;
};

export const deleteMatingEvent = async (id: number): Promise<void> => {
	const response = await client.delete(`/api/matingevents/${id}`);
	return response.data;
};

export const getAllGroupedByPregnancyResult = async (): Promise<
	MatingEventsGroup<MatingEvent>[]
> => {
	const response = await client.get<MatingEventsGroup<MatingEvent>[]>(
		"/api/matingevents/grouped/pregnancy-result",
	);
	return response.data;
};

export const updatePregnancyResults = async (
	mating_ids: number | number[],
	pregnancy_result: PregnancyResult,
) => {
	const idList = Array.isArray(mating_ids) ? mating_ids : [mating_ids];
	const response = await client.put(`/api/matingevents/update/pregnancy-result`, {
		mating_ids: idList,
		pregnancy_result,
	});
	return response.data;
};
