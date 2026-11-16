import { createContext, useContext } from "react";

export type TableContextValue = {
  table: number | null; // mesa activa, o null en el sitio principal
};

// Sin proveedor (sitio principal) el valor por defecto es "sin mesa".
export const TableContext = createContext<TableContextValue>({ table: null });

export const useTable = () => useContext(TableContext);
