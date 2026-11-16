const photos = [
  {
    src: "/img/pozole.webp",
    alt: "Pozole",
    className: "row-span-2",
    eager: true,
  },
  { src: "/img/tostada.webp", alt: "Tostadas", className: "" },
  { src: "/img/especial.webp", alt: "Especial del día", className: "" },
];

const button =
  "flex-none rounded-full px-6 py-3.5 font-semibold whitespace-nowrap";

export const MesaHero = () => (
  <section className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-9 px-5 pt-12 pb-6">
    <div className="flex min-w-0 flex-col gap-[18px]">
      <div className="text-orange text-xs font-semibold tracking-[0.22em] uppercase">
        Antojitos · Tragos · Karaoke
      </div>
      <h1 className="font-display text-wine m-0 text-[clamp(40px,6vw,68px)] leading-[1.02] font-normal text-balance">
        ¿Qué se te antoja hoy?
      </h1>
      <p className="text-body m-0 max-w-[460px] text-lg leading-[1.55] text-pretty">
        Antojitos hechos al momento. Elige tu favorito y pídelo directo por
        WhatsApp.
      </p>
      <div aria-hidden="true" className="flex gap-1.5">
        {["bg-wine", "bg-orange", "bg-green", "bg-gold"].map((c) => (
          <span key={c} className={`size-2.5 rotate-45 ${c}`} />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-2.5">
        <a href="#menu" className={`${button} bg-wine text-white`}>
          Ver el menú
        </a>
        <a
          href="#karaoke"
          className={`${button} text-ink border-line border-[1.5px]`}
        >
          Viernes de karaoke
        </a>
      </div>
    </div>
    <div className="grid min-w-0 grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] grid-rows-[200px_200px] gap-3">
      {photos.map((p) => (
        <div key={p.src} className={`min-w-0 ${p.className}`}>
          <img
            src={p.src}
            alt={p.alt}
            loading={p.eager ? "eager" : "lazy"}
            className="size-full rounded-3xl object-cover"
          />
        </div>
      ))}
    </div>
  </section>
);
