import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SowsScreen from '../screens/SowsScreen';
import BoarsScreen from '../screens/BoarsScreen';
import EventsScreen from '../screens/EventsScreen';
import AddSow from '../screens/AddSowScreen';

export type RootStackParamList = {
  Home: undefined;
  Sows: undefined;
  Boars: undefined;
  Events: undefined;
  AddSow: undefined;
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
