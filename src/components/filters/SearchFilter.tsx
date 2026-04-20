import type React from "react";
import { memo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

/**
 * SearchFilter is a reusable component that provides a labeled text input for filtering items by name or other text criteria.
 * Props:
 * - value: The current text value of the filter.
 * - onChange: A callback function that is called when the text changes. It receives the new text as a parameter.
 * - placeholder: Optional placeholder text for the input field.
 * - label: Optional label to display before the input field.
 */
type SearchProps = {
	value: string;
	onChange: (text: string) => void;
	placeholder?: string;
	label?: string;
};

const SearchFilter: React.FC<SearchProps> = ({
	value,
	onChange,
	placeholder = "Ingresar nombre",
	label = "Buscar:",
}) => {
	return (
		<View style={styles.row}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChange}
				placeholder={placeholder}
				autoCorrect={false}
				autoCapitalize="none"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		padding: 4,
	},
	label: {
		fontSize: 14,
		fontWeight: "400",
		marginRight: 4,
	},
	input: {
		width: 170,
		paddingVertical: 4,
		fontSize: 14,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		backgroundColor: "#fff",
	},
});

export default memo(SearchFilter);