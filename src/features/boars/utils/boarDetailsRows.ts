import { formatIsoDate } from "../../../shared/utils/dateHelpers";
import type { BoarInfoRow } from "../components/BoarInfoTable";
import type { Boar } from "../model/boar";

// Builds the age string from the boar's age object.
function formatAge(age: Boar["age"]): string {
	if (!age) return "-";
	const { years, months } = age;
	return `${years} año${years === 1 ? "" : "s"} y ${months} mes${months === 1 ? "" : "es"}`;
}

/**
 * Builds the display rows for BoarInfoTable from a Boar entity.
 * Pure function — no side effects, decoupled from the screen component.
 * Conditional rows (removal_date, removal_reason) are appended only when present.
 */
export function buildBoarRows(boar: Boar): BoarInfoRow[] {
	const rows: BoarInfoRow[] = [
		{ label: "Raza",                value: boar.breeds?.breed_name ?? "-" },
		{ label: "Fecha de Nacimiento", value: formatIsoDate(boar.birth_date) },
		{ label: "Edad",                value: formatAge(boar.age) },
		{ label: "Peso (kg)",           value: boar.weight ?? "-" },
		{ label: "Largo (cm)",          value: boar.length ?? "-" },
		{ label: "Descripción",         value: boar.description?.trim() || "-" },
	];

	if (boar.removal_date) {
		rows.push({ label: "Fecha de retiro",  value: formatIsoDate(boar.removal_date) });
	}
	if (boar.removal_reason) {
		rows.push({ label: "Motivo de retiro", value: boar.removal_reason });
	}

	return rows;
}
