import { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EditAction from '../../../shared/components/actions/editAction';

/** Single row of data in the sow info table. */
export type SowInfoRow = {
  label: string;
  value: string | number;
};

type SowInfoTableProps = {
  /** Array of label-value pairs to render as a read-only data table. */
  rows: SowInfoRow[];
  /** Callback for editing the current sow from the table header. */
  onEdit: () => void;
};

/**
 * Read-only data table for displaying sow attributes.
 * Each row alternates background color for readability.
 */
function SowInfoTable({ rows, onEdit }: SowInfoTableProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Detalles de la cerda</Text>
        <EditAction onPress={onEdit} size={24} color="#fff" />
      </View>
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {rows.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
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
    fontWeight: '700',
    color: '#555',
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 15,
    color: '#333',
  },
});

export default memo(SowInfoTable);
