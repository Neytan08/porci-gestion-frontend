import client from "./client";

export type Sow = {
    status_name: string;
    breed_name: string;
    sow_tag_number: string;
    entry_date: string;
    weight?: number;
    length?: number;
    mammary_glands: number;
    farrowing_number?: number;
    status: {
      status_name: string;
    };
    breed: {
      breed_name: string;
    };
    last_weaning_date?: string;
    removal_date?: string;
};

export const getSows = async (): Promise<Sow[]> => {
  const res = await client.get('/api/breedingsows/'); // ajustá la ruta según tu API
  return res.data;
};

// si necesitás POST/PUT/DELETE:
export const createSow = async (payload: Partial<Sow>) => {
  const res = await client.post('/api/breedingsows/', payload);
  return res.data;
};