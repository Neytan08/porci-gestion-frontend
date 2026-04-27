import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import ActionIconButton from "./actionIconButton";

type DetailsActionProps = {
  onPress: () => void;
  size?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
};

export default function DetailsAction({
  onPress,
  size = 25,
  color = "#616161",
  containerStyle,
  imageStyle,
  hitSlop = 10,
  accessibilityLabel = "Detalles",
}: DetailsActionProps) {
  return (
    <ActionIconButton
      onPress={onPress}
      iconSource={require("../../../../assets/icons/eye.png")}
      size={size}
      tintColor={color}
      containerStyle={containerStyle}
      imageStyle={imageStyle}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
