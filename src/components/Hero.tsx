import { site, whatsappUrl } from "@/data/site";

export const Hero = () => (
  <section
    id="inicio"
    className="bg-brand-ink relative grid min-h-[70vh] place-items-center bg-cover bg-center text-center text-white"
    style={{ backgroundImage: "url(/img/local.jpg)" }}
  >
    <div className="bg-brand-ink/60 absolute inset-0" />
    <div className="relative px-4 py-16">
      <h1 className="font-display text-5xl font-bold sm:text-6xl">
        {site.name}
      </h1>
      <p className="mt-2 text-xl">{site.tagline}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a
          href="#menu"
          className="bg-brand-orange rounded-full px-6 py-3 font-bold hover:brightness-110"
        >
          Ver menú
        </a>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noreferrer"
          className="bg-brand-green rounded-full px-6 py-3 font-bold hover:brightness-110"
        >
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  </section>
);
