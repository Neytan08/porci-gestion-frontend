import type {
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
    ViewStyle,
} from "react-native";
import { Image, Pressable, StyleSheet } from "react-native";

type ActionIconButtonProps = {
    onPress: () => void;
    iconSource: ImageSourcePropType;
    accessibilityLabel: string;
    size?: number;
    tintColor?: string;
    containerStyle?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    hitSlop?: number;
    pressedStyle?: StyleProp<ViewStyle>;
};

/**
 * Shared icon button used by specific action components.
 * This keeps press behavior, accessibility, and icon rendering in one place.
*/
export default function ActionIconButton({
    onPress,
    iconSource,
    accessibilityLabel,
    size = 20,
    tintColor = "#616161",
    containerStyle,
    imageStyle,
    hitSlop = 10,
    pressedStyle,
}: ActionIconButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={hitSlop}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            style={({ pressed }) => [
                styles.button,
                containerStyle,
                pressed && styles.pressed,
                pressed && pressedStyle,
            ]}
        >
            <Image
                source={iconSource}
                style={[{ width: size, height: size, tintColor }, imageStyle]}
                resizeMode="contain"
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        justifyContent: "center",
    },
    pressed: {
        opacity: 0.8,
    },
});
