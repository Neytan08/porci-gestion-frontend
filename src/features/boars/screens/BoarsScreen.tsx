import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/rootStack.types';
import SearchFilter from '../../../shared/components/filters/searchFilter';
import ScreenContainer from '../../../shared/components/layout/screenContainer';
import ConfirmDeleteModal from '../../../shared/components/modals/confirmDeleteModal';
import { useMultiSelection } from '../../../shared/hooks/useMultiSelection';
import type { Boar } from '../api/boarsApi';
import BoarActionsModal from '../components/BoarActionsModal';
import BoarFilterSheet from '../components/BoarFilterSheet';
import BoarListItem from '../components/BoarListItem';
import BoarSelectedActionsModal from '../components/BoarSelectedActionsModal';
import { useBoarActions } from '../hooks/useBoarActions';
import { useBoarsAPI } from '../hooks/useBoarsAPI';
import { useBoarsFiltering } from '../hooks/useBoarsFiltering';
import { useBoarsModals } from '../hooks/useBoarsModals';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Boars'>;

/**
 * Main boars list screen.
 * Orchestrates data fetching, filtering, multi-selection, modal state, and navigation
 * by delegating to dedicated hooks and components.
 */
export default function BoarsScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Data fetching and refresh
  const { boars, loading, error, refreshing, loadBoars, onRefresh } = useBoarsAPI();

  // Filtering and search
  const { filters, filteredBoars, breedOptions, setBreedFilter, setSearchQuery, clearAllFilters } =
    useBoarsFiltering(boars);

  // Multi-row selection
  const { selected: selectedBoars, toggleSelect, deselectAll } = useMultiSelection();

  // All modal open/close state
  const {
    filterSheetVisible,
    openFilterSheet,
    closeFilterSheet,
    actionsModalVisible,
    boarAction,
    openActionsModal,
    closeActionsModal,
    deleteModalVisible,
    deleteSelectedBoar,
    openDeleteModal,
    closeDeleteModal,
    selectedActionsVisible,
    openSelectedActionsModal,
    closeSelectedActionsModal,
  } = useBoarsModals();

  // Navigation and delete actions
  const { handleAdd, handleDeletePress, handleBoarAction, confirmDelete, deleting } =
    useBoarActions({
      navigation,
      loadBoars,
      modals: { openDeleteModal, closeActionsModal, closeDeleteModal },
      deleteSelectedBoar,
    });

  // Reload the list every time this screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadBoars();
    }, [loadBoars]),
  );

  if (loading) {
    return (
      <View style={styles.messagesAlignment}>
        <ActivityIndicator size="large" />
        <Text>Cargando verracos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.messagesAlignment}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.mainContainer}>
        {/* Filter bottom-sheet */}
        <BoarFilterSheet
          visible={filterSheetVisible}
          onClose={closeFilterSheet}
          onClear={() => {
            clearAllFilters();
            closeFilterSheet();
          }}
          breedOptions={breedOptions}
          onBreedChange={setBreedFilter}
          selectedBreedId={filters.breedId}
        />

        {/* Boar list */}
        <FlatList<Boar>
          data={filteredBoars}
          keyExtractor={(item) => `${item.boar_id}`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <BoarListItem
              item={item}
              isActive={boarAction?.boar_id === item.boar_id && actionsModalVisible}
              selected={selectedBoars.has(item.boar_id)}
              onPress={() => {
                navigation.navigate('DetailsBoar', { boarId: item.boar_id });
                clearAllFilters();
              }}
              onLongPress={() => handleDeletePress(item.boar_id, item.boar_tag_number)}
              onToggleSelect={() => toggleSelect(item.boar_id)}
              onOpenActions={() => openActionsModal(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.noBoarsText}>No hay verracos registrados.</Text>
          }
          ListHeaderComponent={
            <View style={styles.flatListHeader}>
              <Pressable
                style={({ pressed }) => [
                  styles.filterBtnText,
                  pressed && { backgroundColor: '#e0e0e0', opacity: 0.6 },
                ]}
                onPress={openFilterSheet}
              >
                <Text style={styles.filterLinkText}>Filtrar por</Text>
              </Pressable>
              <SearchFilter value={filters.searchQuery} onChange={setSearchQuery} />
            </View>
          }
          ListHeaderComponentStyle={{ paddingTop: 2, paddingBottom: 4 }}
          contentContainerStyle={{ paddingBottom: 90 }}
        />

        {/* Per-row contextual actions modal */}
        <BoarActionsModal
          visible={actionsModalVisible}
          boar={boarAction}
          onEdit={() => boarAction && handleBoarAction('edit', boarAction)}
          onDetails={() => boarAction && handleBoarAction('moreDetails', boarAction)}
          onDelete={() => boarAction && handleBoarAction('delete', boarAction)}
          onClose={closeActionsModal}
          onBeforeAction={clearAllFilters}
        />

        {/* Floating button — switches between Add and multi-selection actions */}
        {selectedBoars.size > 0 ? (
          <Pressable
            style={({ pressed }) => [
              styles.pinnedBoarButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={openSelectedActionsModal}
          >
            <Image
              source={require('../../../../assets/icons/dots.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.pinnedBoarButtonText}>{`(${selectedBoars.size})   `}</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.pinnedBoarButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => {
              handleAdd();
              clearAllFilters();
            }}
          >
            <Image
              source={require('../../../../assets/icons/add.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.pinnedBoarButtonText}> Agregar</Text>
          </Pressable>
        )}

        {/* Delete confirmation */}
        <ConfirmDeleteModal
          visible={deleteModalVisible && deleteSelectedBoar !== null}
          name={deleteSelectedBoar?.boar_tag_number}
          title="Eliminar verraco"
          message={`¿Seguro que desea eliminar al verraco ${deleteSelectedBoar?.boar_tag_number ?? ''}?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={deleting}
          onConfirm={() => {
            confirmDelete();
            clearAllFilters();
          }}
          onCancel={closeDeleteModal}
        />

        {/* Batch actions modal for the current multi-selection */}
        <BoarSelectedActionsModal
          visible={selectedActionsVisible}
          selectedCount={selectedBoars.size}
          onClose={closeSelectedActionsModal}
          onDeselect={deselectAll}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  icon: { width: 42, height: 42 },
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 4,
  },
  messagesAlignment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBoarsText: {
    textAlign: 'center',
    marginTop: 20,
  },
  flatListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  filterLinkText: {
    fontSize: 14,
    fontWeight: '400',
  },
  filterBtnText: {
    minHeight: 40,
    minWidth: 150,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  pinnedBoarButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFA000',
    width: 140,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  pinnedBoarButtonText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 2,
  },
});



