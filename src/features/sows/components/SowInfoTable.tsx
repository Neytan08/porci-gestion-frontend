import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type SowInfoRow = {
  label: string;
  value: string | number;
};

type SowInfoTableProps = {
  /** Array of label-value pairs to render as a read-only data table. */
  rows: SowInfoRow[];
};

/**
 * Read-only data table for displaying sow attributes in DetailsSowScreen.
 * Renders each row as a label-value pair with a bottom border separator.
 *
 * Used by: DetailsSowScreen.
 */
function SowInfoTable({ rows }: SowInfoTableProps) {
  return (
    <View style={styles.table}>
      {rows.map((item) => (
        <View key={item.label} style={styles.row}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 5,
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

export default memo(SowInfoTable);
