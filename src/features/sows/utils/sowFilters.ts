import type { Sow } from "../api/sowsApi";

/**
 * Pure filtering utilities for the Sows feature.
 */

/**
 * Filters rows by breed id.
 *
 * Compatibility strategy:
 * - Prefer nested relational id (`sow.breed?.breed_id`).
 * - Fall back to root-level id (`sow.breed_id`) for flat payloads.
 *
 * @param sows Source list to evaluate.
 * @param breedId Selected breed id. `null` means no active breed filter.
 * @returns Original list when filter is disabled, otherwise only matching rows.
 */
export function filterSowsByBreed(sows: Sow[], breedId: number | null): Sow[] {
  if (breedId === null) return sows;
  // Prefer the nested relation; fall back to the root field for flat API responses
  return sows.filter((sow) => {
    const id = sow.breed?.breed_id ?? sow.breed_id;
    return id === breedId;
  });
}

/**
 * Filters rows by status id.
 *
 * Compatibility strategy:
 * - Prefer nested relational id (`sow.status?.status_id`).
 * - Fall back to root-level id (`sow.status_id`) for flat payloads.
 *
 * @param sows Source list to evaluate.
 * @param statusId Selected status id. `null` means no active status filter.
 * @returns Original list when filter is disabled, otherwise only matching rows.
 */
export function filterSowsByStatus(sows: Sow[], statusId: number | null): Sow[] {
  if (statusId === null) return sows;
  // Prefer the nested relation; fall back to the root field for flat API responses
  return sows.filter((sow) => {
    const id = sow.status?.status_id ?? sow.status_id;
    return id === statusId;
  });
}

/**
 * Performs case-insensitive text filtering by sow tag number.
 * - Empty query behaves as "no search filter".
 *
 * @param sows Source list to evaluate.
 * @param searchQuery User-entered free text.
 * @returns Rows whose `sow_tag_number` contains the normalized query.
 */
export function filterSowsBySearch(sows: Sow[], searchQuery: string): Sow[] {
  const query = searchQuery.trim().toLowerCase();
  if (query.length === 0) return sows;
  return sows.filter((sow) => {
    const tag = (sow.sow_tag_number ?? "").toString().toLowerCase();
    return tag.includes(query);
  });
}

/**
 * Input contract for combined filtering.
 *
 * Semantics:
 * - (null) numeric ids mean the corresponding filter is disabled.
 * - (searchQuery) may be empty and is normalized by filterSowsBySearch.
 */
export interface FilterCriteria {
  breedId: number | null;
  statusId: number | null;
  searchQuery: string;
}

/**
 * Applies all filters in a stable sequence: breed -> status -> search.
 * @param sows Full input collection.
 * @param criteria Active filter values.
 * @returns Final filtered collection.
 */
export function applyAllFilters(sows: Sow[], criteria: FilterCriteria): Sow[] {
  let result = sows;
  result = filterSowsByBreed(result, criteria.breedId);
  result = filterSowsByStatus(result, criteria.statusId);
  result = filterSowsBySearch(result, criteria.searchQuery);
  return result;
}