import React from 'react';
import { TouchableOpacity, Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

type EditActionProps = {
  onPress: () => void;
  size?: number; // icon size (width/height)
  color?: string; // icon color
  style?: StyleProp<ImageStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
};

export default function EditAction({
  onPress,
  size = 20,
  color = '#616161',
  style,
  hitSlop = 10,
  accessibilityLabel = 'Editar',
}: EditActionProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} hitSlop={hitSlop} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      <Image
        source={require('../../../assets/icons/edit.png')}
        style={[{ width: size, height: size, tintColor: color }, style]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});