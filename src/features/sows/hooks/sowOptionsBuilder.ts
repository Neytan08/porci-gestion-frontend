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
    const id = sow.breeds?.breed_id ?? (sow as unknown as { breed_id?: number }).breed_id;
    const name = sow.breeds?.breed_name ?? (sow as unknown as { breed_name?: string }).breed_name;
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
    const id = sow.status?.status_id ?? (sow as unknown as { status_id?: number }).status_id;
    const name = sow.status?.status_name ?? (sow as unknown as { status_name?: string }).status_name;
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

