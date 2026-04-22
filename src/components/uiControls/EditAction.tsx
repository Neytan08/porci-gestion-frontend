import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import {
	Image,
	Pressable,
	StyleSheet,
} from "react-native";

/**
 * EditAction is a reusable component that renders an edit/pencil icon button,
 * commonly used to trigger edit actions in the UI.
 * Props:
 * - onPress: Function to call when the button is pressed.
 * - size: Optional size for the icon (default: 20).
 * - color: Optional color for the icon (default: "#616161").
 * - containerStyle: Optional style for the button container.
 * - imageStyle: Optional style for the image/icon.
 * - hitSlop: Optional number to increase the touchable area around the button (default: 10).
 * - accessibilityLabel: Optional label for accessibility (default: "Editar").
 */
type EditActionProps = {
	onPress: () => void;
	size?: number;
	color?: string;
	imageStyle?: StyleProp<ImageStyle>;
	containerStyle?: StyleProp<ViewStyle>;
	hitSlop?: number;
	accessibilityLabel?: string;
};

export default function EditAction({
	onPress,
	size = 20,
	color = "#616161",
	containerStyle,
	imageStyle,
	hitSlop = 10,
	accessibilityLabel = "Editar",
}: EditActionProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.button, containerStyle, pressed && { opacity: 0.8 }]}
			hitSlop={hitSlop}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
		>
			<Image
				source={require("../../../assets/icons/edit.png")}
				style={[{ width: size, height: size, tintColor: color }, imageStyle]}
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
