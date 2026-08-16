import { memo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import EditAction from "../../../shared/components/actions/editAction";

/** Single row of data in the boar info table. */
export type BoarInfoRow = {
  label: string;
  value: string | number;
};

type BoarInfoTableProps = {
  /** Array of label-value pairs to render as read-only boar details. */
  rows: BoarInfoRow[];
  /** Callback for editing the current boar from the card header. */
  onEdit: () => void;
  /** Whether to show the edit action in the card header. */
  showEditAction?: boolean;
};

const WIDE_LABELS = new Set(["Fecha de Nacimiento", "Fecha de retiro", "Motivo de retiro"]);
const FEATURED_LABEL = "Raza";

function isWideRow(label: string) {
  return WIDE_LABELS.has(label) || label.toLowerCase().startsWith("descripci");
}

function isFeaturedRow(label: string) {
  return label === FEATURED_LABEL;
}

/**
 * Compact read-only card for displaying boar attributes.
 */
function BoarInfoTable({ rows, onEdit, showEditAction = true }: BoarInfoTableProps) {
  return (
    <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Detalles del verraco</Text>
          {showEditAction ? <EditAction onPress={onEdit} size={30} color="#2E7D32" /> : null}
        </View>

        <View style={styles.grid}>
          {rows.map((row) =>
            isFeaturedRow(row.label) ? (
              <View key={row.label} style={styles.featuredCell}>
                <Text style={styles.featuredLabel}>{row.label}</Text>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredValue}>{row.value}</Text>
                </View>
              </View>
            ) : (
              <Text key={row.label} style={isWideRow(row.label) ? styles.cellWide : styles.cell}>
                <Text style={styles.label}>{row.label}: </Text>
                {row.value}
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
  featuredCell: {
    flexBasis: "100%",
    marginBottom: 16,
  },
  featuredLabel: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  featuredBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F5E9",
    borderColor: "#A5D6A7",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featuredValue: {
    color: "#2E7D32",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default memo(BoarInfoTable);
