import { Alert } from 'react-native';

/**
 * Pure validation utilities for the Sow domain.
*/

/**
 * Allowed characters for a sow tag number: letters, digits, hyphens, underscores,
 * and single spaces — but only between characters (never at the start or end).
 *
 * Pattern breakdown:
 *   ^[a-zA-Z0-9_-]+        — must start with one or more allowed chars (no leading space)
 *   (?:\s[a-zA-Z0-9_-]+)* — zero or more groups of: exactly ONE space followed by
 *                            one or more allowed chars (enforces no trailing space and
 *                            no consecutive spaces)
 *   $                      — end of string
 *
 * Valid:   "ABC-123", "Cerda Prueba", "cerda_01"
 * Invalid: " Cerda" (leading space), "Cerda " (trailing space), "Cerda  Prueba" (double space)
 */
const SOW_TAG_NUMBER_PATTERN = /^[a-zA-Z0-9_-]+(?:\s[a-zA-Z0-9_-]+)*$/;

/**
 * Validates that a sow tag number matches the allowed character set.
 * Shows an Alert with a user-facing message when the format is invalid.
 *
 * @param tagNumber - The raw tag number string to validate.
 * @returns true if the format is valid, false otherwise.
 */
export function validateSowTagNumberFormat(tagNumber: string): boolean {
  if (!SOW_TAG_NUMBER_PATTERN.test(tagNumber)) {
    Alert.alert(
      'Error',
      'El identificador contiene caracteres no permitidos. Solo se aceptan letras, números, guiones (-), guiones bajos (_) y espacios entre caracteres (no al inicio ni al final).',
    );
    return false;
  }
  return true;
}

/**
 * Fields evaluated by validateSowRequiredFields.
 *
 * @property tagNumber     - Sow identifier. Required in both Add and Edit.
 * @property statusId      - Selected status ID. Required in both Add and Edit.
 * @property breedId       - Selected breed ID. Required in both Add and Edit.
 * @property mammaryGlands - Mammary gland count (string in Add, number in Edit). Required in both.
 * @property entryDate     - ISO entry date string. Pass only from EditSowScreen — the Add screen
 *                           always initialises this field so it never needs validation there.
 */
export interface SowRequiredFields {
  tagNumber: string;
  statusId: number | null | undefined;
  breedId: number | null | undefined;
  mammaryGlands: number | string | null | undefined;
  entryDate?: string | null;
}

/**
 * Validates the required fields shared by AddSowScreen and EditSowScreen.
 * Shows an Alert and returns false if any required field is missing.
 *
 * `entryDate` is only validated when explicitly passed — the Add screen
 * initialises it via useState and it is always valid, so it should not be included.
 *
 * @param fields - The set of field values to validate.
 * @returns true if all required fields are present, false otherwise.
 */
export function validateSowRequiredFields(fields: SowRequiredFields): boolean {
  const { tagNumber, statusId, breedId, mammaryGlands, entryDate } = fields;

  // entryDate is validated only when provided (Edit flow); undefined means "not applicable" (Add flow)
  const entryDateValid = entryDate === undefined || Boolean(entryDate);

  if (!tagNumber || !statusId || !breedId || !mammaryGlands || !entryDateValid) {
    Alert.alert('Error', 'Por favor, complete todos los campos obligatorios.');
    return false;
  }
  return true;
}
