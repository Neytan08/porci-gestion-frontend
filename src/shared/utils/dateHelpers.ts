/**
 * Helpers for converting dates between local representation and UTC-midnight.
 *
 * The app stores dates as ISO strings at UTC midnight.
 * To display the correct day regardless of the device timezone, we build a
 * local Date using the UTC year, month, and day components.
 */

// Converts a local Date to a Date set to UTC midnight.
export function localDateToUtcMidnight(date: Date): Date {
	return new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
	);
}

// Converts a UTC ISO string or Date into a local Date for display.
export function utcIsoOrDateToLocalForDisplay(
	value?: string | Date | null,
): Date | null {
	if (!value) return null;
	const date = typeof value === "string" ? new Date(value) : value;

	return new Date(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
	);
}

// Converts a local Date into a UTC ISO string at midnight.
export function utcIsoStringFromLocalDate(date: Date): string {
	return localDateToUtcMidnight(date).toISOString();
}

// Extracts the date part (YYYY-MM-DD) from a UTC ISO string.
// Returns the fallback ("-") when the value is absent or not a valid ISO string.
export function formatIsoDate(value?: string | null, fallback = "-"): string {
	if (!value) return fallback;
	const part = value.split("T")[0];
	return part.length === 10 ? part : fallback;
}

export default {
	localDateToUtcMidnight,
	utcIsoOrDateToLocalForDisplay,
	utcIsoStringFromLocalDate,
	formatIsoDate,
};
