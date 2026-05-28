import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ListAction from '../../../shared/components/actions/listAction';
import RowCheckbox from '../../../shared/components/selection/rowCheckBox';
import type { Boar } from '../api/boarsApi';

type BoarListItemProps = {
  item: Boar;
  /** Whether the contextual actions modal is open for this specific row. */
  isActive: boolean;
  /** Whether this boar is part of the current multi-selection set. */
  selected: boolean;
  /** Navigate to the boar's detail screen. */
  onPress: () => void;
  /** Open the delete confirmation modal via a long-press gesture. */
  onLongPress: () => void;
  /** Toggle this boar in the multi-selection set. */
  onToggleSelect: () => void;
  /** Open the contextual actions modal for this boar. */
  onOpenActions: () => void;
};

/**
 * List row component for a single Boar entry in BoarsScreen.
 * Supports multi-selection, detail navigation, and contextual actions.
 */
function BoarListItem({
  item,
  isActive,
  selected,
  onPress,
  onLongPress,
  onToggleSelect,
  onOpenActions,
}: BoarListItemProps) {
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
          {item.boar_tag_number ?? '-'}
        </Text>
        <Text style={[styles.textCell, { flexBasis: '45%' }]}>
          <Text style={{ fontWeight: '700' }}>Raza: </Text>
          {item.breeds?.breed_name ?? '-'}
        </Text>
        <Text style={[styles.textCell, { flexBasis: '55%' }]}>
          <Text style={{ fontWeight: '700' }}>Nacimiento: </Text>
          {item.birth_date ? item.birth_date.split('T')[0] : '-'}
        </Text>
        <Text style={[styles.textCell, { flexBasis: '45%' }]}>
          <Text style={{ fontWeight: '700' }}>Edad: </Text>
          {item.age
            ? `${item.age.years}a y ${item.age.months}m`
            : '-'}
          {/* Display age with correct pluralization IF NEEDED */}
          {/* {item.age
            ? `${item.age.years} año${item.age.years === 1 ? "" : "s"} y ${item.age.months} mes${item.age.months === 1 ? "" : "es"}`
            : "-"} */}
        </Text>
        <Text style={[styles.textCell, { flexBasis: '100%' }]}>
          <Text style={{ fontWeight: '700' }}>Descripción: </Text>
          {item.description ?? 'Sin descripción'}
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

export default memo(BoarListItem);
