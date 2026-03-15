/**
 * Helpers for converting dates between local representation and UTC-midnight.
 *
 * The app stores dates as ISO strings at UTC midnight (e.g. 2025-12-26T00:00:00.000Z).
 * To display the correct day regardless of the device timezone we build a local
 * Date using the UTC year/month/day components. When saving, we convert the
 * selected local date to a Date set to UTC midnight so `toISOString()` yields
 * the expected ISO.
 */

// Converts a local Date to a Date set to UTC midnight
export function localDateToUtcMidnight(date: Date): Date {
	return new Date(
		Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
	);
}

// Converts a UTC ISO string or Date to a local Date for display
export function utcIsoOrDateToLocalForDisplay(
	value?: string | Date | null,
): Date | null {
	if (!value) return null;
	const d = typeof value === "string" ? new Date(value) : value;
	return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

// Converts a local Date to a UTC ISO string at midnight
export function utcIsoStringFromLocalDate(date: Date): string {
	return localDateToUtcMidnight(date).toISOString();
}

export default {
	localDateToUtcMidnight,
	utcIsoOrDateToLocalForDisplay,
	utcIsoStringFromLocalDate,
};
