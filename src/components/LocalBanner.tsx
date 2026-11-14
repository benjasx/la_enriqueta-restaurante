import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export const LocalBanner = () => (
  <section className="px-[clamp(16px,4vw,32px)] pt-[clamp(40px,8vw,96px)]">
    <Reveal className="mx-auto max-w-[1200px]">
      <div className="rounded-card shadow-card relative flex min-h-[clamp(320px,42vw,460px)] items-end overflow-hidden bg-[#3a1424]">
        <div className="absolute inset-0 [&_img]:saturate-[1.15]">
          <Photo
            src="/img/local.jpg"
            hint="Foto: fachada del restaurante"
            alt="Fachada de La Enriqueta"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(42,10,24,0.88)_0%,rgba(42,10,24,0.3)_55%,transparent_100%)]" />
        <div className="text-cream relative flex w-full flex-wrap items-end justify-between gap-6 p-[clamp(24px,4vw,48px)]">
          <div>
            <div className="mb-3 font-sans text-xs font-semibold tracking-[0.2em] text-[#ffd7a8] uppercase">
              Visítanos
            </div>
            <h2 className="font-display m-0 max-w-[560px] text-[clamp(30px,4.2vw,52px)] leading-[1.02] font-semibold tracking-[-0.02em] text-balance [text-shadow:0_4px_24px_rgba(0,0,0,0.4)]">
              Aquí te esperamos, en Tepic
            </h2>
            <p className="m-0 mt-3 text-base text-[#f5e6da]">
              {site.addressLines.join(", ")}
            </p>
          </div>
          <a
            href="#ubicacion"
            className="bg-cream text-ink hover:text-wine rounded-full px-7 py-4 text-base font-semibold hover:bg-white"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </Reveal>
  </section>
);
