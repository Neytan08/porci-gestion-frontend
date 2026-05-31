import type { FC } from "react";
import { useState } from "react";
import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { updatePregnancyResults } from "../api/matingEventApi";
import ActionIconButton from "../../../shared/components/actions/actionIconButton";
/**
 * UpdatePregnancyResultModal is a reusable component that allows users to update 
 * the pregnancy result of one or more mating events.
 * Props:
 * - onConfirm: A callback function that is called when the update is successful. 
 *   It allows the parent component to refresh data or perform other actions after the update.
 * - selectedIds: The ID or IDs of the mating event(s) to update.
 * - size: Optional prop to specify the size of the update icon. Default is 42.
 * - label: Optional prop to display a label below the update icon.
 * - imageStyle: Optional additional styles for the update icon image.
 */
type UpdatePregnancyResultModalProps = {
    onConfirm: () => void;
    selectedIds: number | number[];
    size?: number;
    label?: string;
    color?: string;
    hitSlop?: number;
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
}

const UpdatePregnancyResultModal: FC<UpdatePregnancyResultModalProps> = ({
    onConfirm,
    selectedIds,
    size = 42,
    color = "#616161",
    hitSlop = 10,
    containerStyle,
    imageStyle,
    label,
}) => {
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedResult, setSelectedResult] = useState<
        "Pendiente" | "Positivo" | "Negativo" | null
    >(null);

    // Handle confirming the update
    const handleConfirm = async () => {
        if (!selectedResult) return;
        try {
            await updatePregnancyResults(selectedIds, selectedResult);
            onConfirm(); // Notify parent of success
        } catch (error) {
            console.error("Error updating pregnancy result:", error);
        } finally {
            setUpdateModalVisible(false);
            setSelectedResult(null);
        }
    };

    return (
        <>
            <ActionIconButton
                onPress={() => setUpdateModalVisible(true)}
                iconSource={require("../../../../assets/icons/change-status.png")}
                size={size}
                tintColor={color}
                containerStyle={containerStyle}
                imageStyle={imageStyle}
                hitSlop={hitSlop}
                label={label}
                accessibilityLabel="Actualizar resultado de embarazo"
            />
            <Modal visible={updateModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.overlay} onPress={() => [ setUpdateModalVisible(false), setSelectedResult(null) ]} />
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Actualizar Resultado de Embarazo</Text>
                        <View style={styles.optionsContainer}>
                            {(["Pendiente", "Positivo", "Negativo"] as const).map((result) => (
                                <Pressable
                                    key={result}
                                    style={[
                                        styles.option,
                                        selectedResult === result && styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedResult(result)}
                                >
                                    <Text
                                        style={
                                            selectedResult === result
                                                ? styles.selectedOptionText
                                                : styles.optionText
                                        }
                                    >
                                        {result}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        <View style={styles.actionsContainer}>
                            <Pressable
                                style={
                                    selectedResult
                                    ? { ...styles.confirmButton, ...styles.selectedResultConfirmButton }
                                    : styles.confirmButton
                                }
                                onPress={handleConfirm}
                                disabled={!selectedResult}
                            >
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    updateBtn: {
		alignItems: "center",
	},
    updateBtnLabel: {
        fontWeight: "700",
        textAlign: "center",
    },
    modalOverlay:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.2)",
    },
    modalContainer: {
        maxWidth: "75%",
        maxHeight: "50%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    optionsContainer: {
        // width: "100%",
        // flexDirection: "column",
        alignItems: "center",
        marginBottom: 20,
    },
    option: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#d0d7de",
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
        minWidth: "80%",
        fontSize: 16,
    },
    selectedOption: {
        backgroundColor: "#e0f2f1",
		borderColor: "#2E7D32",
    },
    optionText: {
        color: "#333",
    },
    selectedOptionText: {
        color: "#2E7D32",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    confirmButton: {
        padding: 10,
        backgroundColor: "#e0f2f1",
        borderRadius: 5,
    },
    selectedResultConfirmButton:{
        backgroundColor: "#2E7D32"
    },
    confirmButtonText: {
        color: "#fff",
    },
});

export default UpdatePregnancyResultModal;
