import { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import EditAction from "../../../shared/components/actions/editAction";

/** Single row of data in the sow info table. */
export type SowInfoRow = {
  label: string;
  value: string | number;
};

type SowInfoTableProps = {
  /** Array of label-value pairs to render as read-only sow details. */
  rows: SowInfoRow[];
  /** Callback for editing the current sow from the card header. */
  onEdit: () => void;
  /** Whether to show the edit action in the card header. */
  showEditAction?: boolean;
};

const WIDE_LABELS = new Set(["Fecha de entrada", "Notas"]);
const STATUS_LABEL = "Estado";

function isWideRow(label: string) {
  return WIDE_LABELS.has(label) || label.toLowerCase().startsWith("descripci");
}

function isStatusRow(label: string) {
  return label === STATUS_LABEL;
}

/**
 * Compact read-only card for displaying sow attributes.
 */
function SowInfoTable({ rows, onEdit, showEditAction = true }: SowInfoTableProps) {
  return (
    <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Detalles de la cerda</Text>
          {showEditAction ? <EditAction onPress={onEdit} size={30} color="#2E7D32" /> : null}
        </View>

        <View style={styles.grid}>
          {rows.map((item) =>
            isStatusRow(item.label) ? (
              <View key={item.label} style={styles.statusCell}>
                <Text style={styles.statusLabel}>{item.label}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusValue}>{item.value}</Text>
                </View>
              </View>
            ) : (
              <Text key={item.label} style={isWideRow(item.label) ? styles.cellWide : styles.cell}>
                <Text style={styles.label}>{item.label}: </Text>
                {item.value}
              </Text>
            ),
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    flexGrow: 1,
    marginHorizontal: 5,
    marginBottom: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },
  cell: {
    color: "#333",
    flexBasis: "50%",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    paddingRight: 14,
  },
  cellWide: {
    color: "#333",
    flexBasis: "100%",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  label: {
    fontWeight: "700",
  },
  statusCell: {
    flexBasis: "100%",
    marginBottom: 16,
  },
  statusLabel: {
    // color: "#555",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    borderColor: "#A5D6A7",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusValue: {
    color: "#2E7D32",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default memo(SowInfoTable);
