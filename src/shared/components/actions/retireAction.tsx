import type {
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import ActionIconButton from "./actionIconButton";

type RetireActionProps = {
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
 * Shared retire action that supports icon-only and icon-with-label variants.
 */
export default function RetireAction({
  onPress,
  label,
  size = 22,
  color,
  containerStyle,
  imageStyle,
  hitSlop = 10,
  accessibilityLabel = label ?? "Retirar",
}: RetireActionProps) {
  return (
    <ActionIconButton
      label={label}
      onPress={onPress}
      iconSource={require("../../../../assets/icons/retired.png")}
      size={size}
      tintColor={color}
      containerStyle={containerStyle}
      imageStyle={imageStyle}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
    />
  );
}