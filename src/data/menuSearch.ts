import type { MenuItem } from "@/data/menu";

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export const matchesQuery = (d: MenuItem, query: string) => {
  const q = norm(query);
  if (!q) return true;
  return [d.name, ...(d.options?.map((o) => o.label) ?? [])].some((t) =>
    norm(t).includes(q),
  );
};
