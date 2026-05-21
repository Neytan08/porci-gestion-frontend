import { useCallback, useMemo, useState } from 'react';
import type { Sow } from '../api/sowsApi';
import { applyAllFilters, type FilterCriteria } from '../utils/sowFilters';
import {
  extractBreedOptions,
  extractStatusOptions,
  type OptionItem,
} from '../utils/sowOptionsBuilder';

export interface SowFilterCriteria extends FilterCriteria {}

export interface FilterOption extends OptionItem {}

interface UseSowsFilteringReturn {
  filters: SowFilterCriteria;
  filteredSows: Sow[];
  breedOptions: FilterOption[];
  statusOptions: FilterOption[];
  setBreedFilter: (id: number | null) => void;
  setStatusFilter: (id: number | null) => void;
  setSearchQuery: (query: string) => void;
  clearAllFilters: () => void;
}

/**
 * Hook for managing Sows filtering logic.
 * It delegates filtering and option extraction to shared feature helpers.
 */
export function useSowsFiltering(sows: Sow[]): UseSowsFilteringReturn {
  const [filters, setFilters] = useState<SowFilterCriteria>({
    breedId: null,
    statusId: null,
    searchQuery: '',
  });

  const breedOptions = useMemo<FilterOption[]>(() => {
    return extractBreedOptions(sows);
  }, [sows]);

  const statusOptions = useMemo<FilterOption[]>(() => {
    return extractStatusOptions(sows);
  }, [sows]);

  const filteredSows = useMemo(() => {
    return applyAllFilters(sows, filters);
  }, [sows, filters]);

  const setBreedFilter = useCallback((id: number | null) => {
    setFilters((prev) => ({ ...prev, breedId: id }));
  }, []);

  const setStatusFilter = useCallback((id: number | null) => {
    setFilters((prev) => ({ ...prev, statusId: id }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      breedId: null,
      statusId: null,
      searchQuery: '',
    });
  }, []);

  return {
    filters,
    filteredSows,
    breedOptions,
    statusOptions,
    setBreedFilter,
    setStatusFilter,
    setSearchQuery,
    clearAllFilters,
  };
}
