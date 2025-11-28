import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SowsScreen from '../screens/sows/SowsScreen';
import AddSow from '../screens/sows/AddSowScreen';
import DetailsSow from '../screens/sows/DetailsSowScreen';
import EditSow from '../screens/sows/EditSowScreen';
import BoarsScreen from '../screens/boars/BoarsScreen';
import AddBoar from '../screens/boars/AddBoarScreen';
import MattingEventsScreen from '../screens/matingEvents/MatingEventsScreen';
import AddMatingEventScreen from '../screens/matingEvents/AddMatingEventScreen';
import EditMatingEventScreen from '../screens/matingEvents/EditMatingEventScreen';
import DetailsMatingEventScreen from '../screens/matingEvents/DetailsMatingEventScreen';

export type RootStackParamList = {
  Home: undefined;
  Sows: undefined;
  AddSow: undefined;
  EditSow: {sowId : number};
  DetailsSow: {sowId : number};
  Boars: undefined;
  AddBoar: undefined;
  MatingEvents: undefined;
  AddMatingEvent: undefined;
  EditMatingEvent: { eventId: number };
  DetailsMatingEvent: { eventId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'PorciGestión', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="Sows" component={SowsScreen} options={{ title: 'Cerdas', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="AddSow" component={AddSow} options={{ title: "Agregar Cerda", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="DetailsSow" component={DetailsSow} options={{ title: "Detalles cerda", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="EditSow" component={EditSow} options={{ title: "Editar cerda", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="Boars" component={BoarsScreen} options={{ title: 'Cerdos', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="AddBoar" component={AddBoar} options={{ title: "Agregar Verraco", headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="MatingEvents" component={MattingEventsScreen} options={{ title: 'Inseminaciones', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="AddMatingEvent" component={AddMatingEventScreen} options={{ title: 'Agregar Inseminación', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="EditMatingEvent" component={EditMatingEventScreen} options={{ title: 'Editar Inseminación', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
        <Stack.Screen name="DetailsMatingEvent" component={DetailsMatingEventScreen} options={{ title: 'Detalles Inseminación', headerStyle: { backgroundColor: '#2E7D32'}, headerTintColor: '#FFFFFF'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
