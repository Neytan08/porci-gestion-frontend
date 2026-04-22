import type React from "react";
import { memo } from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	View,
	type ViewStyle,
} from "react-native";

/** 
 * RowCheckbox is a reusable component that renders a checkbox for use in list rows or similar contexts.
 * Props:
 * - selected: boolean indicating if the checkbox is selected
 * - onPress: function to call when the checkbox is pressed
 * - size: optional number for the size of the checkbox
 * - selectedColor: optional string for the color when selected
 * - radius: optional number for the border radius
 * - width: optional number for the border width
 * - color: optional string for the border color
 * - style: optional ViewStyle for custom styling
 * - disabled: optional boolean to disable the checkbox
 */
type RowCheckBoxProps = {
	selected: boolean;
	onPress: () => void;
	size?: number;
	selectedColor?: string;
	radius?: number;
	width?: number;
	color?: string;
	style?: ViewStyle;
	disabled?: boolean;
};

const RowCheckbox: React.FC<RowCheckBoxProps> = ({
	selected,
	onPress,
	size = 15,
	selectedColor = "#2E7D32",
	radius = 4,
	width = 1.5,
	color = "transparent",
	style,
	disabled = false,
}) => {
	return (
		<Pressable
			onPress={onPress}
			disabled={disabled}
			style={[styles.cell, style]}
			hitSlop={15} /*Increases touchable area*/
			accessibilityRole="checkbox"
			accessibilityState={{ selected, disabled }}
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
					source={require("../../../assets/icons/check.png")}
					style={[
						{ width: size - 5, height: size - 5, tintColor: "#000000ff" },
					]}
					resizeMode="contain"
				/>
			</View>
		</Pressable>
	);
};

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