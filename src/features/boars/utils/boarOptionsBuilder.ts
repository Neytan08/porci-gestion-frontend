import type { Boar } from '../api/boarsApi';

/**
 * Utilities for extracting dropdown options from Boars data.
 * - Returns consistent OptionItem structures for UI consumption.
 */

/**
 * Standard shape for dropdown/select options.
 *
 * @property value Numeric identifier (breed_id, etc.).
 * @property label Display text shown in UI; always trimmed and non-empty.
 */
export interface OptionItem {
  value: number;
  label: string;
}

/**
 * Extracts unique breed options from a boar collection.
 *
 * @param boars Full boar collection from API.
 * @returns Unique breed options ready for dropdown rendering.
 */
export function extractBoarBreedOptions(boars: Boar[]): OptionItem[] {
  // Accumulate unique breeds using a Map to prevent duplicate ids.
  const map = new Map<number, string>();
  boars.forEach((boar) => {
    const id = boar.breeds?.breed_id ?? boar.breed_id;
    const name = boar.breeds?.breed_name;
    // Only add if id is present and label is a non-empty string after trim.
    if (id != null && typeof name === 'string' && name.trim()) {
      map.set(id, name);
    }
  });
  // Convert Map to OptionItem array maintaining insertion order.
  return Array.from(map, ([value, label]) => ({ value, label }));
}
