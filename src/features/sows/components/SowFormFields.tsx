import { memo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

/** String-typed form values shared by AddSowScreen and EditSowScreen. */
export type SowFormFieldValues = {
  mammary_glands: string;
  weight: string;
  length: string;
  farrowing_number: string;
  description: string;
};

export type SowFormFieldConfig = {
  key: keyof SowFormFieldValues;
  label: string;
  keyboardType?: 'numeric' | 'default';
  multiline?: boolean;
  placeholder?: string;
};

/**
 * Default field configuration used by AddSowScreen.
 * Exported so consuming screens can extend or override as needed.
 */
export const DEFAULT_SOW_FIELDS: SowFormFieldConfig[] = [
  {
    key: 'mammary_glands',
    label: 'Número de Glándulas Mamarias *',
    keyboardType: 'numeric',
    placeholder: 'Ej: 14',
  },
  {
    key: 'weight',
    label: 'Peso (kg)',
    keyboardType: 'numeric',
    placeholder: 'Ej: 120.5',
  },
  {
    key: 'length',
    label: 'Largo (cm)',
    keyboardType: 'numeric',
    placeholder: 'Ej: 150.0',
  },
  {
    key: 'farrowing_number',
    label: 'Número de Partos',
    keyboardType: 'numeric',
    placeholder: '0',
  },
  {
    key: 'description',
    label: 'Descripción',
    multiline: true,
  },
];

/**
 * Field configuration used by EditSowScreen (preserves the original labels).
 * Exported alongside DEFAULT_SOW_FIELDS to keep both screens' label definitions
 * co-located with the shared component.
 */
export const EDIT_SOW_FIELDS: SowFormFieldConfig[] = [
  { key: 'mammary_glands', label: 'Cantidad de pezones *', keyboardType: 'numeric' },
  { key: 'weight', label: 'Peso(cm)', keyboardType: 'numeric' },
  { key: 'length', label: 'Largo(cm)', keyboardType: 'numeric' },
  { key: 'farrowing_number', label: 'Cantidad de partos', keyboardType: 'numeric' },
  { key: 'description', label: 'Descripción', multiline: true },
];

type SowFormFieldsProps = {
  /** Current string values for each field (controlled). */
  values: SowFormFieldValues;
  /** Called with the field key and new string value on every change. */
  onChange: (key: keyof SowFormFieldValues, value: string) => void;
  /** Optional override for the field configuration; defaults to DEFAULT_SOW_FIELDS. */
  fields?: SowFormFieldConfig[];
};

/**
 * Reusable form fields for the common sow numeric and text inputs.
 * Eliminates field duplication between AddSowScreen and EditSowScreen.
 * Accepts a field config array so each screen can supply its own labels
 * while sharing the rendering and style logic.
 *
 * Usage:
 *   AddSowScreen — passes DEFAULT_SOW_FIELDS (implicit) and string form state.
 *   EditSowScreen — passes EDIT_SOW_FIELDS and sow values converted to strings.
 */
function SowFormFields({
  values,
  onChange,
  fields = DEFAULT_SOW_FIELDS,
}: SowFormFieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <View key={field.key}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            accessibilityLabel={`Editar ${field.label}`}
            style={[
              styles.input,
              field.multiline && { height: 100, textAlignVertical: 'top' },
            ]}
            value={values[field.key]}
            onChangeText={(text) => onChange(field.key, text)}
            keyboardType={field.keyboardType === 'numeric' ? 'numeric' : 'default'}
            multiline={field.multiline}
            numberOfLines={field.multiline ? 4 : 1}
            placeholder={field.placeholder}
          />
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#37474F',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});

export default memo(SowFormFields);
