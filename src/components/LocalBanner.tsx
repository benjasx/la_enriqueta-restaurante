import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export const LocalBanner = () => (
  <section className="w-full pt-[clamp(40px,8vw,96px)]">
    <Reveal className="w-full">
      <div className="w-full overflow-hidden bg-[#3a1424] md:grid md:grid-cols-2">
        <img
          src="/img/local.webp"
          alt="Fachada de La Enriqueta"
          loading="lazy"
          className="block h-auto w-full md:h-full md:object-cover"
        />
        <div className="text-cream flex w-full flex-col justify-center gap-8 p-[clamp(24px,4vw,48px)]">
          <div>
            <div className="mb-3 font-sans text-xs font-semibold tracking-[0.2em] text-[#ffd7a8] uppercase">
              Visítanos
            </div>
            <h2 className="font-display m-0 max-w-[560px] text-[clamp(30px,4.2vw,52px)] leading-[1.02] font-semibold tracking-[-0.02em] text-balance">
              Aquí te esperamos, en Tepic
            </h2>
            <p className="m-0 mt-3 text-base text-[#f5e6da]">
              {site.addressLines.join(", ")}
            </p>
          </div>
          <a
            href="#ubicacion"
            className="bg-cream text-ink hover:text-wine self-start rounded-full px-7 py-4 text-base font-semibold hover:bg-white"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </Reveal>
  </section>
);
