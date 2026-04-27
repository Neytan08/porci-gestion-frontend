import { memo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type SearchFilterProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  label?: string;
};

/**
 * Simple shared search field used in list headers and filter sections.
 */
function SearchFilter({
  value,
  onChange,
  placeholder = "Ingresar nombre",
  label = "Buscar:",
}: SearchFilterProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "400",
    marginRight: 4,
  },
  input: {
    width: 170,
    paddingVertical: 4,
    fontSize: 14,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
});

export default memo(SearchFilter);