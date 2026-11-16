import { lineKey, MAX_QTY, type Size } from "@/cart/cartReducer";
import { useCart } from "@/cart/useCart";
import {
  categories,
  menu,
  menuDisclaimer,
  menuNotice,
  money,
  priceLabel,
  type MenuItem,
} from "@/data/menu";

const count = (id: string) => menu.filter((d) => d.category === id).length;

const platillos = (n: number) => `${n} ${n === 1 ? "platillo" : "platillos"}`;

const addButton =
  "min-w-[88px] cursor-pointer rounded-full border-0 px-3 py-2 text-[13px] font-semibold whitespace-nowrap disabled:cursor-not-allowed";

const Dish = ({ d }: { d: MenuItem }) => {
  const { state, dispatch } = useCart();
  const rows = d.options ?? [{ label: "", price: d.price ?? 0 }];
  const dual = rows.some((r) => r.bottlePrice !== undefined);
  const add = (optionLabel?: string, size?: Size) =>
    dispatch({ type: "add", line: { itemId: d.id, optionLabel, size } });

  return (
    <article
      className={`shadow-card flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white ${
        d.wide ? "col-span-full" : ""
      }`}
    >
      {d.image && (
        <img
          src={d.image}
          alt={d.name}
          loading="lazy"
          className="h-[210px] w-full object-cover"
        />
      )}
      <div className="flex flex-col gap-2.5 px-[22px] pt-[22px] pb-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display m-0 text-[23px] leading-[1.15] font-normal">
            {d.name}
          </h3>
          <div className="flex shrink-0 flex-col items-end">
            <span className="font-display text-wine text-[22px] whitespace-nowrap">
              {priceLabel(d)}
            </span>
            {d.unit && (
              <span className="text-muted text-[11px] tracking-[0.14em] uppercase">
                {d.unit}
              </span>
            )}
          </div>
        </div>
        <p className="text-body m-0 text-[15px] leading-[1.55] text-pretty">
          {d.description}
        </p>
        {d.note && (
          <p className="text-muted m-0 text-[13px] leading-[1.5] italic">
            {d.note}
          </p>
        )}
        <div
          className={`mt-1 grid gap-x-8 ${
            d.wide && rows.length > 3
              ? "grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]"
              : "grid-cols-1"
          }`}
        >
          {rows.map((r) => {
            const label = r.label ? `${d.name} ${r.label}` : d.name;
            const prices: { tag: string; price: number; size?: Size }[] = dual
              ? [
                  { tag: "Copeo", price: r.price, size: "copeo" },
                  ...(r.bottlePrice !== undefined
                    ? [
                        {
                          tag: "Botella",
                          price: r.bottlePrice,
                          size: "botella" as const,
                        },
                      ]
                    : []),
                ]
              : [{ tag: "", price: r.price }];
            return (
              <div
                key={r.label}
                className="border-line flex min-w-0 items-center gap-2.5 border-t border-dashed py-[11px]"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {r.label && <span className="text-[15px]">{r.label}</span>}
                  {r.description && (
                    <span className="text-muted text-[12.5px] leading-[1.4]">
                      {r.description}
                    </span>
                  )}
                </div>
                <div className="flex flex-none flex-col items-end gap-1.5">
                  {prices.map((p) => {
                    const qty =
                      state.lines.find(
                        (l) =>
                          l.key ===
                          lineKey({
                            itemId: d.id,
                            optionLabel: r.label || undefined,
                            size: p.size,
                          }),
                      )?.qty ?? 0;
                    const name = `Agregar ${label}${p.tag ? ` ${p.tag}` : ""}`;
                    return (
                      <div key={p.tag} className="flex items-center gap-2.5">
                        {p.tag && (
                          <span className="text-muted text-[11px] tracking-[0.1em] uppercase">
                            {p.tag}
                          </span>
                        )}
                        <span className="font-display text-wine text-base whitespace-nowrap">
                          {money(p.price)}
                        </span>
                        <button
                          type="button"
                          aria-label={qty ? `${name} (${qty} en pedido)` : name}
                          disabled={qty >= MAX_QTY}
                          onClick={() => add(r.label || undefined, p.size)}
                          className={`${addButton} ${
                            qty
                              ? "bg-green text-white"
                              : "text-green bg-[#edf4ec]"
                          }`}
                        >
                          {qty ? `${qty} en pedido` : "Agregar +"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export const MesaMenu = () => (
  <div id="menu">
    <div className="sticky top-[78px] z-40 bg-[linear-gradient(var(--color-cream)_80%,transparent)] px-4 pt-3.5 pb-3">
      <div
        role="group"
        aria-label="Categorías del menú"
        className="bg-sand mx-auto flex max-w-[1180px] [scrollbar-width:none] gap-1 overflow-x-auto rounded-full p-[5px] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="text-body hover:text-wine flex-none rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap hover:bg-white"
          >
            {c.label}{" "}
            <span className="text-muted font-medium">{count(c.id)}</span>
          </a>
        ))}
      </div>
    </div>
    <div className="mx-auto flex max-w-[1180px] flex-col gap-16 px-5 pt-4 pb-10">
      {categories.map((c) => (
        <section key={c.id} id={c.id} className="flex flex-col gap-6">
          <div className="border-line flex items-baseline justify-between gap-4 border-b pb-3.5">
            <h2 className="font-display m-0 text-[clamp(28px,4vw,40px)] font-normal text-balance">
              {c.label}
            </h2>
            <span className="text-muted text-[13px] tracking-[0.14em] whitespace-nowrap uppercase">
              {platillos(count(c.id))}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] items-start gap-5">
            {menu
              .filter((d) => d.category === c.id)
              .map((d) => (
                <Dish key={d.id} d={d} />
              ))}
          </div>
        </section>
      ))}
      <div className="flex max-w-[760px] flex-col gap-2">
        <p className="text-body m-0 text-[15px] leading-[1.6]">{menuNotice}</p>
        <p className="text-muted m-0 text-[13px]">{menuDisclaimer}</p>
      </div>
    </div>
  </div>
);
