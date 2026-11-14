import { motion } from "motion/react";
import { useState } from "react";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import {
  categories,
  categoryTag,
  dishes,
  minPrice,
  whatsappUrl,
  type CategoryId,
} from "@/data/site";

const mono =
  "font-sans text-[10px] font-medium text-muted tracking-[0.08em] uppercase";

export const Menu = () => {
  const [cat, setCat] = useState<"todos" | CategoryId>("todos");
  const visible =
    cat === "todos" ? dishes : dishes.filter((d) => d.category === cat);
  const count = (id: "todos" | CategoryId) =>
    id === "todos"
      ? dishes.length
      : dishes.filter((d) => d.category === id).length;

  return (
    <section
      id="menu"
      className="px-[clamp(20px,4vw,32px)] py-[clamp(64px,10vw,112px)]"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div className="text-orange mb-3 font-sans text-xs font-semibold tracking-[0.2em] uppercase">
              Menú Digital
            </div>
            <h2 className="font-display text-wine m-0 text-[clamp(38px,5.5vw,64px)] leading-[0.98] font-semibold tracking-[-0.02em]">
              ¿Qué se te antoja hoy?
            </h2>
            <p className="text-body mt-4 mb-0 max-w-[460px] text-base leading-[1.55]">
              Antojitos hechos al momento. Elige tu favorito y pídelo directo
              por WhatsApp.
            </p>
            <div aria-hidden="true" className="mt-[18px] flex gap-1.5">
              {["bg-wine", "bg-orange", "bg-green", "bg-gold"].map((c) => (
                <span key={c} className={`size-2.5 rotate-45 ${c}`} />
              ))}
            </div>
          </Reveal>
          <div
            role="tablist"
            className="bg-sand flex flex-wrap gap-1 rounded-full p-1.5"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`cursor-pointer rounded-full border-0 px-5 py-[11px] text-sm font-semibold transition-colors ${
                  cat === c.id
                    ? "bg-wine shadow-card text-white"
                    : "text-body hover:text-wine bg-transparent"
                }`}
              >
                {c.label}{" "}
                <span className="font-medium opacity-60">{count(c.id)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-5">
          {visible.map((d, i) => {
            const tag = categoryTag[d.category];
            const min = minPrice(d);
            return (
              <Reveal key={d.name} delay={(i % 3) * 0.08}>
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="rounded-card shadow-card flex h-full flex-col overflow-hidden bg-white transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(120,20,60,0.4)]"
                >
                  <div className="relative aspect-[4/3]">
                    <Photo
                      src={d.image}
                      hint={`Foto: ${d.name.toLowerCase()}`}
                      alt={d.name}
                    />
                    <span
                      className={`pointer-events-none absolute top-3 left-3 rounded-full px-3 py-1.5 font-sans text-[10px] font-semibold tracking-[0.14em] text-white uppercase ${tag.bg}`}
                    >
                      {tag.label}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 px-6 pt-5 pb-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-ink m-0 text-[23px] leading-[1.15] font-semibold">
                        {d.name}
                      </h3>
                      <div className="shrink-0 text-right">
                        <div className={mono}>
                          {d.options && d.options.length > 1 ? "desde" : ""}
                        </div>
                        <div className="font-display text-wine text-2xl leading-none font-bold">
                          ${min}
                        </div>
                        <div className={mono}>{d.unit}</div>
                      </div>
                    </div>
                    <p className="text-body m-0 flex-1 text-[14.5px] leading-[1.55] text-pretty">
                      {d.description}
                    </p>
                    {d.options && (
                      <div className="flex flex-col border-t border-dashed border-[#e3cfc0]">
                        {d.options.map((o) => (
                          <a
                            key={o.label}
                            href={whatsappUrl(
                              `¡Hola La Enriqueta! Quiero ordenar: ${d.name} de ${o.label} (${d.unit}) – $${o.price} MXN`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink hover:text-green flex min-h-11 items-center justify-between gap-3 border-b border-dashed border-[#e3cfc0] text-[15px]"
                          >
                            <span>{o.label}</span>
                            <span className="flex items-center gap-2.5">
                              <span className="font-display text-wine font-bold">
                                ${o.price}
                              </span>
                              <span className="text-green font-sans text-[11px] font-semibold">
                                Pedir →
                              </span>
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                    <a
                      href={whatsappUrl(
                        `¡Hola La Enriqueta! Quiero ordenar: ${d.name} (${d.unit}) – $${min} MXN`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-green text-green hover:bg-green hover:text-cream mt-1.5 flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] text-sm font-semibold"
                    >
                      <span className="size-[7px] rounded-full bg-current" />
                      Ordenar por WhatsApp
                    </a>
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
        <p className="text-muted mt-7 font-sans text-xs">
          Precios en MXN, IVA incluido. Sujetos a cambio sin previo aviso.
        </p>
      </div>
    </section>
  );
};
