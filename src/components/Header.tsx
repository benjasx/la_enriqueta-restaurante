import { site } from "@/data/site";

const links = [
  { href: "#menu", label: "Menú" },
  { href: "#galeria", label: "Galería" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export const Header = () => (
  <header className="bg-brand-cream/95 sticky top-0 z-10 shadow-sm backdrop-blur">
    <nav
      aria-label="Principal"
      className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2"
    >
      <a href="#inicio" className="flex items-center gap-2">
        <img src="/img/logo.jpg" alt="" className="size-10 rounded-full" />
        <span className="font-display text-lg font-bold">{site.name}</span>
      </a>
      <ul className="flex gap-4 text-sm font-semibold">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="hover:text-brand-pink">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
