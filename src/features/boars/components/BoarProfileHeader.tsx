import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type BoarProfileHeaderProps = {
  /** Boar identifier to display as the profile name. */
  tagNumber: string;
  /** When provided, the tag label becomes tappable and calls this to open the edit-tag modal. */
  onEditTag?: () => void;
};

/**
 * Profile header component for a boar detail/edit screen.
 * Displays an image placeholder and the boar's tag number.
 * When onEditTag is provided the label becomes tappable (edit mode).
 */
function BoarProfileHeader({ tagNumber, onEditTag }: BoarProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />
      {onEditTag ? (
        <Pressable onPress={onEditTag}>
          <Text style={styles.name}>{tagNumber || 'Sin identificador'}</Text>
        </Pressable>
      ) : (
        <Text style={styles.name}>{tagNumber || 'Sin identificador'}</Text>
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

export default memo(BoarProfileHeader);
