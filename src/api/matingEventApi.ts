import client from "./client";

export type MatingEvent = {
	mating_id: number;
	sow_id: number;
	boar_id?: number;
	insemination_date: string | null;
	insemination_type: "Monta Natural" | "Artificial" | undefined;
	pregnancy_result: "Pendiente" | "Positivo" | "Negativo" | undefined;
	notes?: string | undefined;

	// Including related sow details
	breedingsows?: { sow_tag_number: string } | null;
};

// Payload para crear/actualizar (lo que espera tu API, sin relaciones)
export type MatingEventPayload = {
	sow_id: number;
	boar_id?: number;
	insemination_date: string | null;
	insemination_type?: "Monta Natural" | "Artificial";
	pregnancy_result?: "Pendiente" | "Positivo" | "Negativo";
	notes?: string | null;
};

// Mating Events grouped by pregnancy result matching API response
export type MatingEventsGroup<TEvent = MatingEvent> = {
	pregnancy_result: "Pendiente" | "Positivo" | "Negativo" | null;
	events: TEvent[];
};

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
