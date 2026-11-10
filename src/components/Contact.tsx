import { site, whatsappUrl } from "@/data/site";

export const Contact = () => (
  <section id="contacto" className="bg-brand-orange/15 py-16">
    <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2">
      <div>
        <h2 className="font-display text-brand-pink text-4xl font-bold">
          Ubicación y contacto
        </h2>
        <p className="mt-4">{site.address}</p>
        <ul className="mt-4">
          {site.schedule.map((s) => (
            <li key={s.days}>
              <strong>{s.days}:</strong> {s.hours}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`tel:${site.phone}`}
            className="bg-brand-pink rounded-full px-6 py-3 font-bold text-white hover:brightness-110"
          >
            Llamar
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="bg-brand-green rounded-full px-6 py-3 font-bold text-white hover:brightness-110"
          >
            WhatsApp
          </a>
        </div>
      </div>
      {site.mapsEmbedUrl ? (
        <iframe
          title="Mapa de La Enriqueta"
          src={site.mapsEmbedUrl}
          loading="lazy"
          className="h-72 w-full rounded-xl border-0"
        />
      ) : (
        <div className="grid h-72 place-items-center rounded-xl bg-white text-sm">
          Mapa por definir
        </div>
      )}
    </div>
  </section>
);
