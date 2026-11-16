import { site } from "@/data/site";

export const TABLE_KEY = "enriqueta:table:v1";

export const parseTable = (
  raw: string | null,
  max: number = site.tables,
): number | null => {
  if (raw === null || !/^[1-9]\d*$/.test(raw)) return null;
  const n = Number(raw);
  return n <= max ? n : null;
};

export const loadTable = (): number | null => {
  try {
    return parseTable(window.sessionStorage.getItem(TABLE_KEY));
  } catch {
    return null;
  }
};

export const saveTable = (table: number | null) => {
  try {
    if (table === null) window.sessionStorage.removeItem(TABLE_KEY);
    else window.sessionStorage.setItem(TABLE_KEY, String(table));
  } catch {
    // sessionStorage no disponible: la mesa vive solo en memoria
  }
};
