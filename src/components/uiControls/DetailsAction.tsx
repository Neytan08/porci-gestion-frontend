import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import {
	Image,
	Pressable,
	StyleSheet,
} from "react-native";
/**
 * DetailsAction is a reusable component that renders an eye icon button,
 * commonly used to trigger view details actions in the UI.
 * Props:
 * - onPress: Function to call when the button is pressed.
 * - size: Optional size for the icon (default: 25).
 * - containerStyle: Optional style for the button container.
 * - imageStyle: Optional style for the image/icon.
 * - hitSlop: Optional number to increase the touchable area around the button (default: 10).
 * - accessibilityLabel: Optional label for accessibility (default: "Detalles").
 */
type DetailsActionProps = {
	onPress: () => void;
	size?: number;
	containerStyle?: StyleProp<ViewStyle>;
	imageStyle?: StyleProp<ImageStyle>;
	hitSlop?: number;
	accessibilityLabel?: string;
};

export default function DetailsAction({
	onPress,
	size = 25,
	containerStyle,
	imageStyle,
	hitSlop = 10,
	accessibilityLabel = "Detalles",
}: DetailsActionProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.button, containerStyle, pressed && { opacity: 0.8 }]}
			hitSlop={hitSlop}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
		>
			<Image
				source={require("../../../assets/icons/eye.png")}
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
