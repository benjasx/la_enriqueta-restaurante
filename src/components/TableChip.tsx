import { useTable } from "@/table/useTable";

export const TableChip = () => {
  const { table } = useTable();
  if (table === null) return null;
  return (
    <div
      role="status"
      className="bg-wine text-cream fixed bottom-4 left-4 z-40 rounded-full px-4 py-2 text-[13px] font-semibold shadow-lg"
    >
      Mesa {table}
    </div>
  );
};
