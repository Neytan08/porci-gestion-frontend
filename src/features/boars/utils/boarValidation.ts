import { Alert } from 'react-native';
import { TAG_NUMBER_PATTERN } from '../../../shared/types';

/**
 * Pure validation utilities for the Boar domain.
 */

/**
 * Validates that a boar tag number matches the allowed character set.
 * Shows an Alert with a user-facing message when the format is invalid.
 *
 * @param tagNumber - The raw tag number string to validate.
 * @returns true if the format is valid, false otherwise.
 */
export function validateBoarTagNumberFormat(tagNumber: string): boolean {
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
 * Fields evaluated by validateBoarRequiredFields.
 *
 * @property tagNumber - Boar identifier. Required in both Add and Edit.
 * @property breedId   - Selected breed ID. Required in both Add and Edit.
 * @property birthDate - ISO birth date string or Date object. Required in both.
 */
export interface BoarRequiredFields {
  tagNumber: string;
  breedId: number | null | undefined;
  birthDate: string | Date | null | undefined;
}

/**
 * Validates the Boar required fields.
 * Shows an Alert and returns false if any required field is missing.
 *
 * @param fields - The set of field values to validate.
 * @returns true if all required fields are present, false otherwise.
 */
export function validateBoarRequiredFields(fields: BoarRequiredFields): boolean {
  const { tagNumber, breedId, birthDate } = fields;
  if (!tagNumber || !breedId || !birthDate) {
    Alert.alert('Error', 'Por favor, complete todos los campos obligatorios.');
    return false;
  }
  return true;
}