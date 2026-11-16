import { createContext, useContext } from "react";

export type TableContextValue = {
  table: number | null; // mesa activa, o null en el flujo normal
  leaveTable: () => void;
};

export const TableContext = createContext<TableContextValue | null>(null);

export const useTable = () => {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error("useTable must be used inside <TableProvider>");
  return ctx;
};
