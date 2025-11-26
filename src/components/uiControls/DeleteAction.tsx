import React from 'react';
import { TouchableOpacity, Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';

type DeleteActionProps = {
  onPress: () => void;
  size?: number;
  style?: StyleProp<ImageStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
};

export default function DeleteAction({
  onPress,
  size =20,
  style,
  hitSlop = 10,
  accessibilityLabel = 'Eliminar',
}: DeleteActionProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} hitSlop={hitSlop} accessibilityRole="button" accessibilityLabel={accessibilityLabel}>
      <Image
        source={require('../../../assets/icons/trash.png')}
        style={[{ width: size, height: size, tintColor: '#616161' }, style]}
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