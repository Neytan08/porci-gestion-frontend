import client from "./client";

export type Sow = {
  sow_id: number;
  status_name: string;
  breed_name: string;
  sow_tag_number: string;
  entry_date: string;
  weight?: number;
  length?: number;
  mammary_glands: number;
  farrowing_number?: number;
  status: {
    status_id?: number; // Added for dropdown compatibility
    status_name: string;
  };
  breeds: {
    breed_id?: number; // Added for dropdown compatibility
    breed_name: string;
  };
  last_weaning_date?: string | null;
  description?: string;
  removal_date?: string | null;
  removal_reason?: string;
};

export const getSows = async (): Promise<Sow[]> => {
  const res = await client.get('/api/breedingsows/'); // ajustá la ruta según tu API
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

export const deleteSow = async (id: number) =>{
  const rest = await client.delete(`/api/breedingsows/${id}`);
  return rest.data;
}