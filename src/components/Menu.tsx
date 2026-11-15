import { motion } from "motion/react";
import { useState } from "react";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import {
  categories,
  menu,
  menuDisclaimer,
  menuNotice,
  money,
  priceLabel,
  type CategoryId,
  type PriceOption,
} from "@/data/menu";
import { whatsappUrl } from "@/data/site";

const mono =
  "font-sans text-[10px] font-medium text-muted tracking-[0.08em] uppercase";

export const Menu = () => {
  const [cat, setCat] = useState<CategoryId>("especialidades");
  const visible = menu.filter((d) => d.category === cat);
  const count = (id: CategoryId) =>
    menu.filter((d) => d.category === id).length;

  return (
    <section
      id="menu"
      className="px-[clamp(20px,4vw,32px)] py-[clamp(64px,10vw,112px)]"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-9 flex flex-col gap-7">
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
            className="bg-sand flex w-fit max-w-full scrollbar-none gap-1 overflow-x-auto rounded-full p-1.5 [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={cat === c.id}
                onClick={(e) => {
                  setCat(c.id);
                  e.currentTarget.scrollIntoView?.({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className={`shrink-0 cursor-pointer rounded-full border-0 px-5 py-[11px] text-sm font-semibold whitespace-nowrap transition-colors ${
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
            const label = priceLabel(d);
            const unit = d.unit ? ` (${d.unit})` : "";
            const grouped = Boolean(d.wide);
            const rows = d.options;
            const dual = rows?.some((r) => r.bottlePrice !== undefined);
            const sizeMessage = (r: PriceOption, size: string, price: number) =>
              `¡Hola La Enriqueta! Quiero ordenar: ${d.name} – ${r.label} (${size}) – ${money(price)} MXN`;
            const rowMessage = (r: PriceOption) =>
              `¡Hola La Enriqueta! Quiero ordenar: ${d.name} – ${r.label}${unit} – ${money(r.price)} MXN`;
            return (
              <Reveal
                key={d.id}
                delay={(i % 3) * 0.08}
                className={grouped ? "col-span-full" : undefined}
              >
                <motion.article
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="rounded-card shadow-card flex h-full flex-col overflow-hidden bg-white transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(120,20,60,0.4)]"
                >
                  {!grouped && (
                    <div className="relative aspect-[4/3]">
                      <Photo
                        src={d.image}
                        hint={`Foto: ${d.name.toLowerCase()}`}
                        alt={d.name}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 px-6 pt-5 pb-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="font-display text-ink m-0 text-[23px] leading-[1.15] font-semibold">
                        {d.name}
                      </h3>
                      <div className="ml-auto shrink-0 text-right whitespace-nowrap">
                        <div className="font-display text-wine text-2xl leading-none font-bold">
                          {label}
                        </div>
                        {d.unit && <div className={mono}>{d.unit}</div>}
                      </div>
                    </div>
                    <p className="text-body m-0 text-[14.5px] leading-[1.55] text-pretty">
                      {d.description}
                    </p>
                    {d.note && (
                      <p className="text-muted m-0 text-[13px] leading-[1.5] text-pretty italic">
                        {d.note}
                      </p>
                    )}
                    {rows && (
                      <ul
                        className={`m-0 grid list-none border-t border-dashed border-[#e3cfc0] p-0 ${
                          grouped
                            ? "sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3"
                            : ""
                        }`}
                      >
                        {rows.map((r) =>
                          dual ? (
                            <li
                              key={r.label}
                              className="text-ink flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-dashed border-[#e3cfc0] py-2.5 text-[15px]"
                            >
                              <span className="min-w-0">{r.label}</span>
                              <span className="flex gap-2">
                                {(
                                  [
                                    ["Copeo", r.price],
                                    ["Botella", r.bottlePrice],
                                  ] as const
                                ).map(
                                  ([size, price]) =>
                                    price !== undefined && (
                                      <a
                                        key={size}
                                        href={whatsappUrl(
                                          sizeMessage(r, size, price),
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="border-green text-green hover:bg-green hover:text-cream flex min-h-9 items-center gap-1.5 rounded-full border-[1.5px] px-3 text-[12.5px] font-semibold whitespace-nowrap"
                                      >
                                        {size}
                                        <span className="font-display font-bold tabular-nums">
                                          {money(price)}
                                        </span>
                                      </a>
                                    ),
                                )}
                              </span>
                            </li>
                          ) : (
                            <li key={r.label}>
                              <a
                                href={whatsappUrl(rowMessage(r))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-ink hover:text-green flex min-h-11 items-center justify-between gap-3 border-b border-dashed border-[#e3cfc0] text-[15px]"
                              >
                                <span className="min-w-0 py-1.5">
                                  <span className="block">{r.label}</span>
                                  {r.description && (
                                    <span className="text-muted block text-[12.5px] leading-snug">
                                      {r.description}
                                    </span>
                                  )}
                                </span>
                                <span className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
                                  <span className="font-display text-wine min-w-9 text-right font-bold tabular-nums">
                                    {money(r.price)}
                                  </span>
                                  <span className="text-green w-12 text-right font-sans text-[11px] font-semibold">
                                    Pedir →
                                  </span>
                                </span>
                              </a>
                            </li>
                          ),
                        )}
                      </ul>
                    )}
                    <div className="flex-1" />
                    {!rows && (
                      <a
                        href={whatsappUrl(
                          `¡Hola La Enriqueta! Quiero ordenar: ${d.name}${unit} – ${label} MXN`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-green text-green hover:bg-green hover:text-cream mt-1.5 flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] text-sm font-semibold"
                      >
                        <span className="size-[7px] rounded-full bg-current" />
                        Ordenar por WhatsApp
                      </a>
                    )}
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
        <p className="text-body mt-8 mb-0 max-w-[640px] text-sm leading-[1.55] text-pretty">
          {menuNotice}
        </p>
        <p className="text-muted mt-3 font-sans text-xs">{menuDisclaimer}</p>
      </div>
    </section>
  );
};
