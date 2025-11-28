import React, { memo } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  label?: string;
};

const SearchFilter: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Ingresar nombre",
  label = "Buscar:",
}) => {
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
        />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
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