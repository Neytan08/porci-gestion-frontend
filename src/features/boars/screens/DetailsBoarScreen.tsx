import type { RouteProp } from "@react-navigation/native";
import {
	useFocusEffect,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { type Boar, getBoarById } from "../api/boarsApi";
import EditAction from "../../../shared/components/actions/editAction";
import type { RootStackParamList } from "../../../app/navigation/rootStack.types";
import ScreenContainer from "../../../shared/components/layout/screenContainer";

// Route prop for receiving boarId from navigation
type DetailsRouteProp = RouteProp<RootStackParamList, "DetailsBoar">;
// Navigation prop for navigating to EditBoar
type NavigationProp = NativeStackNavigationProp<
	RootStackParamList,
	"DetailsBoar"
>;

export default function DetailsBoarScreen() {
	const [boar, setBoarDetails] = useState<Boar | null>(null);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation<NavigationProp>();
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const route = useRoute<DetailsRouteProp>();
	const { boarId } = route.params;

	const loadBoarDetails = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getBoarById(boarId);
			setBoarDetails(data);
		} catch (err: any) {
			console.log("Error loading boar:", err);
			setError("No se pudo cargar el verraco.");
		} finally {
			setLoading(false);
		}
	}, [boarId]);

	// Reload boar details whenever screen focuses or boarId changes
	useFocusEffect(
		useCallback(() => {
			loadBoarDetails();
		}, [loadBoarDetails]),
	);

	return (
		<ScreenContainer>
			<View>
				<Text>Detalles del verraco</Text>
			</View>
		</ScreenContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F9FAFB",
	},
});

