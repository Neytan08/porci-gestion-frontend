import type { RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps} from "@react-navigation/native-stack";

// Defines the params accepted by each screen in the root stack.
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

// Builds the union of valid screen names from the root stack.
export type RootStackScreenName = keyof RootStackParamList;

// Types the navigation prop for the current screen and its available routes.
export type RootStackNavigationProp<T extends RootStackScreenName> =
  NativeStackNavigationProp<RootStackParamList, T>;

// Types the route prop to safely access the current screen params.
export type RootStackRouteProp<T extends RootStackScreenName> = 
RouteProp<RootStackParamList, T >;

// Groups the typed navigation and route props for a stack screen.
export type RootStackScreenProps<T extends RootStackScreenName> =
  NativeStackScreenProps<RootStackParamList, T>;