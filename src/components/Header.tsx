import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import type { Ref } from "react";
import { CartButton } from "@/components/CartButton";
import { site } from "@/data/site";
import { useTable } from "@/table/useTable";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Menú Digital", href: "#menu" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Galería", href: "#galeria" },
  { label: "Ubicación", href: "#ubicacion" },
];

export const Header = ({
  onOpenCart,
  cartButtonRef,
}: {
  onOpenCart: () => void;
  cartButtonRef?: Ref<HTMLButtonElement>;
}) => {
  const { table } = useTable();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 8);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <header className="sticky top-0 z-50 px-[clamp(12px,3vw,24px)] pt-3">
      <div
        className={`border-line mx-auto max-w-300 rounded-3xl border backdrop-blur-md transition-[background-color,box-shadow] duration-300 ${
          scrolled
            ? "bg-[rgba(251,246,238,0.98)] shadow-[0_12px_32px_-16px_rgba(120,20,60,0.4)]"
            : "bg-[rgba(251,246,238,0.85)]"
        }`}
      >
        <nav
          aria-label="Principal"
          className="flex items-center justify-between gap-4 px-3 py-2.5 pl-3.5 min-[1100px]:px-4"
        >
          <a href="#inicio" className="text-ink flex items-center gap-3">
            <img
              src="/img/logo.webp"
              alt={`${site.name} · ${site.tagline}`}
              className="block size-12 rounded-2xl object-cover"
            />
            <div className="flex flex-col leading-[1.05]">
              <span className="font-display text-wine text-[22px] font-semibold whitespace-nowrap">
                {site.name}
              </span>
              <span className="text-orange font-sans text-[10px] font-semibold tracking-[0.18em] uppercase">
                {site.tagline}
              </span>
            </div>
          </a>
          <div className="hidden items-center gap-7 min-[1100px]:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-ink hover:text-wine decoration-orange text-sm font-medium underline-offset-[6px] hover:underline hover:decoration-2"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {table !== null && (
              <span className="bg-wine text-cream rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap">
                <span aria-hidden="true" className="min-[420px]:hidden">
                  M{table}
                </span>
                <span className="max-[419px]:sr-only">Mesa {table}</span>
              </span>
            )}
            <CartButton ref={cartButtonRef} onOpen={onOpenCart} />
            <button
              type="button"
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="bg-sand flex size-11 cursor-pointer flex-col items-center justify-center gap-1.25 rounded-full min-[1100px]:hidden"
            >
              <span className="bg-ink h-0.5 w-5 rounded-sm" />
              <span className="bg-ink h-0.5 w-5 rounded-sm" />
              <span className="bg-ink h-0.5 w-3.5 rounded-sm" />
            </button>
          </div>
        </nav>
        {open && (
          <div className="border-line flex flex-col gap-0.5 border-t px-4 pt-2 pb-4 min-[1100px]:hidden">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-ink border-line border-b px-1.5 py-3.5 text-base font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
