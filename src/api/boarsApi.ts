import client from "./client";

export type Boar = {
  boar_id: number ;
  boar_tag_number: string;
  breed_id: number | null;
  birth_date: string;
  weight: number | null;
  length: number | null;
  removal_date?: string | null;
  removal_reason?: string | null;
  description?: string | null;
  breed: { breed_id: number; breed_name: string } | null; // Added to include breed details
  age: { years: number; months: number } | null;
};

export const getBoars = async (): Promise<Boar[]> => {
  const response = await client.get("/api/boars");
  return response.data;
}

export const getBoarById = async (id: number): Promise<Boar> => {
  const response = await client.get(`/api/boars/${id}`);
  return response.data;
}

export const createBoar = async (payload: Partial<Boar>) => {
  const response = await client.post("/api/boars", payload);
  return response.data;
}

export const updateBoar = async (id: number, payload: Partial<Boar>) => {
  const response = await client.put(`/api/boars/${id}`, payload);
  return response.data;
}

export const deleteBoar = async (id: number) => {
  const response = await client.delete(`/api/boars/${id}`);
  return response.data;
}