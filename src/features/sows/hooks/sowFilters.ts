import type { Sow } from '../api/sowsApi';

/**
 * Pure filter functions for Sows
 * These can be tested independently and composed
 */

export function filterSowsByBreed(
  sows: Sow[],
  breedId: number | null
): Sow[] {
  if (breedId === null) return sows;
  // Prefer the nested relation; fall back to the root field for flat API responses
  return sows.filter((sow) => {
    const id = sow.breed?.breed_id ?? sow.breed_id;
    return id === breedId;
  });
}

export function filterSowsByStatus(
  sows: Sow[],
  statusId: number | null
): Sow[] {
  if (statusId === null) return sows;
  // Prefer the nested relation; fall back to the root field for flat API responses
  return sows.filter((sow) => {
    const id = sow.status?.status_id ?? sow.status_id;
    return id === statusId;
  });
}

export function filterSowsBySearch(
  sows: Sow[],
  searchQuery: string
): Sow[] {
  const query = searchQuery.trim().toLowerCase();
  if (query.length === 0) return sows;
  return sows.filter((sow) => {
    const tag = (sow.sow_tag_number ?? '').toString().toLowerCase();
    return tag.includes(query);
  });
}

export interface FilterCriteria {
  breedId: number | null;
  statusId: number | null;
  searchQuery: string;
}

/**
 * Compose all filters together
 */
export function applyAllFilters(
  sows: Sow[],
  criteria: FilterCriteria
): Sow[] {
  let result = sows;
  result = filterSowsByBreed(result, criteria.breedId);
  result = filterSowsByStatus(result, criteria.statusId);
  result = filterSowsBySearch(result, criteria.searchQuery);
  return result;
}