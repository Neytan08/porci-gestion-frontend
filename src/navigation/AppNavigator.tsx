import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddBoar from "../screens/boars/AddBoarScreen";
import BoarsScreen from "../screens/boars/BoarsScreen";
import DetailsBoar from "../screens/boars/DetailsBoarScreen";
import EditBoar from "../screens/boars/EditBoarScreen";
import HomeScreen from "../screens/HomeScreen";
import AddMatingEventScreen from "../screens/matingEvents/AddMatingEventScreen";
import DetailsMatingEventScreen from "../screens/matingEvents/DetailsMatingEventScreen";
import EditMatingEventScreen from "../screens/matingEvents/EditMatingEventScreen";
import MattingEventsScreen from "../screens/matingEvents/MatingEventsScreen";
import AddSow from "../screens/sows/AddSowScreen";
import DetailsSow from "../screens/sows/DetailsSowScreen";
import EditSow from "../screens/sows/EditSowScreen";
import SowsScreen from "../screens/sows/SowsScreen";

// Define the types for the navigation stack parameters.
export type RootStackParamList = {
	Home: undefined;
	Sows: undefined;
	AddSow: undefined;
	EditSow: { sowId: number };
	DetailsSow: { sowId: number };
	Boars: undefined;
	AddBoar: undefined;
	EditBoar: { boarId: number };
	DetailsBoar: { boarId: number };
	MatingEvents: undefined;
	AddMatingEvent: undefined;
	EditMatingEvent: { eventId: number };
	DetailsMatingEvent: { eventId: number };
};

/** Create a stack navigator using the defined parameter types.
createNativeStackNavigator is used to create a stack-based navigation structure. */
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
	return (
		// NavigationContainer provides the navigation context for the app.
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: true }}>
				{/* Define each screen in the stack with its corresponding component and options. */}
				<Stack.Screen
					name="Home"
					component={HomeScreen}
					options={{
						title: "PorciGestión",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="Sows"
					component={SowsScreen}
					options={{
						title: "Cerdas",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="AddSow"
					component={AddSow}
					options={{
						title: "Agregar Cerda",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="DetailsSow"
					component={DetailsSow}
					options={{
						title: "Detalles cerda",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="EditSow"
					component={EditSow}
					options={{
						title: "Editar cerda",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="Boars"
					component={BoarsScreen}
					options={{
						title: "Cerdos",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="AddBoar"
					component={AddBoar}
					options={{
						title: "Agregar Verraco",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="EditBoar"
					component={EditBoar}
					options={{
						title: "Editar Verraco",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="DetailsBoar"
					component={DetailsBoar}
					options={{
						title: "Detalles Verraco",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="MatingEvents"
					component={MattingEventsScreen}
					options={{
						title: "Inseminaciones o Montas",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="AddMatingEvent"
					component={AddMatingEventScreen}
					options={{
						title: "Agregar Inseminación o Monta",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="EditMatingEvent"
					component={EditMatingEventScreen}
					options={{
						title: "Editar Inseminación o Monta",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
				<Stack.Screen
					name="DetailsMatingEvent"
					component={DetailsMatingEventScreen}
					options={{
						title: "Detalles Inseminación o Monta",
						headerStyle: { backgroundColor: "#2E7D32" },
						headerTintColor: "#FFFFFF",
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
