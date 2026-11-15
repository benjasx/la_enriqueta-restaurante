import { site } from "@/data/site";

const icons: Record<string, string> = {
  facebook:
    "M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z",
  instagram:
    "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm4.7-2.6a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1Z",
  tiktok:
    "M16.6 3h-2.8v12.2a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.8a5.4 5.4 0 1 0 4.6 5.4V9a6.6 6.6 0 0 0 3.8 1.2V7.4A3.8 3.8 0 0 1 16.6 3Z",
};

export const Footer = () => (
  <>
    <footer className="bg-ink rounded-t-[clamp(28px,4vw,48px)] px-[clamp(20px,4vw,32px)] py-12 text-[#e9d9cf]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-display text-[26px] font-semibold text-[#ffb98a]">
            {site.name}
          </span>
          <span className="font-sans text-[11px] font-semibold tracking-[0.14em] text-[#a8928a] uppercase">
            {site.tagline}
          </span>
        </div>
        <ul className="m-0 flex list-none gap-3 p-0">
          {site.socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="hover:bg-orange grid size-11 place-items-center rounded-full bg-white/10 text-[#ffb98a] transition-colors hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-5"
                >
                  <path d={icons[s.id]} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
        <span className="text-[13px] text-[#a8928a]">
          © {new Date().getFullYear()} {site.name} · {site.city}
        </span>
      </div>
    </footer>
  </>
);
