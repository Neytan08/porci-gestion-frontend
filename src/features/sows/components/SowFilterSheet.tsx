import { memo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import OptionsFilter from '../../../shared/components/filters/optionsFilter';
import type { BreedFilterOption, StatusFilterOption } from '../hooks/useSowsFiltering';
import type { Sow } from '../model/sow';

type SowFilterSheetProps = {
  visible: boolean;
  /** Closes the sheet (also used as the Apply action since filters apply reactively). */
  onClose: () => void;
  /** Resets all active filter criteria to their initial state. */
  onClear: () => void;
  statusOptions: StatusFilterOption[];
  breedOptions: BreedFilterOption[];
  onStatusChange: (status: Sow['status'] | null) => void;
  onBreedChange: (id: number | null) => void;
  /** Currently selected status filter value, used to highlight the active option. */
  selectedStatus: Sow['status'] | null;
  /** Currently selected breed filter ID, used to highlight the active option. */
  selectedBreedId: number | null;
};

/**
 * Bottom-sheet modal for filtering sows by status and breed in SowsScreen.
 * Filters are applied reactively; "Aplicar" simply closes the sheet.
 * Receives all filter options and change callbacks from useSowsFiltering.
 */
function SowFilterSheet({
  visible,
  onClose,
  onClear,
  statusOptions,
  breedOptions,
  onStatusChange,
  onBreedChange,
  selectedStatus,
  selectedBreedId,
}: SowFilterSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Filtros</Text>
          <OptionsFilter
            options={statusOptions}
            selectedId={selectedStatus}
            onChange={onStatusChange}
            title="Estado"
          />
          <View style={styles.divider} />
          <OptionsFilter
            options={breedOptions}
            selectedId={selectedBreedId}
            onChange={onBreedChange}
            title="Raza"
          />
          <View style={styles.btnRow}>
            <Pressable
              style={[styles.btn, { backgroundColor: '#e0e0e0' }]}
              onPress={onClear}
            >
              <Text style={{ fontWeight: '700', color: '#333' }}>Limpiar filtros</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: '#2E7D32' }]}
              onPress={onClose}
            >
              <Text style={{ fontWeight: '700', color: '#fff' }}>Aplicar</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default memo(SowFilterSheet);
