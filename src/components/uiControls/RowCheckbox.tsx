import React, { memo } from "react";
import { Pressable, View, StyleSheet, ViewStyle } from "react-native";

/** A customizable checkbox component for use in rows or lists 
 *  Props: what the component accepts
*/
type Props = {
  selected: boolean;
  onPress: () => void;
  size?: number;       
  color?: string;      
  style?: ViewStyle;       
  disabled?: boolean;
};

const RowCheckbox: React.FC<Props> = ({
  selected,
  onPress,
  size,
  color = "#2E7D32",
  style,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.cell, style]}
      hitSlop={30} /*Increases touchable area*/
      accessibilityRole="checkbox" 
      accessibilityState={{ selected, disabled }}
      >
      <View
        style={[
          styles.box,
          { width: size, height: size, borderRadius: 4 },
          selected && { backgroundColor: color, borderColor: color },
        ]}
        >
        {selected && (<View style={{ backgroundColor: "#fff" }} />)}
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