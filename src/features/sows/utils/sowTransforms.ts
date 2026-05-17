import type { Sow } from '../model/sow';

/**
 * Input type for buildSowApiPayload.
 * Mirrors Partial<Sow> but relaxes the numeric fields to also accept strings,
 * covering both the Add flow (form state is string) and the Edit flow (state is number).
 */
export type SowPayloadInput = Omit<
  Partial<Sow>,
  'weight' | 'length' | 'mammary_glands' | 'farrowing_number'
> & {
  weight?: number | string | null;
  length?: number | string | null;
  mammary_glands?: number | string | null;
  farrowing_number?: number | string | null;
};

/**
 * Normalises numeric sow fields and returns a Partial<Sow> ready for the API.
 * Handles both string values from form inputs (Add flow) and number values
 * from loaded state (Edit flow) — calling toString() before parseFloat is safe for both.
 *
 * @param input - Sow data with numeric fields as string or number.
 * @returns A Partial<Sow> with all numeric fields coerced to their correct API types.
 */
export function buildSowApiPayload(input: SowPayloadInput): Partial<Sow> {
  return {
    ...input,
    weight: input.weight != null && input.weight !== '' ? parseFloat(input.weight.toString()) : null,
    length: input.length != null && input.length !== '' ? parseFloat(input.length.toString()) : null,
    mammary_glands:
      input.mammary_glands != null && input.mammary_glands !== ''
        ? parseFloat(input.mammary_glands.toString())
        : 0,
    farrowing_number:
      input.farrowing_number != null && input.farrowing_number !== ''
        ? parseFloat(input.farrowing_number.toString())
        : 0,
  };
}
