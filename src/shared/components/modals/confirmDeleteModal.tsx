import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type ConfirmDeleteModalProps = {
    visible: boolean;
    name?: string | number | null;
    title?: string;
    message?: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
};

/**
 * Generic confirmation modal for delete actions.
 * It stays domain-agnostic by receiving its title and message from the parent.
 */
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
        message ??
        `Seguro que desea eliminar ${name ? `a ${name}` : "este registro"}?`;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    {!!title && <Text style={styles.title}>{title}</Text>}
                    {/*  
                        You can pass a string for simple messages or a React node for complex formatting
                        You can use <Text> components with styles for bold, links, etc.
                    */}
                    {typeof resolvedMessage === "string" ? (
                        <Text style={styles.message}>{resolvedMessage}</Text>
                    ) : (
                        <View style={styles.messageContainer}>{resolvedMessage}</View>
                    )}

                    <View style={styles.row}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.confirmButton,
                                loading && styles.disabled,
                                pressed && styles.pressed,
                            ]}
                            onPress={onConfirm}
                            disabled={loading}
                            accessibilityRole="button"
                            accessibilityLabel={`${confirmText} ${name ?? "registro"}`}
                        >
                            <Text style={styles.buttonText}>{confirmText}</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.cancelButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={onCancel}
                            accessibilityRole="button"
                            accessibilityLabel={cancelText}
                        >
                            <Text style={styles.buttonText}>{cancelText}</Text>
                        </Pressable>
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
        backgroundColor: "#fff",
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
    messageContainer: {
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
    confirmButton: {
        backgroundColor: "#ac0202",
    },
    cancelButton: {
        backgroundColor: "#007AFF",
    },
    disabled: {
        opacity: 0.7,
    },
    pressed: {
        opacity: 0.8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});