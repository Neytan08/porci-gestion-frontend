import React from "react";
import {
	Image,
	type ImageStyle,
	type StyleProp,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

type DetailsActionProps = {
	onPress: () => void;
	size?: number;
	style?: StyleProp<ImageStyle>;
	hitSlop?: number;
	accessibilityLabel?: string;
};

export default function DetailsAction({
	onPress,
	size = 25,
	style,
	hitSlop = 10,
	accessibilityLabel = "Detalles",
}: DetailsActionProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.button, style]}
			hitSlop={hitSlop}
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
		>
			<Image
				source={require("../../../assets/icons/eye.png")}
				style={[{ width: size, height: size, tintColor: "#616161" }, style]}
				resizeMode="contain"
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		justifyContent: "center",
	},
});
