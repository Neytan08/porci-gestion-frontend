/**
 * Utility functions for string comparison and sanitization.
 */

/**
 * Sanitizes a string by:
 * - Removing diacritics (e.g., accents like á, é, í).
 * - Removing non-alphanumeric characters (except spaces).
 * - Converting to lowercase for case-insensitive comparison.
 *
 * @param input The string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeString = (input: string): string => {
  return input
    .normalize("NFD") // Normalize to decompose diacritics (e.g., á -> a + ́)
    .replace(/[^a-zA-Z0-9]/g, "") // Remove all non-alphanumeric characters
    .toLowerCase(); // Convert to lowercase for case-insensitive comparison
};

/**
 * Compares two strings for equality after sanitization.
 *
 * @param str1 The first string to compare.
 * @param str2 The second string to compare.
 * @returns True if the sanitized strings are equal, false otherwise.
 */
export const areStringsEqual = (str1: string, str2: string): boolean => {
  return sanitizeString(str1) === sanitizeString(str2);
};

/**
 * Checks if a string contains special characters such as punctuation marks.
 *
 * @param input The string to check.
 * @returns True if the string contains special characters, false otherwise.
 */
export const containsSpecialCharacters = (input: string): boolean => {
  // Regular expression to match special characters (excluding spaces and alphanumerics)
  const specialCharacterRegex = /[^a-zA-Z0-9\s]/;
  return specialCharacterRegex.test(input);
};

export default {
  sanitizeString,
  areStringsEqual,
  containsSpecialCharacters,
};