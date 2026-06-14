import { Alert } from 'react-native';
import { TAG_NUMBER_PATTERN } from '../../../shared/types';
import type { BreedingSowStatus } from '../model/sow';

/**
 * Pure validation utilities for the Sow domain.
*/

/**
 * Validates that a sow tag number matches the allowed character set.
 * Shows an Alert with a user-facing message when the format is invalid.
 *
 * @param tagNumber - The raw tag number string to validate.
 * @returns true if the format is valid, false otherwise.
 */
export function validateSowTagNumberFormat(tagNumber: string): boolean {
  if (!TAG_NUMBER_PATTERN.test(tagNumber)) {
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
 * @property status        - Selected status value. Required in both Add and Edit.
 * @property breedId       - Selected breed ID. Required in both Add and Edit.
 * @property mammaryGlands - Mammary gland count (string in Add, number in Edit). Required in both.
 * @property entryDate     - ISO birth date string or Date object. Required in both.
 */
export interface SowRequiredFields {
  tagNumber: string;
  status: BreedingSowStatus | null | undefined;
  breedId: number | null | undefined;
  mammaryGlands: number | string | null | undefined;
  entryDate: string | Date | null | undefined;
}

/**
 * Validates the Sow required fields.
 * Shows an Alert and returns false if any required field is missing.
 *
 * @param fields - The set of field values to validate.
 * @returns true if all required fields are present, false otherwise.
 */
export function validateSowRequiredFields(fields: SowRequiredFields): boolean {
  const { tagNumber, status, breedId, mammaryGlands, entryDate } = fields;

  if (!tagNumber || !status || !breedId || !mammaryGlands || !entryDate) {
    Alert.alert('Error', 'Por favor, complete todos los campos obligatorios.');
    return false;
  }
  return true;
}
