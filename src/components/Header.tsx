import { useState } from "react";
import { site, whatsappUrl } from "@/data/site";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Menú Digital", href: "#menu" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Galería", href: "#galeria" },
  { label: "Ubicación", href: "#ubicacion" },
  { label: "Contacto", href: "#contacto" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-line sticky top-0 z-50 border-b bg-[rgba(251,246,238,0.94)] backdrop-blur-[10px]">
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-[clamp(16px,4vw,32px)] py-3"
      >
        <a href="#inicio" className="text-ink flex items-center gap-3">
          <img
            src="/img/logo.jpg"
            alt={`${site.name} · ${site.tagline}`}
            className="block size-14 rounded-[14px] object-cover"
          />
          <div className="flex flex-col leading-[1.05]">
            <span className="font-display text-wine text-[21px] whitespace-nowrap">
              {site.name}
            </span>
            <span className="text-orange font-mono text-[10px] tracking-[0.18em] uppercase">
              {site.tagline}
            </span>
          </div>
        </a>
        <div className="hidden items-center gap-[26px] min-[1100px]:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-ink hover:text-wine text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green hover:bg-green-dark text-cream flex items-center gap-2 rounded-full px-[18px] py-[11px] text-sm font-semibold"
          >
            <span className="size-2 rounded-full bg-[#8ee29b]" />
            Pedir por WhatsApp
          </a>
        </div>
        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex size-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border-[1.5px] border-[#e3cfc0] bg-white min-[1100px]:hidden"
        >
          <span className="bg-ink h-0.5 w-5 rounded-sm" />
          <span className="bg-ink h-0.5 w-5 rounded-sm" />
          <span className="bg-ink h-0.5 w-3.5 rounded-sm" />
        </button>
      </nav>
      {open && (
        <div className="border-line flex flex-col gap-0.5 border-t px-4 pt-2 pb-[18px] min-[1100px]:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-ink border-b border-[#f1e6da] px-1.5 py-[13px] text-base font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green text-cream mt-3 rounded-full p-3.5 text-center font-semibold"
          >
            Pedir por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};
