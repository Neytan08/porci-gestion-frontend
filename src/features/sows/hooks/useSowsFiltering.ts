import { useCallback, useMemo, useState } from 'react';
import type { Sow } from '../api/sowsApi';
import { applyAllFilters, type FilterCriteria } from '../utils/sowFilters';
import {
  type BreedOptionItem,
  extractSowBreedOptions,
  extractSowStatusOptions,
  type StatusOptionItem,
} from '../utils/sowOptionsBuilder';

export interface SowFilterCriteria extends FilterCriteria {}

export interface BreedFilterOption extends BreedOptionItem {}

export interface StatusFilterOption extends StatusOptionItem {}

interface UseSowsFilteringReturn {
  filters: SowFilterCriteria;
  filteredSows: Sow[];
  breedOptions: BreedFilterOption[];
  statusOptions: StatusFilterOption[];
  setBreedFilter: (id: number | null) => void;
  setStatusFilter: (status: Sow['status'] | null) => void;
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
    status: null,
    searchQuery: '',
  });

  const breedOptions = useMemo<BreedFilterOption[]>(() => {
    return extractSowBreedOptions(sows);
  }, [sows]);

  const statusOptions = useMemo<StatusFilterOption[]>(() => {
    return extractSowStatusOptions(sows);
  }, [sows]);

  const filteredSows = useMemo(() => {
    return applyAllFilters(sows, filters);
  }, [sows, filters]);

  const setBreedFilter = useCallback((id: number | null) => {
    setFilters((prev) => ({ ...prev, breedId: id }));
  }, []);

  const setStatusFilter = useCallback((status: Sow['status'] | null) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      breedId: null,
      status: null,
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
