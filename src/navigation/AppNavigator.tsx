import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SowsScreen from '../screens/sows/SowsScreen';
import BoarsScreen from '../screens/boars/BoarsScreen';
import EventsScreen from '../screens/EventsScreen';
import AddSow from '../screens/sows/AddSowScreen';
import DetailsSow from '../screens/sows/DetailsSowScreen';
import EditSow from '../screens/sows/EditSowScreen';

export type RootStackParamList = {
  Home: undefined;
  Sows: undefined;
  Boars: undefined;
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
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'PorciGestión' }} />
        <Stack.Screen name="Sows" component={SowsScreen} options={{ title: 'Cerdas' }} />
        <Stack.Screen name="Boars" component={BoarsScreen} options={{ title: 'Cerdos' }} />
        <Stack.Screen name="Events" component={EventsScreen} options={{ title: 'Eventos' }} />
        <Stack.Screen name="AddSow" component={AddSow} options={{ title: "Agregar Cerda" }}/>
        <Stack.Screen name="DetailsSow" component={DetailsSow} options={{ title: "Detalles cerda" }}/>
        <Stack.Screen name="EditSow" component={EditSow} options={{ title: "Editar cerda" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
