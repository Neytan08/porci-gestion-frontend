import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EditAction from '../../../shared/components/actions/editAction';

/** Single row of data in the boar info table. */
export type BoarInfoRow = {
  label: string;
  value: string | number;
};

type BoarInfoTableProps = {
  /** Array of label-value pairs to render as a read-only data table. */
  rows: BoarInfoRow[];
  /** Callback for editing the current boar from the table header. */
  onEdit: () => void;
};

/**
 * Read-only data table for displaying boar attributes.

 * Each row alternates background color for readability.
 */
function BoarInfoTable({ rows, onEdit }: BoarInfoTableProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalles del verraco</Text>
        <EditAction onPress={onEdit} size={24} color="#fff" />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {rows.map((row, index) => (
          <View
            key={`${row.label}-${index}`}
            style={styles.row}>
            <Text style={styles.label}>{row.label}</Text>
            <Text style={styles.value}>{row.value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  row: {
    backgroundColor: "#fff",
		borderRadius: 10,
		padding: 10,
		marginBottom: 5,
		borderWidth: 1,
		borderColor: "#eee",
  },
  label: {
    fontWeight: '500',
    color: '#555',
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    color: '#333',
  },
});

export default memo(BoarInfoTable);
