import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/** Single row of data in the boar info table. */
export type BoarInfoRow = {
  label: string;
  value: string | number;
};

type BoarInfoTableProps = {
  /** Array of label-value pairs to render as a read-only data table. */
  rows: BoarInfoRow[];
};

/**
 * Read-only data table for displaying boar attributes.

 * Each row alternates background color for readability.
 */
function BoarInfoTable({ rows }: BoarInfoTableProps) {
  return (
    <View style={styles.table}>
      {rows.map((row, index) => (
        <View
          key={`${row.label}-${index}`}
          style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
        >
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    // overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    // marginHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#eee'
    // paddingHorizontal: 12,
  },
  rowEven: {
    backgroundColor: '#f9f9f9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  label: {
    // flex: 1,
    fontWeight: '500',
    color: '#555',
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    // flex: 1.5,
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
  },
});

export default memo(BoarInfoTable);
