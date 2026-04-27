import { memo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
    Image,
    Pressable,
    StyleSheet,
    View
} from "react-native";

type RowCheckboxProps = {
    selected: boolean;
    onPress: () => void;
    size?: number;
    selectedColor?: string;
    radius?: number;
    width?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
};

/**
 * Shared checkbox control used in selectable list rows.
 */
function RowCheckbox({
    selected,
    onPress,
    size = 15,
    selectedColor = "#2E7D32",
    radius = 4,
    width = 1.5,
    color = "transparent",
    style,
    disabled = false,
}: RowCheckboxProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[styles.cell, style]}
            hitSlop={15}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected, disabled }}
        >
            <View
                style={[
                    styles.box,
                    {
                        width: size,
                        height: size,
                        borderRadius: radius,
                        borderWidth: width,
                        borderColor: color,
                    },
                    selected && {
                        backgroundColor: selectedColor,
                        borderColor: selectedColor,
                    },
                ]}
            >
                <Image
                    source={require("../../../../assets/icons/check.png")}
                    style={{
                        width: size - 5,
                        height: size - 5,
                        tintColor: "#000000",
                    }}
                    resizeMode="contain"
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cell: {
        width: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    box: {
        borderWidth: 1.5,
        borderColor: "#555",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default memo(RowCheckbox);