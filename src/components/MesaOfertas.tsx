const promos = [
  {
    src: "/img/promo_miche.webp",
    title: "Micheladas 2x1",
    days: "Lunes a miércoles",
    alt: "Promoción de La Enriqueta: micheladas 2x1 de lunes a miércoles",
  },
  {
    src: "/img/tragos.webp",
    title: "Tragos 2x1",
    days: "Jueves y viernes",
    alt: "Promoción de La Enriqueta: tragos 2x1 jueves y viernes",
  },
];

export const MesaOfertas = () => (
  <section
    id="ofertas"
    aria-label="Ofertas"
    className="bg-[#5c0f33] px-5 py-16 text-[#fff3e8]"
  >
    <div className="mx-auto max-w-[1180px]">
      <div className="text-xs font-semibold tracking-[0.22em] text-[#f2b84b] uppercase">
        Promociones de la semana
      </div>
      <h2 className="font-display m-0 mt-3 mb-10 text-[clamp(36px,5vw,56px)] leading-[1.05] font-normal">
        Ofertas
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-8">
        {promos.map((p) => (
          <figure key={p.src} className="m-0 flex min-w-0 flex-col gap-4">
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="h-auto w-full rounded-3xl"
            />
            <figcaption className="text-lg text-[#f3d9cf]">
              <strong className="font-display text-[#f2b84b]">{p.title}</strong>
              {" · "}
              {p.days}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);
