import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ListAction from '../../../shared/components/actions/listAction';
import RowCheckbox from '../../../shared/components/selection/rowCheckBox';
import { formatIsoDate } from '../../../shared/utils/dateHelpers';
import type { Sow } from '../api/sowsApi';

type SowListItemProps = {
  item: Sow;
  /** Whether the contextual actions modal is open for this specific row. */
  isActive: boolean;
  /** Whether this sow is part of the current multi-selection set. */
  selected: boolean;
  /** Navigate to the sow's detail screen. */
  onPress: () => void;
  /** Open the delete confirmation modal via a long-press gesture. */
  onLongPress: () => void;
  /** Toggle this sow in the multi-selection set. */
  onToggleSelect: () => void;
  /** Open the contextual actions modal for this sow. */
  onOpenActions: () => void;
};

/**
 * List row component for a single Sow entry in SowsScreen.
 * Supports multi-selection, detail navigation, and contextual actions.
 */
function SowListItem({
  item,
  isActive,
  selected,
  onPress,
  onLongPress,
  onToggleSelect,
  onOpenActions,
}: SowListItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.pressableRow,
        pressed && { backgroundColor: '#e0e0e0', opacity: 0.6 },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[styles.contentRow, isActive && styles.contentRowActive]}>
        <RowCheckbox
          selected={selected}
          onPress={onToggleSelect}
          size={18}
          radius={4}
          width={1}
          color={'#eee'}
          style={styles.checkBox}
        />
        <Text style={[styles.textCell, { flexBasis: '55%' }]}>
          <Text style={{ fontWeight: '700' }}>Identificador: </Text>
          {item.sow_tag_number ?? '-'}
        </Text>
        <Text style={[styles.textCell, { flexBasis: '45%' }]}>
          <Text style={{ fontWeight: '700' }}>Estado: </Text>
          {item.status ?? 'Sin estado'}
        </Text>
        <Text style={[styles.textCell, { flexBasis: '55%' }]}>
          <Text style={{ fontWeight: '700' }}>Ingreso: </Text>
          {item.entry_date ? formatIsoDate(item.entry_date) : '-'}
        </Text>
        <Text style={[styles.textCell, { flexBasis: '40%' }]}>
          <Text style={{ fontWeight: '700' }}>Partos: </Text>
          {item.farrowing_number ?? '-'}
        </Text>
        <View style={styles.detailsButton}>
          <ListAction onPress={onOpenActions} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableRow: {
    flexDirection: 'row',
    borderRadius: 10,
    marginBottom: 5,
  },
  contentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  contentRowActive: {
    backgroundColor: '#e2e2e2',
  },
  textCell: {
    color: '#333',
    fontSize: 14,
    marginBottom: 2,
  },
  checkBox: {
    position: 'absolute',
    left: -4,
    top: -3,
  },
  detailsButton: {
    width: '101%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minHeight: 40,
    marginTop: -20,
    marginBottom: -5,
    marginRight: -20,
  },
});

export default memo(SowListItem);
