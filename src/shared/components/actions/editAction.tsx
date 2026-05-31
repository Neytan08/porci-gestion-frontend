import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import ActionIconButton from "./actionIconButton";

type EditActionProps = {
  onPress: () => void;
  size?: number;
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
};

/**
 * Shared edit action button with configurable icon color.
 */
export default function EditAction({
  onPress,
  size = 20,
  color = "#616161",
  containerStyle,
  imageStyle,
  hitSlop = 10,
  accessibilityLabel = "Editar",
}: EditActionProps) {
  return (
    <ActionIconButton
      onPress={onPress}
      iconSource={require("../../../../assets/icons/edit.png")}
      size={size}
      tintColor={color}
      containerStyle={containerStyle}
      imageStyle={imageStyle}
      hitSlop={hitSlop}
      accessibilityLabel={accessibilityLabel}
    />
  );
}