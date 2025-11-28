import React, { memo } from "react";
import { Pressable, View, StyleSheet, ViewStyle, Image, ImageStyle } from "react-native";

/** A customizable checkbox component for use in rows or lists 
 *  Props: Type of what the component accepts
*/
type Props = {
  selected: boolean;
  onPress: () => void;
  size?: number;       
  selectedColor?: string;
  radius?: number;
  width?: number;       
  color?: string;      
  style?: ViewStyle;       
  disabled?: boolean;
};

// RowCheckbox component definition
const RowCheckbox: React.FC<Props> = ({
  selected,
  onPress,
  size = 15,
  selectedColor = "#2E7D32",
  radius = 4,
  width = 1.5,
  color = "transparent",
  style,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.cell, style]}
      hitSlop={15} /*Increases touchable area*/
      accessibilityRole="checkbox" 
      accessibilityState={{ selected, disabled }}
      >
      <View
        style={[
          styles.box,
          { width: size, height: size, borderRadius: radius, borderWidth: width, borderColor: color },
          selected && { backgroundColor: selectedColor, borderColor: selectedColor },
        ]}
        >
        <Image
          source={require('../../../assets/icons/check.png')}
          style={[{ width: size-5, height: size-5, tintColor: '#000000ff' }]}
          resizeMode="contain"
        />
        {/* {selected && (<View style={{ backgroundColor: "#fff" }} />)} */}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    borderWidth: 1.5,
    borderColor: "#555",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default memo(RowCheckbox);