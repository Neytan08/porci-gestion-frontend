import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import ActionIconButton from "./actionIconButton";

type ListActionProps = {
  onPress: () => void;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
};

/**
 * Shared action button for opening a contextual actions menu.
 */
export default function ListAction({
  onPress,
  size = 20,
  containerStyle,
  imageStyle,
  hitSlop = 10,
  accessibilityLabel = "Lista",
}: ListActionProps) {
  return (
    <ActionIconButton
      onPress={onPress}
      iconSource={require("../../../../assets/icons/dots.png")}
      size={size}
      containerStyle={[styles.container, containerStyle]}
      imageStyle={imageStyle}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
      pressedStyle={styles.pressed}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  pressed: {
    backgroundColor: "#e2e2e2",
  },
});