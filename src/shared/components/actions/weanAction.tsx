import type {
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import ActionIconButton from "./actionIconButton";

type WeanActionProps = {
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

/** Shared action used to open the actual weaning workflow. */
export default function WeanAction({
  onPress,
  label,
  size = 25,
  color,
  containerStyle,
  imageStyle,
  hitSlop = 10,
  accessibilityLabel = label ?? "Destetar",
}: WeanActionProps) {
  return (
    <ActionIconButton
      onPress={onPress}
      iconSource={require("../../../../assets/icons/weaning.png")}
      size={size}
      tintColor={color}
      containerStyle={containerStyle}
      imageStyle={imageStyle}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
