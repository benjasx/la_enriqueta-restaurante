import { useCallback, useEffect, useRef, useState } from "react";
import files from "virtual:gallery-images";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

const gallery = files.map((file) => ({
  id: file,
  src: `/img/${file}`,
  hint: file
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim(),
}));

const shuffle = <T,>(items: T[]) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const Gallery = () => {
  const [selected, setSelected] = useState<(typeof gallery)[number] | null>(
    null,
  );

  const [slides] = useState(() => shuffle(gallery));
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => {
      const n = slides.length;
      const idx = (i + n) % n;
      const el = itemRefs.current[idx];
      const track = trackRef.current;
      if (!el || !track) return;
      track.scrollTo?.({
        left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2,
        behavior: "smooth",
      });
      setActive(idx);
    },
    [slides.length],
  );

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    setActive(best);
  };

  useEffect(() => {
    if (paused || selected || slides.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => goTo(active + 1), 3500);
    return () => window.clearInterval(id);
  }, [paused, selected, active, goTo, slides.length]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  return (
    <section
      id="galeria"
      className="bg-sand px-[clamp(20px,4vw,32px)] py-[clamp(64px,10vw,112px)]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="text-orange mb-3 font-sans text-xs font-semibold tracking-[0.2em] uppercase">
            Galería
          </div>
          <h2 className="font-display text-wine m-0 text-[clamp(38px,5.5vw,64px)] leading-[0.98] font-semibold tracking-[-0.02em]">
            Pásale a ver
          </h2>
          <p className="text-body mt-4 mb-9 max-w-[460px] text-base leading-[1.55]">
            Pozole, chilaquiles, sopes y más, hechos al momento.
          </p>
        </Reveal>
      </div>
      <div className="mx-auto max-w-[1400px]">
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div
            ref={trackRef}
            onScroll={onScroll}
            aria-roledescription="carrusel"
            aria-label="Galería de platillos"
            className="flex snap-x snap-mandatory items-center gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth px-[10%] py-8 sm:px-[calc(50%-230px)] [&::-webkit-scrollbar]:hidden"
          >
            {slides.map((g, i) => (
              <div
                key={g.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${slides.length}`}
                className={`shadow-card relative aspect-[4/5] w-[80%] shrink-0 snap-center overflow-hidden rounded-[var(--radius-card)] transition-all duration-500 ease-out sm:w-[460px] ${
                  i === active
                    ? "scale-100 opacity-100"
                    : "scale-[0.88] opacity-55"
                }`}
              >
                <button
                  type="button"
                  aria-label={`Ver ${g.hint}`}
                  onClick={() => (i === active ? setSelected(g) : goTo(i))}
                  className="block size-full cursor-zoom-in"
                >
                  <Photo src={g.src} hint={g.hint} />
                </button>
              </div>
            ))}
          </div>
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === "prev" ? "Foto anterior" : "Foto siguiente"}
              onClick={() => goTo(active + (dir === "prev" ? -1 : 1))}
              className={`text-wine shadow-card absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white/90 text-2xl backdrop-blur transition-transform hover:scale-110 sm:grid ${
                dir === "prev" ? "left-4" : "right-4"
              }`}
            >
              {dir === "prev" ? "‹" : "›"}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          {slides.map((g, i) => (
            <button
              key={g.id}
              type="button"
              aria-label={`Ir a ${g.hint}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-300 ${
                i === active ? "bg-wine w-8" : "bg-wine/25 w-2"
              }`}
            />
          ))}
        </div>
      </div>
      {selected?.src && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.hint}
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[80] grid cursor-zoom-out place-items-center bg-black/85 p-4"
        >
          <button
            type="button"
            aria-label="Cerrar imagen"
            onClick={() => setSelected(null)}
            className="text-ink absolute top-4 right-4 grid size-11 cursor-pointer place-items-center rounded-full bg-white text-2xl leading-none font-semibold"
          >
            ×
          </button>
          <img
            src={selected.src}
            alt={selected.hint}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full cursor-default rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
