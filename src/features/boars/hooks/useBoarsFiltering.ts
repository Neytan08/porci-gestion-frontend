import { useCallback, useMemo, useState } from 'react';
import type { Boar } from '../api/boarsApi';
import { applyAllBoarFilters, type BoarFilterCriteria } from '../utils/boarFilters';
import { extractBoarBreedOptions, type OptionItem } from '../utils/boarOptionsBuilder';

export interface BoarFilterCriteriaState extends BoarFilterCriteria {}

export interface FilterOption extends OptionItem {}

interface UseBoarsFilteringReturn {
  filters: BoarFilterCriteriaState;
  filteredBoars: Boar[];
  breedOptions: FilterOption[];
  setBreedFilter: (id: number | null) => void;
  setSearchQuery: (query: string) => void;
  clearAllFilters: () => void;
}

/**
 * Hook for managing Boars filtering logic.
 * Delegates filtering and option extraction to shared feature helpers.
 */
export function useBoarsFiltering(boars: Boar[]): UseBoarsFilteringReturn {
  const [filters, setFilters] = useState<BoarFilterCriteriaState>({
    breedId: null,
    searchQuery: '',
  });

  const breedOptions = useMemo<FilterOption[]>(() => extractBoarBreedOptions(boars), [boars]);

  const filteredBoars = useMemo(() => applyAllBoarFilters(boars, filters), [boars, filters]);

  const setBreedFilter = useCallback((id: number | null) => {
    setFilters((prev) => ({ ...prev, breedId: id }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({ breedId: null, searchQuery: '' });
  }, []);

  return { filters, filteredBoars, breedOptions, setBreedFilter, setSearchQuery, clearAllFilters };
}
