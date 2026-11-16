import type { ReactNode } from "react";
import { site } from "@/data/site";

export const MesaHeader = ({
  table,
  children,
}: {
  table: number;
  children?: ReactNode;
}) => (
  <header className="sticky top-0 z-50 px-[clamp(12px,3vw,24px)] pt-3">
    <div className="border-line mx-auto max-w-300 rounded-3xl border bg-[rgba(251,246,238,0.98)] shadow-[0_12px_32px_-16px_rgba(120,20,60,0.4)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/img/logo.webp"
            alt={`${site.name} · ${site.tagline}`}
            className="block size-12 shrink-0 rounded-2xl object-cover"
          />
          <span className="font-display text-wine truncate text-[22px] font-semibold">
            {site.name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="bg-orange rounded-full px-3 py-1.5 text-[14px] font-semibold whitespace-nowrap text-white">
            Mesa {table}
          </span>
          {children}
        </div>
      </div>
    </div>
  </header>
);
