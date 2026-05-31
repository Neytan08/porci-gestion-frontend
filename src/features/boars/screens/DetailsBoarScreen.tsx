import type { RouteProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/rootStack.types';
import EditAction from '../../../shared/components/actions/editAction';
import ScreenContainer from '../../../shared/components/layout/screenContainer';
import BoarInfoTable from '../components/BoarInfoTable';
import BoarProfileHeader from '../components/BoarProfileHeader';
import { useBoarLoader } from '../hooks/useBoarLoader';
import { buildBoarRows } from '../utils/boarDetailsRows';

type DetailsRouteProp = RouteProp<RootStackParamList, 'DetailsBoar'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DetailsBoar'>;

/**
 * Read-only detail screen for a single Boar.
 * Reloads data every time the screen gains focus via useFocusEffect.
 * Delegates data fetching to useBoarLoader and rendering to BoarProfileHeader and BoarInfoTable.
 */
export default function DetailsBoarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const { boarId } = route.params;

  const { boar, loading, error, loadBoar } = useBoarLoader(boarId);

  const datos = useMemo(() => (boar ? buildBoarRows(boar) : []), [boar]);

  useFocusEffect(
    useCallback(() => {
      loadBoar();
    }, [loadBoar]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando verraco...</Text>
      </View>
    );
  }

  if (error || !boar) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error ?? 'No se pudo cargar el verraco.'}</Text>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.scrollContent}>
        {/* Profile header — read-only in Details (no onEditTag) */}
        <View style={styles.imageAndNameContainer}>
          <BoarProfileHeader tagNumber={boar.boar_tag_number} />
        </View>

        {/* Data table with edit shortcut in the header */}
        <Pressable
          style={({ pressed }) => [
            styles.editDetails,
            pressed && { backgroundColor: '#e0e0e0', opacity: 0.6 },
          ]}
        >
          <View style={styles.detailsView}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}>
              Detalles del verraco
            </Text>
            <EditAction
              onPress={() => navigation.navigate('EditBoar', { boarId })}
              size={24}
              color="#fff"
            />
          </View>
          <BoarInfoTable rows={datos} />
        </Pressable>
      </View>

      {/* Navigation buttons */}
      <View style={styles.bottomButtons}>
        {(['Cruces', 'Editar'] as const).map((title) => (
          <TouchableOpacity
            key={title}
            style={styles.button}
            onPress={title === 'Editar' ? () => navigation.navigate('EditBoar', { boarId }) : undefined}
          >
            <Text style={styles.buttonText}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
    padding: 5,
  },
  imageAndNameContainer: {
    alignItems: 'center',
    margin: 20,
  },
  editDetails: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  detailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    padding: 8,
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
});

