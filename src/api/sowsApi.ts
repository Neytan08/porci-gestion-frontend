import client from "./client";

export type Sow = {
  sow_id: number;
  status_id: number | undefined;
  breed_id: number | undefined;
  sow_tag_number: string;
  entry_date: string;
  weight?: number | undefined;
  length?: number | undefined;
  mammary_glands: number;
  farrowing_number: number;
  last_weaning_date?: string | null;
  description?: string | undefined;
  removal_date?: string | null;
  removal_reason?: string | undefined;

  status: { status_id: number; status_name: string } | null; // Added to include status details
  breeds: { breed_id: number; breed_name: string } | null; // Added to include breed details
};

export const getSows = async (): Promise<Sow[]> => {
  const res = await client.get('/api/breedingsows/');
  return res.data;
};

export const getSowbyId = async (id: number): Promise<Sow> => {
  const res = await client.get(`/api/breedingsows/${id}`);
  return res.data;
}

export const createSow = async (payload: Partial<Sow>) => {
  const res = await client.post('/api/breedingsows/', payload);
  return res.data;
};

export const updateSow = async (id: number, payload: Partial<Sow>) => {
  const res = await client.put(`/api/breedingsows/${id}`, payload);
  return res.data;
};

export const deleteSowbyId = async (id: number) => {
  const res = await client.delete(`/api/breedingsows/${id}`);
  return res.data;
}