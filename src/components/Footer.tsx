import { site } from "@/data/site";

export const Footer = () => (
  <>
    <footer className="bg-ink rounded-t-[clamp(28px,4vw,48px)] px-[clamp(20px,4vw,32px)] py-12 text-[#e9d9cf]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-[26px] font-semibold text-[#ffb98a]">
            {site.name}
          </span>
          <span className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#a8928a] uppercase">
            {site.tagline}
          </span>
        </div>
        <span className="text-[13px] text-[#a8928a]">
          © {new Date().getFullYear()} {site.name} · {site.city}
        </span>
      </div>
    </footer>
  </>
);
