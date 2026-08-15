import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./rootStack.types";

export const defaultStackScreenOptions: NativeStackNavigationOptions = {
    headerShown: true,
    headerStyle: { backgroundColor: "#2E7D32" },
    headerTintColor: "#FFFFFF",
};
/*
    Defines the screen options for each route in the root stack.
    This is where each screen gets its own title and navigation header settings.
    Record helps make sure every root stack screen is included here, 
    and satisfies checks that each entry follows the expected screen options format.
*/
export const rootStackScreenOptions = {
    Home: { title: "PorciGestion" },
    Sows: { title: "Cerdas" },
    AddSow: { title: "Agregar Cerda" },
    EditSow: { title: "Editar Cerda" },
    DetailsSow: { title: "Detalles Cerda" },
    Farrowings: { title: "Partos" },
    AddFarrowing: { title: "Agregar Parto" },
    Boars: { title: "Cerdos" },
    AddBoar: { title: "Agregar Verraco" },
    EditBoar: { title: "Editar Verraco" },
    DetailsBoar: { title: "Detalles Verraco" },
    MatingEvents: { title: "Inseminaciones o Montas" },
    AddMatingEvent: { title: "Agregar Inseminacion o Monta" },
    EditMatingEvent: { title: "Editar Inseminacion o Monta" },
    DetailsMatingEvent: { title: "Detalles Inseminacion o Monta" },
} satisfies Record<keyof RootStackParamList, NativeStackNavigationOptions>;
