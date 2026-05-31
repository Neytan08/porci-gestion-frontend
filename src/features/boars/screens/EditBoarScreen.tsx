import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../../app/navigation/rootStack.types';
import { getApiErrorMessage } from '../../../shared/api/apiError';
import ScreenContainer from '../../../shared/components/layout/screenContainer';
import DatePickerField from '../../../shared/components/selection/datePicker';
import { BreedDropdown } from '../../reference-data/breeds/components/BreedDropdown';
import { checkBoarTagNumberExists, updateBoar } from '../api/boarsApi';
import BoarFormFields, { type BoarFormFieldValues } from '../components/BoarFormFields';
import BoarProfileHeader from '../components/BoarProfileHeader';
import EditBoarTagModal from '../components/EditBoarTagModal';
import { useBoarLoader } from '../hooks/useBoarLoader';
import { buildBoarApiPayload } from '../utils/boarTransforms';
import { validateBoarRequiredFields, validateBoarTagNumberFormat } from '../utils/boarValidation';

type EditBoarRouteProp = RouteProp<RootStackParamList, 'EditBoar'>;

const NUMERIC_KEYS: ReadonlyArray<keyof BoarFormFieldValues> = ['weight', 'length'];

export default function EditBoarScreen() {

  const navigation = useNavigation();
  const route = useRoute<EditBoarRouteProp>();
  const { boarId } = route.params;
  const { boar, setBoar, loading, error, loadBoar } = useBoarLoader(boarId);
  const [editTagVisible, setEditTagVisible] = useState(false);
  // Stores the tag number that came from the server so we can skip the
  // duplicate check when the user saves without changing it.
  const originalTagRef = useRef<string | null>(null);

  useEffect(() => {
    loadBoar();
  }, [loadBoar]);

  // Capture the original tag the first time boar data arrives.
  useEffect(() => {
    if (boar && originalTagRef.current === null) {
      originalTagRef.current = boar.boar_tag_number;
    }
  }, [boar]);

  const formValues: BoarFormFieldValues = {
    weight: boar?.weight?.toString() ?? '',
    length: boar?.length?.toString() ?? '',
    description: boar?.description ?? '',
  };


  const handleFormChange = useCallback((key: keyof BoarFormFieldValues, value: string) => {
    if (!boar) return;
    const parsed = NUMERIC_KEYS.includes(key) ? (value === '' ? null : parseFloat(value)) : value;
    setBoar({ ...boar, [key]: parsed });
  }, [boar, setBoar]);

  const handleUpdateBoar = async () => {
    if (!boar) return;
    if (!validateBoarRequiredFields({ tagNumber: boar.boar_tag_number, breedId: boar.breed_id, birthDate: boar.birth_date })) return;
    if (!validateBoarTagNumberFormat(boar.boar_tag_number)) return;
    try {
      // Only check for duplicates if the tag number was changed.
      const tagChanged = boar.boar_tag_number !== originalTagRef.current;
      if (tagChanged) {
        const isDuplicate = await checkBoarTagNumberExists(boar.boar_tag_number);
        if (isDuplicate) {
          Alert.alert('Error', 'Ya existe un registro con este identificador. Por favor, use un identificador único.');
          return;
        }
      }
      await updateBoar(boarId, buildBoarApiPayload(boar));
      Alert.alert('Éxito', 'La información del verraco se ha actualizado correctamente.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', getApiErrorMessage(err, { fallback: 'No se pudo actualizar el verraco.' }));
    }
  };

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
        <Pressable onPress={loadBoar}>
          <Text style={{ color: 'blue' }}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView style={styles.mainContainer}>
        <BoarProfileHeader
          tagNumber={boar.boar_tag_number}
          onEditTag={() => setEditTagVisible(true)}
        />
        <EditBoarTagModal
          visible={editTagVisible}
          initialValue={boar.boar_tag_number}
          onConfirm={(tag) => {
            setBoar({ ...boar, boar_tag_number: tag });
            setEditTagVisible(false);
          }}
          onCancel={() => setEditTagVisible(false)}
        />
        <BreedDropdown
          value={boar.breeds?.breed_id ?? boar.breed_id ?? null}
          onChange={(newBreedId: number, label: string) => {
            setBoar({
              ...boar,
              breed_id: newBreedId,
              breeds: { breed_id: newBreedId, breed_name: label },
            });
          }}
        />
        <DatePickerField
          label="Fecha de Nacimiento *"
          value={boar.birth_date ? new Date(boar.birth_date) : new Date()}
          onChange={(newDate: Date) => setBoar({ ...boar, birth_date: newDate.toISOString() })}
        />
        <BoarFormFields values={formValues} onChange={handleFormChange} />
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          onPress={handleUpdateBoar}
        >
          <Text style={styles.buttonText}>Actualizar</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFA000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

