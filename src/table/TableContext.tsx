import { useCallback, useState, type ReactNode } from "react";
import { loadTable, parseTable, saveTable } from "@/table/tableSession";
import { TableContext } from "@/table/useTable";

// Lee `?mesa=N` una sola vez al montar: si es válida la guarda y limpia la URL;
// si no, conserva la mesa guardada en la sesión (si hay).
const initialTable = (): number | null => {
  const url = new URL(window.location.href);
  if (url.searchParams.has("mesa")) {
    const fromUrl = parseTable(url.searchParams.get("mesa"));
    if (fromUrl !== null) saveTable(fromUrl);
    url.searchParams.delete("mesa");
    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
    if (fromUrl !== null) return fromUrl;
  }
  return loadTable();
};

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [table, setTable] = useState<number | null>(initialTable);

  const leaveTable = useCallback(() => {
    saveTable(null);
    setTable(null);
  }, []);

  return <TableContext value={{ table, leaveTable }}>{children}</TableContext>;
};
