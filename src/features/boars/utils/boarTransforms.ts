import type { Boar } from '../model/boar';

/**
 * Input type for buildBoarApiPayload.
 * Mirrors Partial<Boar> but relaxes the numeric fields to also accept strings,,
 * covering both Add flow (form state is string) and Edit flow (state is number).
 */
export type BoarPayloadInput = Omit<Partial<Boar>, 'weight' | 'length'> & {
  weight?: number | string | null;
  length?: number | string | null;
};

/**
 * Normalises numeric boar fields and returns a Partial<Boar> ready for the API.
 * Handles both string values from form inputs (Add flow) and number values
 * from loaded state (Edit flow) — calling toString() before parseFloat is safe for both.
 *
 * @param input - Boar data with numeric fields as string or number.
 * @returns A Partial<Boar> with numeric fields coerced to their correct API types.
 */
export function buildBoarApiPayload(input: BoarPayloadInput): Partial<Boar> {
  return {
    ...input,
    weight:
      input.weight != null && input.weight !== ''
        ? parseFloat(input.weight.toString())
        : null,
    length:
      input.length != null && input.length !== ''
        ? parseFloat(input.length.toString())
        : null,
  };
}