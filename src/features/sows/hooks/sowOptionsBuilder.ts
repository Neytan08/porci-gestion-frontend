import type { Sow } from '../api/sowsApi';

export interface OptionItem {
  value: number;
  label: string;
}

/**
 * Extract unique breed options from sows
 */
export function extractBreedOptions(sows: Sow[]): OptionItem[] {
  const map = new Map<number, string>();
  sows.forEach((sow) => {
    // Prefer nested relation; fall back to root field for flat API responses
    const id = sow.breed?.breed_id ?? sow.breed_id;
    const name = sow.breed?.breed_name;
    if (id != null && typeof name === 'string' && name.trim()) {
      map.set(id, name);
    }
  });
  return Array.from(map, ([value, label]) => ({ value, label }));
}

/**
 * Extract unique status options from sows
 */
export function extractStatusOptions(sows: Sow[]): OptionItem[] {
  const map = new Map<number, string>();
  sows.forEach((sow) => {
    // Prefer nested relation; fall back to root field for flat API responses
    const id = sow.status?.status_id ?? sow.status_id;
    const name = sow.status?.status_name;
    if (id != null && typeof name === 'string' && name.trim()) {
      map.set(id, name);
    }
  });
  return Array.from(map, ([value, label]) => ({ value, label }));
}

/**
 * Extract all options at once
 */
export function extractAllOptions(sows: Sow[]) {
  return {
    breeds: extractBreedOptions(sows),
    statuses: extractStatusOptions(sows),
  };
}

