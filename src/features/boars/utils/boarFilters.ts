import type { Boar } from '../api/boarsApi';

/**
 * Pure filtering utilities for the Boars feature.
 */

/**
 * Filters rows by breed id.
 *
 * Compatibility strategy:
 * - Prefer nested relational id (`boar.breeds?.breed_id`).
 * - Fall back to root-level id (`boar.breed_id`) for flat payloads.
 *
 * @param boars Source list to evaluate.
 * @param breedId Selected breed id. `null` means no active breed filter.
 * @returns Original list when filter is disabled, otherwise only matching rows.
 */
export function filterBoarsByBreed(boars: Boar[], breedId: number | null): Boar[] {
  if (breedId === null) return boars;
  return boars.filter((boar) => {
    const id = boar.breeds?.breed_id ?? boar.breed_id;
    return id === breedId;
  });
}

/**
 * Performs case-insensitive text filtering by boar tag number.
 * Empty query behaves as "no search filter".
 *
 * @param boars Source list to evaluate.
 * @param searchQuery User-entered free text.
 * @returns Rows whose `boar_tag_number` contains the normalized query.
 */
export function filterBoarsBySearch(boars: Boar[], searchQuery: string): Boar[] {
  const query = searchQuery.trim().toLowerCase();
  if (query.length === 0) return boars;
  return boars.filter((boar) => {
    const tag = (boar.boar_tag_number ?? '').toString().toLowerCase();
    return tag.includes(query);
  });
}

/**
 * Input contract for combined filtering.
 *
 * Semantics:
 * - (null) numeric ids mean the corresponding filter is disabled.
 * - (searchQuery) may be empty and is normalized by filterBoarsBySearch.
 */
export interface BoarFilterCriteria {
  breedId: number | null;
  searchQuery: string;
}

/**
 * Applies all filters in a stable sequence: breed -> search.
 *
 * @param boars Full input collection.
 * @param criteria Active filter values.
 * @returns Filtered list of boars matching all active criteria.
 */
export function applyAllBoarFilters(boars: Boar[], criteria: BoarFilterCriteria): Boar[] {
  let result = boars;
  result = filterBoarsByBreed(result, criteria.breedId);
  result = filterBoarsBySearch(result, criteria.searchQuery);
  return result;
}
