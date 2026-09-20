import { formatIsoDate } from "../../../shared/utils/dateHelpers";
import type { SowInfoRow } from "../components/SowInfoTable";
import type { Sow } from "../model/sow";

/**
 * Builds the display rows for SowInfoTable from a Sow entity.
 * Pure function — no side effects, decoupled from the screen component.
 */
export function buildSowRows(sow: Sow): SowInfoRow[] {
	return [
		{ label: "Estado",              value: sow.status ?? "Sin estado" },
		{ label: "Raza",                value: sow.breed?.breed_name?.trim() ?? "Sin raza" },
		{ label: "Fecha de entrada",    value: formatIsoDate(sow.entry_date) },
		{ label: "Ultimo Destete",    	value: formatIsoDate(sow.last_weaning_date) },
		{ label: "Cantidad de pezones", value: sow.mammary_glands ?? "-" },
		{ label: "Peso (kg)",           value: sow.weight ?? "-" },
		{ label: "Largo (cm)",          value: sow.length ?? "-" },
		{ label: "Cantidad de partos",  value: sow.farrowing_number ?? "-" },
		{ label: "Descripción",         value: sow.description?.trim() || "-" },
	];
}
