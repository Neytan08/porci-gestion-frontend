import React from "react";
import {View, Text, Image, StyleSheet, Pressable, FlatList,} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  //Main menu cards
  const cards = [
    { id: "1", title: "Cerdas", route: "Sows" },
    { id: "2", title: "Cerdos", route: "Boars" },
    { id: "3", title: "Eventos", route: "Events" },
  ];

  const renderCard = ({ item }: any) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => navigation.navigate(item.route as never)}>
      <Text style={styles.cardText}>{item.title}</Text>
    </Pressable>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PorciGestión</Text>
      <Image
        source={require("../../assets/images/logo.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <FlatList
        data={cards}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    alignContent: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 220,
    height: 120,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 40,
  },
  listContainer: { 
    paddingBottom: 30 
  },
  row: { 
    justifyContent: "space-around", 
    marginBottom: 25 
  },
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
  cardText: { 
    fontSize: 17, 
    fontWeight: "600", 
    color: "#34495e" 
  },
});
