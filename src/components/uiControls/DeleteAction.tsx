import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import {
	Image,
	Pressable,
	StyleSheet,
} from "react-native";

/**
 * DeleteAction is a reusable component that renders a trash icon button, 
 * commonly used to trigger delete actions in the UI.
 * Props:
 * - onPress: Function to call when the button is pressed.
 * - size: Optional size for the icon (default: 20).
 * - containerStyle: Optional style for the button container.
 * - imageStyle: Optional style for the image/icon.
 * - hitSlop: Optional number to increase the touchable area around the button (default: 10).
 * - accessibilityLabel: Optional label for accessibility (default: "Eliminar").
 */
type DeleteActionProps = {
	onPress: () => void;
	size?: number;
	containerStyle?: StyleProp<ViewStyle>;
	imageStyle?: StyleProp<ImageStyle>;
	hitSlop?: number;
	accessibilityLabel?: string;
};

export default function DeleteAction({
	onPress,
	size = 20,
	containerStyle,
	imageStyle,
	hitSlop = 10,
	accessibilityLabel = "Eliminar",
}: DeleteActionProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.button, containerStyle, pressed && { opacity: 0.8 }]}
			hitSlop={hitSlop}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
		>
			<Image
				source={require("../../../assets/icons/trash.png")}
				style={[{ width: size, height: size, tintColor: "#616161" }, imageStyle]}
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
});
