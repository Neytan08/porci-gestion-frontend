import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Pressable } from 'react-native';

type ListActionProps = {
  onPress: () => void;
  size?: number;
  style?: StyleProp<ImageStyle>;
  hitSlop?: number;
  accessibilityLabel?: string;
};

export default function ListAction({
  onPress,
  size = 20,
  style,
  hitSlop = 10,
  accessibilityLabel = 'Lista',
}: ListActionProps) {
  return (
    <Pressable
      onPress={onPress}
      // android_ripple={{
      //   // color: 'rgba(233, 11, 11, 0.08)',
      //   borderless: false,
      //   radius: 24,
      // }}
      // Use the pressable style callback to apply a color while pressed
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      >
      <Image
        source={require('../../../assets/icons/dots.png')}
        style={[{ width: size, height: size, tintColor: '#616161' }, style]}
        resizeMode="contain"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button:{
    // backgroundColor: '#c9c7c7ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    // borderTopLeftRadius: 25,
    // borderTopRightRadius: 40,
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 25,
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    // Android shadow (elevation) and iOS shadow
    // elevation: 6,
    // shadowColor: '#e2e2e2ff',
    backgroundColor: '#e2e2e2ff',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // transform: [{ translateY: 0 }],
  },
});

