import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import {
	Image,
	Pressable,
	StyleSheet,
} from "react-native";

/**
 * ListAction is a reusable component that renders a three-dots icon button,
 * commonly used to trigger a list of actions (e.g., edit, delete, view details) in the UI.
 * Props:
 * - onPress: Function to call when the button is pressed.
 * - size: Optional size for the icon (default: 20).
 * - containerStyle: Optional style for the button container.
 * - imageStyle: Optional style for the image/icon.
 * - hitSlop: Optional number to increase the touchable area around the button (default: 10).
 * - accessibilityLabel: Optional label for accessibility (default: "Lista").
 */
type ListActionProps = {
	onPress: () => void;
	size?: number;
	containerStyle?: StyleProp<ViewStyle>;
	imageStyle?: StyleProp<ImageStyle>;
	hitSlop?: number;
	accessibilityLabel?: string;
};

export default function ListAction({
	onPress,
	size = 20,
	containerStyle,
	imageStyle,
	hitSlop = 10,
	accessibilityLabel = "Lista",
}: ListActionProps) {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [styles.button, pressed && styles.pressed, containerStyle]}
			hitSlop={hitSlop}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
		>
			<Image
				source={require("../../../assets/icons/dots.png")}
				style={[{ width: size, height: size, tintColor: "#616161" }, imageStyle]}
				resizeMode="contain"
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		// backgroundColor: '#c9c7c7ff',
		width: 40,
		height: 40,
		borderRadius: 20,
		// borderTopLeftRadius: 25,
		// borderTopRightRadius: 40,
		// borderBottomLeftRadius: 40,
		// borderBottomRightRadius: 25,
		// borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	pressed: {
		// Android shadow (elevation) and iOS shadow
		// elevation: 6,
		// shadowColor: '#e2e2e2ff',
		backgroundColor: "#e2e2e2ff",
		// shadowOffset: { width: 0, height: 2 },
		// shadowOpacity: 0.25,
		// shadowRadius: 4,
		// transform: [{ translateY: 0 }],
	},
});
