import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SowProfileHeaderProps = {
  /** The sow's tag number displayed as the name/identifier. */
  tagNumber: string;
  /**
   * If provided, the tag number becomes tappable and this callback is invoked.
   * Used in EditSowScreen to open the tag number editing modal.
   * Omit in DetailsSowScreen for a read-only display.
   */
  onEditTag?: () => void;
};

/**
 * Profile header component shared by EditSowScreen and DetailsSowScreen.
 * Displays an image placeholder and the sow's tag number.
 * When onEditTag is provided, the tag number is rendered as a Pressable.
 *
 * Used by: EditSowScreen, DetailsSowScreen.
 */
function SowProfileHeader({ tagNumber, onEditTag }: SowProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />
      {onEditTag ? (
        <Pressable onPress={onEditTag}>
          <Text style={styles.name}>{tagNumber}</Text>
        </Pressable>
      ) : (
        <Text style={styles.name}>{tagNumber}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default memo(SowProfileHeader);
