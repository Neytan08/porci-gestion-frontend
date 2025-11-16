import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Props for ConfirmDeleteModal component
interface ConfirmDeleteModalProps {
    visible: boolean;
    name?: string | number | null;
    title?: string; // Optional custom title
    message?: string; // Optional custom message. If omitted, a default using name is used
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

// Modal component to confirm deletion of an entity
export default function ConfirmDeleteModal({
    visible,
    name,
    title,
    message,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDeleteModalProps) {
    const resolvedMessage =
        message ?? `Seguro que desea eliminar ${name ? `a ${name}` : "este registro"}?`;
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {!!title && <Text style={styles.title}>{title}</Text>}
                    <Text style={styles.message}>{resolvedMessage}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#ac0202ff" }, loading && styles.disabled]}
                            onPress={onConfirm}
                            disabled={loading}
                            accessibilityRole="button"
                            accessibilityLabel={`${confirmText} ${name ?? "registro"}`}
                        >
                            <Text style={styles.buttonText}>{confirmText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: "#007AFF" }]}
                            onPress={onCancel}
                            accessibilityRole="button"
                            accessibilityLabel={cancelText}
                        >
                            <Text style={styles.buttonText}>{cancelText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    card: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 10,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 8,
    },
    message: {
        fontSize: 16,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        alignItems: "center",
    },
    disabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
