import React, { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type Option = { value: number; label: string };

type Props = {
  options: Option[];
  selectedId: number | null;
  onChange: (id: number | null) => void;
  title?: string;
  allLabel?: string;
};

const StatusFilter: React.FC<Props> = ({
  options,
  selectedId,
  onChange,
  title = "Estado",
  allLabel = "Todos",
}) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>

      <Pressable style={styles.optionRow} onPress={() => onChange(null)}>
        <Text style={[styles.optionText, styles.optionAll]}>{allLabel}</Text>
      </Pressable>

      {options.map((opt) => (
        <Pressable
          key={opt.value}
          style={styles.optionRow}
          onPress={() => onChange(opt.value)}
        >
          <Text
            style={[
              styles.optionText,
              selectedId === opt.value && styles.optionSelected,
            ]}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#555", marginTop: 8, marginBottom: 4 },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16, color: "#333" },
  optionSelected: { color: "#2E7D32", fontWeight: "700" },
  optionAll: { color: "#555" },
});

export default memo(StatusFilter);