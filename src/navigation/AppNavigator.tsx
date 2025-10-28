import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SowsScreen from '../screens/sows/SowsScreen';
import BoarsScreen from '../screens/boars/BoarsScreen';
import AddBoar from '../screens/boars/AddBoarScreen';
import EventsScreen from '../screens/EventsScreen';
import AddSow from '../screens/sows/AddSowScreen';
import DetailsSow from '../screens/sows/DetailsSowScreen';
import EditSow from '../screens/sows/EditSowScreen';

export type RootStackParamList = {
  Home: undefined;
  Sows: undefined;
  Boars: undefined;
  AddBoar: undefined;
  Events: undefined;
  AddSow: undefined;
  DetailsSow: {sowId : number};
  EditSow: {sowId : number};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'PorciGestión', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="Sows" component={SowsScreen} options={{ title: 'Cerdas', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="Boars" component={BoarsScreen} options={{ title: 'Cerdos', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="AddBoar" component={AddBoar} options={{ title: "Agregar Verraco", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="Events" component={EventsScreen} options={{ title: 'Eventos', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="AddSow" component={AddSow} options={{ title: "Agregar Cerda", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="DetailsSow" component={DetailsSow} options={{ title: "Detalles cerda", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="EditSow" component={EditSow} options={{ title: "Editar cerda", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
