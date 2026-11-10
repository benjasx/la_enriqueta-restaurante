import { site, whatsappUrl } from "@/data/site";

export const Footer = () => (
  <>
    <footer className="bg-ink px-[clamp(20px,4vw,32px)] py-9 text-[#e9d9cf]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-[22px] text-[#ffb98a]">
            {site.name}
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-[#a8928a] uppercase">
            {site.tagline}
          </span>
        </div>
        <span className="text-[13px] text-[#a8928a]">
          © {new Date().getFullYear()} {site.name} · {site.city}
        </span>
      </div>
    </footer>
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir por WhatsApp"
      className="bg-green hover:bg-green-dark fixed right-5 bottom-5 z-[60] flex items-center gap-2.5 rounded-full py-3.5 pr-5 pl-4 text-[15px] font-semibold text-white shadow-[0_12px_28px_-10px_rgba(20,60,30,0.6)]"
    >
      <span className="grid size-[26px] place-items-center rounded-full bg-white">
        <span className="size-2.5 rounded-full bg-[#2f9e48]" />
      </span>
      WhatsApp
    </a>
  </>
);
