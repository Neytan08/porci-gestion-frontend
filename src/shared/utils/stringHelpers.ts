/**
 * Utility helpers for normalizing and comparing user-facing strings.
 */

// Removes diacritics and non-alphanumeric characters for safe comparisons.
export const sanitizeString = (input: string): string => {
	return input
		.normalize("NFD")
		.replace(/[^a-zA-Z0-9]/g, "")
		.toLowerCase();
};

// Compares two strings after applying the same sanitization rules.
export const areStringsEqual = (str1: string, str2: string): boolean => {
	return sanitizeString(str1) === sanitizeString(str2);
};

// Checks whether a string contains punctuation or other special characters.
export const containsSpecialCharacters = (input: string): boolean => {
	const specialCharacterRegex = /[^a-zA-Z0-9\s]/;
	return specialCharacterRegex.test(input);
};

export default {
	sanitizeString,
	areStringsEqual,
	containsSpecialCharacters,
};
