import { useNavigation } from "@react-navigation/native";
import type { ImageSourcePropType, ListRenderItem } from "react-native";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { RootStackNavigationProp } from "../navigation/rootStack.types";

// Defines the type for the menu routes available on the Home screen
type HomeMenuRoute = "Sows" | "Boars" | "MatingEvents";

// Defines the structure of each menu card displayed on the Home screen
type HomeMenuCard = {
	id: string;
	title: string;
	route: HomeMenuRoute;
	icon: ImageSourcePropType;
};

const HOME_MENU_CARDS: HomeMenuCard[] = [
	{ id: "1", title: "Cerdas", route: "Sows", icon: require("../../../assets/icons/sow.png") },
	{ id: "2", title: "Cerdos", route: "Boars", icon: require("../../../assets/icons/farm.png") },
	{ id: "3", title: "Reproducción", route: "MatingEvents", icon: require("../../../assets/icons/add-event.png") },
];

export default function HomeScreen() {

	// Types the navigation prop for this screen to ensure type-safe navigation.
	const navigation = useNavigation<RootStackNavigationProp<"Home">>();
	
	const renderCard: ListRenderItem<HomeMenuCard> = ({ item }) => (
		<Pressable
			style={({ pressed }) => [
				styles.card,
				pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
			]}
			onPress={() => navigation.navigate(item.route)}
		>
			<View style={styles.iconWrap}>
				<Image source={item.icon} style={styles.icon} resizeMode="contain" />
			</View>
			<Text style={styles.cardText}>{item.title}</Text>
		</Pressable>
	);

	return (
		<View style={styles.container}>
			<FlatList
				data={HOME_MENU_CARDS}
				renderItem={renderCard}
				keyExtractor={(item) => item.id}
				numColumns={2}
				columnWrapperStyle={styles.row}
				contentContainerStyle={styles.listContainer}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	card: {
		backgroundColor: "#f9f9f9",
		width: 140,
		height: 140,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 6,
		margin: 20,
	},
	iconWrap: {
		width: 84,
		height: 84,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		width: 68,
		height: 68,
	},
	cardText: {
		fontSize: 17,
		fontWeight: "600",
		color: "#34495e",
	},
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
		alignItems: "center",
		paddingTop: 40,
	},
	row: {
		justifyContent: "space-around",
		marginBottom: 25,
	},
	listContainer: {
		paddingBottom: 30,
	},
});