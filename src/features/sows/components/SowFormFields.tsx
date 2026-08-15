import { memo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

/** String-typed form values */
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
  keyboardType?: "numeric" | "default";
  multiline?: boolean;
  placeholder?: string;
};

/**
 * Placeholders are intentionally kept for edit mode — they guide the user
 * when a numeric field has been cleared before re-entering a value.
 */
export const DEFAULT_SOW_FIELDS: SowFormFieldConfig[] = [
  {
    key: "mammary_glands",
    label: "Número de Glándulas Mamarias *",
    keyboardType: "numeric",
    placeholder: "Ej: 14",
  },
  {
    key: "weight",
    label: "Peso (kg)",
    keyboardType: "numeric",
    placeholder: "Ej: 120.5",
  },
  {
    key: "length",
    label: "Largo (cm)",
    keyboardType: "numeric",
    placeholder: "Ej: 150.0",
  },
  {
    key: "farrowing_number",
    label: "Número de Partos",
    keyboardType: "numeric",
    placeholder: "Ej: 3",
  },
  {
    key: "description",
    label: "Descripción",
    multiline: true,
  },
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
 * Accepts a field config array so each screen can supply its own labels
 * while sharing the rendering and style logic.
 */
function SowFormFields({ values, onChange, fields = DEFAULT_SOW_FIELDS }: SowFormFieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <View key={field.key}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            accessibilityLabel={`Editar ${field.label}`}
            style={[styles.input, field.multiline && { height: 100, textAlignVertical: "top" }]}
            value={values[field.key]}
            onChangeText={(text) => onChange(field.key, text)}
            keyboardType={field.keyboardType === "numeric" ? "numeric" : "default"}
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
    borderColor: "#37474F",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});

export default memo(SowFormFields);
