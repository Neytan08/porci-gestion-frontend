import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { getApiErrorMessage, hasApiStatus } from '../../../shared/api/apiError';
import ScreenContainer from '../../../shared/components/layout/screenContainer';
import DatePickerField from '../../../shared/components/selection/datePicker';
import { localDateToUtcMidnight } from '../../../shared/utils/dateHelpers';
import { BreedDropdown } from '../../reference-data/breeds/components/BreedDropdown';
import { createBoar } from '../api/boarsApi';
import BoarFormFields, { type BoarFormFieldValues } from '../components/BoarFormFields';
import { buildBoarApiPayload } from '../utils/boarTransforms';
import { validateBoarRequiredFields, validateBoarTagNumberFormat } from '../utils/boarValidation';

export default function AddBoarScreen() {
  const navigation = useNavigation();
  const [tagNumber, setTagNumber] = useState('');
  const [birthDate, setBirthDate] = useState<Date>(localDateToUtcMidnight(new Date()));
  const [breedId, setBreedId] = useState<number | null>(null);
  const [fields, setFields] = useState<BoarFormFieldValues>({ weight: '', length: '', description: '' });

  const handleSubmit = async () => {
    if (!validateBoarRequiredFields({ tagNumber, breedId, birthDate })) return;
    if (!validateBoarTagNumberFormat(tagNumber)) return;
    try {
      const payload = buildBoarApiPayload({
        boar_tag_number: tagNumber,
        birth_date: birthDate.toISOString(),
        breed_id: breedId,
        ...fields,
      });
      await createBoar(payload);
      Alert.alert('Éxito', 'Verraco agregado correctamente.');
      navigation.goBack();
    } catch (error) {
      const message = hasApiStatus(error, 409)
        ? "Ya existe un registro con este identificador. Por favor, use un identificador único."
        : getApiErrorMessage(error, { fallback: "Hubo un problema al agregar el verraco. Intente nuevamente." });
      Alert.alert("Error", message);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView style={styles.mainContainer}>
        <Text style={styles.title}>Agregar Nuevo Verraco</Text>
        <Text style={styles.label}>Identificador Animal *</Text>
        <TextInput
          style={styles.input}
          value={tagNumber}
          onChangeText={setTagNumber}
          placeholder="Ej: 12345 o nombre"
        />
        <BreedDropdown
          value={breedId}
          onChange={(value: number) => setBreedId(value)}
        />
        <DatePickerField
          label="Fecha de Nacimiento *"
          value={birthDate}
          onChange={setBirthDate}
        />
        <BoarFormFields
          values={fields}
          onChange={(key, val) => setFields((prev) => ({ ...prev, [key]: val }))}
        />
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Guardar</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#37474F',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FFA000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});