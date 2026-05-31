import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddBoarScreen from "../../features/boars/screens/AddBoarScreen";
import BoarsScreen from "../../features/boars/screens/BoarsScreen";
import DetailsBoarScreen from "../../features/boars/screens/DetailsBoarScreen";
import EditBoarScreen from "../../features/boars/screens/EditBoarScreen";
import AddMatingEventScreen from "../../features/mating-events/screens/AddMatingEventScreen";
import DetailsMatingEventScreen from "../../features/mating-events/screens/DetailsMatingEventScreen";
import EditMatingEventScreen from "../../features/mating-events/screens/EditMatingEventScreen";
import MatingEventsScreen from "../../features/mating-events/screens/MatingEventsScreen";
import AddSowScreen from "../../features/sows/screens/AddSowScreen";
import DetailsSowScreen from "../../features/sows/screens/DetailsSowScreen";
import EditSowScreen from "../../features/sows/screens/EditSowScreen";
import SowsScreen from "../../features/sows/screens/SowsScreen";
import HomeScreen from "../screens/HomeScreen";
import type { RootStackParamList } from "./rootStack.types";
import { defaultStackScreenOptions, rootStackScreenOptions } from "./screenOptions";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultStackScreenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={rootStackScreenOptions.Home} />
        <Stack.Screen name="Sows" component={SowsScreen} options={rootStackScreenOptions.Sows} />
        <Stack.Screen name="AddSow" component={AddSowScreen} options={rootStackScreenOptions.AddSow} />
        <Stack.Screen name="EditSow" component={EditSowScreen} options={rootStackScreenOptions.EditSow} />
        <Stack.Screen name="DetailsSow" component={DetailsSowScreen} options={rootStackScreenOptions.DetailsSow} />
        <Stack.Screen name="Boars" component={BoarsScreen} options={rootStackScreenOptions.Boars} />
        <Stack.Screen name="AddBoar" component={AddBoarScreen} options={rootStackScreenOptions.AddBoar} />
        <Stack.Screen name="EditBoar" component={EditBoarScreen} options={rootStackScreenOptions.EditBoar} />
        <Stack.Screen name="DetailsBoar" component={DetailsBoarScreen} options={rootStackScreenOptions.DetailsBoar} />
        <Stack.Screen name="MatingEvents" component={MatingEventsScreen} options={rootStackScreenOptions.MatingEvents} />
        <Stack.Screen name="AddMatingEvent" component={AddMatingEventScreen} options={rootStackScreenOptions.AddMatingEvent} />
        <Stack.Screen name="EditMatingEvent" component={EditMatingEventScreen} options={rootStackScreenOptions.EditMatingEvent} />
        <Stack.Screen name="DetailsMatingEvent" component={DetailsMatingEventScreen} options={rootStackScreenOptions.DetailsMatingEvent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

