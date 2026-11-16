import type { ReactNode } from "react";
import { site } from "@/data/site";

export const MesaHeader = ({
  table,
  children,
}: {
  table: number;
  children?: ReactNode;
}) => (
  <header className="sticky top-0 z-50 px-4 pt-3">
    <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 rounded-[22px] border border-[#f0e2d3] bg-[rgba(255,251,246,0.92)] py-2.5 pr-3 pl-3.5 shadow-[0_8px_24px_rgba(90,30,40,0.08)] backdrop-blur-[10px]">
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src="/img/logo.webp"
          alt={`${site.name} · ${site.tagline}`}
          className="block size-10 shrink-0 rounded-[10px] object-cover"
        />
        <span className="font-display text-wine hidden truncate text-xl min-[400px]:inline">
          {site.name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="bg-orange rounded-full px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap text-white">
          Mesa {table}
        </span>
        {children}
      </div>
    </div>
  </header>
);
