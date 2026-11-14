import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { gallery } from "@/data/site";

export const Gallery = () => {
  const [selected, setSelected] = useState<(typeof gallery)[number] | null>(
    null,
  );

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
        <div className="grid grid-flow-dense auto-rows-[220px] grid-cols-2 gap-4 min-[1024px]:grid-cols-4">
          {gallery.map((g, i) => (
            <Reveal
              key={g.id}
              delay={(i % 3) * 0.08}
              className={`shadow-card relative overflow-hidden rounded-[var(--radius-card)] ${g.className}`}
            >
              <motion.div
                className="size-full"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {g.src ? (
                  <button
                    type="button"
                    aria-label={`Ver ${g.hint}`}
                    onClick={() => setSelected(g)}
                    className="block size-full cursor-zoom-in"
                  >
                    <Photo src={g.src} hint={g.hint} />
                  </button>
                ) : (
                  <Photo hint={g.hint} />
                )}
              </motion.div>
            </Reveal>
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
