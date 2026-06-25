import type {
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import ActionIconButton from "./actionIconButton";

type AddActionProps = {
  onPress: () => void;
  label?: string;
  size?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  hitSlop?: number;
  pressedStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * Shared add action that supports icon-only and icon-with-label variants.
 */
export default function AddAction({
  onPress,
  label,
  size = 22,
  color,
  containerStyle,
  imageStyle,
  hitSlop = 10,
  accessibilityLabel = label ?? "Agregar",
}: AddActionProps) {
  return (
    <ActionIconButton
      // label={label}
      onPress={onPress}
      iconSource={require("../../../../assets/icons/add.png")}
      size={size}
      tintColor={color}
      containerStyle={containerStyle}
      imageStyle={imageStyle}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
    />
  );
}