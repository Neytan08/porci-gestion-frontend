import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { getStatus, Status } from "../api/statusApi";

type StatusDropdownProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ value, onChange }) => {
    const [statusOptions, setStatusOptions] = useState<{ label: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatus();
    }, []);
    
    // Fetch status from API
    const fetchStatus = async () => {
        try {
            const data = await getStatus();
            const mapped = data.map((item: Status) => ({
                label: item.status_name,
                value: item.status_id,
            }));
            setStatusOptions(mapped);
        }catch (error) {
            console.error("Error cargando estados:", error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" />
            <Text>Cargando estados...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{"Estado *"}</Text>
            <TouchableOpacity>
                <RNPickerSelect
                    onValueChange={(value) => onChange(Number(value))}
                    value={value}
                    items={statusOptions}
                    placeholder={{ label: "Seleccionar estado...", value: null }}
                    style={{
                        inputIOS: styles.input,
                        inputAndroid: styles.input,
                        placeholder: { color: "#888" },
                    }}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10},
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderColor: "#37474F",
    backgroundColor: "#fff",
    fontSize: 16,
  },
  loadingContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
});
