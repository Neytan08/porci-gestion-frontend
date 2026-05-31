import type {
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Image, Pressable, StyleSheet, Text } from "react-native";

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
  textStyle,
  hitSlop = 10,
  pressedStyle,
  accessibilityLabel = label ?? "Agregar",
}: AddActionProps) {
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
        source={require("../../../../assets/icons/add.png")}
        style={[
          styles.icon,
          { width: size, height: size },
          color ? { tintColor: color } : null,
          imageStyle,
        ]}
        resizeMode="contain"
      />
      {label ? <Text style={[styles.label, textStyle]}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    flexShrink: 0,
  },
  label: {
    marginLeft: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});