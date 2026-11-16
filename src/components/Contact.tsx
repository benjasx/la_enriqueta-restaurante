import { Reveal } from "@/components/Reveal";
import { site, whatsappUrl } from "@/data/site";

const label =
  "text-muted font-sans text-[11px] font-semibold tracking-[0.16em] uppercase";

export const Contact = () => (
  <section
    id="ubicacion"
    className="px-[clamp(20px,4vw,32px)] py-[clamp(64px,10vw,112px)]"
  >
    <div className="mx-auto grid max-w-300 grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-[clamp(28px,4vw,48px)]">
      <div
        id="contacto"
        className="rounded-card shadow-card flex flex-col gap-7 bg-white p-[clamp(24px,4vw,40px)]"
      >
        <Reveal>
          <div className="text-orange mb-3 font-sans text-xs font-semibold tracking-[0.2em] uppercase">
            Ubicación y Contacto
          </div>
          <h2 className="font-display text-wine m-0 text-[clamp(38px,5.5vw,64px)] leading-[0.98] font-semibold tracking-[-0.02em]">
            Te esperamos
          </h2>
        </Reveal>
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
              className="border-line flex justify-between gap-4 border-b pb-2.5 text-base"
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
            className="bg-orange hover:bg-orange-dark flex min-h-13 flex-[1_1_180px] items-center justify-center rounded-full font-semibold text-white"
          >
            Llamar ahora
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green hover:bg-green-dark flex min-h-13 flex-[1_1_180px] items-center justify-center rounded-full font-semibold text-white"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
      <div className="rounded-card shadow-card min-h-95 overflow-hidden border-[6px] border-white">
        <iframe
          title="Mapa La Enriqueta Tepic"
          src={site.mapsEmbedUrl}
          loading="lazy"
          className="block size-full min-h-95 border-0"
        />
      </div>
    </div>
  </section>
);
