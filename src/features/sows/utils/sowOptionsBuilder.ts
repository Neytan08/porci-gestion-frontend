import type { Sow } from "../api/sowsApi";

/**
 * Utilities for extracting dropdown options from Sows data.
 * - Return consistent OptionItem structures for UI consumption.
 */

/**
 * Standard shape for dropdown/select options.
 *
 * @property value Numeric identifier (breed_id, status_id, etc.).
 * @property label Display text shown in UI; always trimmed and non-empty.
 */
export interface OptionItem {
  value: number;
  label: string;
}

/**
 * Extracts unique breed options from a sow collection.
 *
 * @param sows Full sow collection from API.
 * @returns Sorted unique breed options ready for dropdown rendering.
 */
export function extractBreedOptions(sows: Sow[]): OptionItem[] {
  // Accumulate unique breeds using a Map to prevent duplicate ids.
  const map = new Map<number, string>();
  sows.forEach((sow) => {
    const id = sow.breed?.breed_id ?? sow.breed_id;
    const name = sow.breed?.breed_name;
    // Only add if id is present and label is a non-empty string after trim.
    if (id != null && typeof name === "string" && name.trim()) {
      map.set(id, name);
    }
  });
  // Convert Map to OptionItem array maintaining insertion order.
  return Array.from(map, ([value, label]) => ({ value, label }));
}

/**
 * Extracts unique status options from a sow collection.
 *
 * @param sows Full sow collection from API.
 * @returns Sorted unique status options ready for dropdown rendering.
 */
export function extractStatusOptions(sows: Sow[]): OptionItem[] {
  // Accumulate unique statuses using a Map to prevent duplicate ids.
  const map = new Map<number, string>();
  sows.forEach((sow) => {
    const id = sow.status?.status_id ?? sow.status_id;
    const name = sow.status?.status_name;
    // Only add if id is present and label is a non-empty string after trim.
    if (id != null && typeof name === "string" && name.trim()) {
      map.set(id, name);
    }
  });
  // Convert Map to OptionItem array maintaining insertion order.
  return Array.from(map, ([value, label]) => ({ value, label }));
}

/**
 * Combined function that extracts breed and status options together.
 *
 * @param sows Full sow collection from API.
 * @returns Object with `breeds` and `statuses` arrays ready for UI.
 */
export function extractAllOptions(sows: Sow[]) {
  return {
    breeds: extractBreedOptions(sows),
    statuses: extractStatusOptions(sows),
  };
}