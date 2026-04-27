import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import ActionIconButton from "./actionIconButton";

type DeleteActionProps = {
  onPress: () => void;
  size?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
};

export default function DeleteAction({
  onPress,
  size = 20,
  color = "#616161",
  containerStyle,
  imageStyle,
  hitSlop = 10,
  accessibilityLabel = "Eliminar",
}: DeleteActionProps) {
  return (
    <ActionIconButton
      onPress={onPress}
      iconSource={require("../../../../assets/icons/trash.png")}
      size={size}
      tintColor={color}
      containerStyle={containerStyle}
      imageStyle={imageStyle}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
