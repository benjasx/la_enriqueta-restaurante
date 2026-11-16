import { site } from "@/data/site";

export const parseTable = (
  raw: string | null,
  max: number = site.tables,
): number | null => {
  if (raw === null || !/^[1-9]\d*$/.test(raw)) return null;
  const n = Number(raw);
  return n <= max ? n : null;
};

// Acceso a la página de mesa: devuelve la mesa solo si `key` es una cadena no
// vacía, `k` es idéntico a `key` y `n` es una mesa válida; si no, null.
export const readAccess = (
  search: string,
  key: string | undefined,
  max: number = site.tables,
): number | null => {
  if (!key) return null;
  const params = new URLSearchParams(search);
  if (params.get("k") !== key) return null;
  return parseTable(params.get("n"), max);
};
