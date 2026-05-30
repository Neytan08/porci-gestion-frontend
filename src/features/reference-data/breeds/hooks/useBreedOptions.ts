import { useCallback, useEffect, useState } from "react";
import { getBreed } from "../api/breedApi";
import type { Breed } from "../model/breed";

export type BreedOption = { label: string; value: number };

interface UseBreedOptionsReturn {
	options: BreedOption[];
	loading: boolean;
	/** Re-fetches the breed list and appends a newly created entry. */
	appendOption: (breed: Breed) => void;
}

/**
 * Fetches the breed list from the API and maps it to label/value pairs.
 * Exposes `appendOption` so BreedDropdown can add new breeds without a full refetch.
 */
export function useBreedOptions(): UseBreedOptionsReturn {
	const [options, setOptions] = useState<BreedOption[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchBreeds = useCallback(async () => {
		try {
			const data = await getBreed();
			setOptions(data.map((b) => ({ label: b.breed_name, value: b.breed_id })));
		} catch (error) {
			console.error("Error fetching breeds:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBreeds();
	}, [fetchBreeds]);

	const appendOption = useCallback((breed: Breed) => {
		setOptions((prev) => [...prev, { label: breed.breed_name, value: breed.breed_id }]);
	}, []);

	return { options, loading, appendOption };
}
