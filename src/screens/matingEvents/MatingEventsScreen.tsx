import React, { useEffect, useState, useCallback, useMemo } from "react";
import {View, FlatList, TouchableOpacity, Pressable, ActivityIndicator, StyleSheet, RefreshControl, Modal, Alert, Image, TextInput, Text} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { getAllGroupedByPregnancyResult, MatingEvent } from "../../api/matingEventApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MatingEvents'>;
//TODO: This needs to be changed, needs to have a different handle 
type PregnancyResult = "Pendiente" | "Positivo" | "Negativo";

export default function MattingEventsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [counts, setCounts] = useState<{ pendiente: number; positivo: number; negativo: number }>({
        pendiente: 0, positivo: 0, negativo: 0,
    });
    const [selectedTab, setSelectedTab] = useState<PregnancyResult | null>(null);
    const [eventsByResult, setEventsByResult] = useState<Record<PregnancyResult, MatingEvent[]>>({
        Pendiente: [],
        Positivo: [],
        Negativo: [],
    });
    const [loadingAll, setLoadingAll] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Navigate to AddMatingEvent screen
    const handleAddPress = () => {
        navigation.navigate("AddMatingEvent" as never);
    };

  // Carga inicial: trae listas por resultado y calcula conteos por length
  const loadAll = useCallback(async () => {
    setLoadingAll(true);
    try {
        // type ApiGroup = { pregnancy_result: PregnancyResult | null | string; events: MatingEventsGroup[] };
        // const groups = (await getAllGroupedByPregnancyResult()) as ApiGroup[];
        const groups = await getAllGroupedByPregnancyResult();

        // Normalize to steady buckets
        const map: Record<PregnancyResult, MatingEvent[]> = {
        Pendiente: [],
        Positivo: [],
        Negativo: [],
        };

        for (const g of groups) {
            const key = g.pregnancy_result as PregnancyResult | null;
            if (key && key in map) {
                map[key] = Array.isArray(g.events) ? g.events : [];
            }
        }
        setEventsByResult(map);
        setCounts({
        pendiente: map.Pendiente.length,
        positivo: map.Positivo.length,
        negativo: map.Negativo.length,
        });
    } catch (e) {   
      setEventsByResult({ Pendiente: [], Positivo: [], Negativo: [] });
      setCounts({ pendiente: 0, positivo: 0, negativo: 0 });
    } finally {
      setLoadingAll(false);
    }
  }, []);

    useEffect(() => {
    // Al entrar: carga data para conteos; la lista queda vacía hasta que el usuario seleccione un header.
    loadAll();
  }, [loadAll]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadAll();
        } finally {
            setRefreshing(false);
        }
    }, [loadAll]);

    const headers = useMemo(() => ([
        { key: "Pendiente" as const, label: `Pendiente (${counts.pendiente})` },
        { key: "Positivo" as const,  label: `Positivos (${counts.positivo})` },
        { key: "Negativo" as const,  label: `Negativos (${counts.negativo})` },
        ]), [counts]
    ); 

    const listData = selectedTab ? eventsByResult[selectedTab] : [];

    return (
        <View style={styles.mainContainer}>
            <View style={styles.tabsRow}>
                {headers.map(h => {
                const isSelected = selectedTab === h.key;
                return (
                    <Pressable
                        key={h.key}
                        style={[styles.tabItem, isSelected && styles.tabItemSelected]}
                        onPress={() => setSelectedTab(h.key)}
                        disabled={loadingAll}
                    >
                        <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                            {h.label}
                        </Text>
                    </Pressable>
                );
                })}
            </View>
            {loadingAll && !selectedTab ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2E7D32" />
                </View>
                ) : (
                <FlatList<MatingEvent>
                    data={listData}
                    keyExtractor={(item) => `${item.mating_id}`}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={[styles.cell, { flex: 1 }]}>Cerda: {item.breedingsows?.sow_tag_number ?? item.sow_id}</Text>
                            <Text style={[styles.cell, { flex: 1 }]}>
                                Fecha: {item.insemination_date ? item.insemination_date.split("T")[0] : "-"}
                            </Text>
                            <Text style={[styles.cell, { flex: 1 }]}>
                                Notas: {item.notes ?? "-"}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 24, color: "#666" }}>
                            Sin registros
                        </Text>
                    }
                    contentContainerStyle={{ paddingBottom: 90, paddingTop: 8 }}
                />
            )}
            {/* Floating Add Button */}
            <TouchableOpacity style={styles.addSowButton} onPress={handleAddPress}>
                <Image
                source={require("../../../assets/icons/add.png")}
                style={styles.icon}
                resizeMode="contain"
                />
                <Text style={styles.addSowText}> Agregar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  icon: {  width: 42, height: 42 },
  mainContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  //
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  tabItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabItemSelected: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  tabText: {
    fontSize: 14,
    color: "#2b2b2b",
    fontWeight: "700",
  },
  tabTextSelected: {
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cell: { color: "#333" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  // Floating Add Button
  addSowButton: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#FFA000", // color naranja similar al ejemplo
    width: 140,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // sombra en Android
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4, // sombra en iOS
  },
  addSowText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 2,
  },
});