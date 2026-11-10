import { site, whatsappUrl } from "@/data/site";

const label = "text-muted font-mono text-[11px] tracking-[0.16em] uppercase";

export const Contact = () => (
  <section
    id="ubicacion"
    className="bg-sand px-[clamp(20px,4vw,32px)] py-[clamp(64px,10vw,112px)]"
  >
    <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-[clamp(28px,4vw,48px)]">
      <div id="contacto" className="flex flex-col gap-7">
        <div>
          <div className="text-orange mb-3 font-mono text-xs tracking-[0.2em] uppercase">
            Ubicación y Contacto
          </div>
          <h2 className="font-display text-wine m-0 text-[clamp(36px,5vw,58px)] leading-none font-normal">
            Te esperamos
          </h2>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className={label}>Dirección</div>
          <address className="text-lg leading-normal not-italic">
            {site.addressLines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
            <a
              href={`tel:+${site.phone}`}
              className="text-wine hover:text-orange font-semibold"
            >
              {site.phoneLabel}
            </a>
          </address>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className={label}>Horarios</div>
          {site.hours.map((h) => (
            <div
              key={h.days}
              className="flex justify-between gap-4 border-b border-dashed border-[#d9c4b2] pb-2.5 text-base"
            >
              <span>{h.days}</span>
              <span
                className={`font-semibold ${h.open ? "text-green" : "text-wine"}`}
              >
                {h.time}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:+${site.phone}`}
            className="bg-orange hover:bg-orange-dark flex min-h-[52px] flex-[1_1_180px] items-center justify-center rounded-[14px] font-semibold text-white"
          >
            Llamar ahora
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green hover:bg-green-dark flex min-h-[52px] flex-[1_1_180px] items-center justify-center rounded-[14px] font-semibold text-white"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
      <div className="min-h-[380px] overflow-hidden rounded-3xl border-[6px] border-white shadow-[0_20px_40px_-24px_rgba(90,30,40,0.4)]">
        <iframe
          title="Mapa La Enriqueta Tepic"
          src={site.mapsEmbedUrl}
          loading="lazy"
          className="block size-full min-h-[380px] border-0"
        />
      </div>
    </div>
  </section>
);
