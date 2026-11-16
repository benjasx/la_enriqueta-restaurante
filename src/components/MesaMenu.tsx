import { useCallback, useEffect, useRef, useState } from "react";
import { MenuSearch, NoResults } from "@/components/MenuSearch";
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
import { matchesQuery } from "@/data/menuSearch";

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

const CategoryTabs = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(categories[0].id);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = barRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setEdges((p) =>
      p.left === left && p.right === right ? p : { left, right },
    );
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    const tab = bar?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!bar || !tab) return;
    bar.scrollTo?.({
      left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  const nudge = (dir: 1 | -1) =>
    barRef.current?.scrollBy?.({
      left: dir * barRef.current.clientWidth * 0.6,
      behavior: "smooth",
    });

  return (
    <div className="relative mx-auto max-w-[1180px]">
      {(["left", "right"] as const).map((side) => {
        const show = side === "left" ? edges.left : edges.right;
        return (
          <button
            key={side}
            type="button"
            tabIndex={-1}
            aria-label={
              side === "left"
                ? "Ver categorías anteriores"
                : "Ver más categorías"
            }
            onClick={() => nudge(side === "left" ? -1 : 1)}
            className={`from-sand absolute inset-y-0 z-10 flex w-16 cursor-pointer items-center border-0 to-transparent transition-opacity ${
              side === "left"
                ? "left-0 justify-start rounded-l-full bg-linear-to-r pl-2"
                : "right-0 justify-end rounded-r-full bg-linear-to-l pr-2"
            } ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <span
              className={`bg-wine shadow-card flex size-8 items-center justify-center rounded-full text-lg leading-none text-white ${
                side === "right" ? "animate-pulse" : ""
              }`}
            >
              {side === "left" ? "‹" : "›"}
            </span>
          </button>
        );
      })}
      <div
        ref={barRef}
        role="group"
        aria-label="Categorías del menú"
        onScroll={updateEdges}
        className="bg-sand flex [scrollbar-width:none] gap-1 overflow-x-auto overscroll-x-contain rounded-full p-[5px] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((c) => {
          const on = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              aria-current={on ? "true" : undefined}
              onClick={() => setActive(c.id)}
              className={`flex-none rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                on
                  ? "bg-wine shadow-card text-white"
                  : "text-body hover:text-wine hover:bg-white"
              }`}
            >
              {c.label}{" "}
              <span
                className={
                  on ? "font-medium opacity-70" : "text-muted font-medium"
                }
              >
                {count(c.id)}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export const MesaMenu = () => {
  const [query, setQuery] = useState("");
  const searching = query.trim() !== "";
  const shown = menu.filter((d) => matchesQuery(d, query));
  const sections = categories.filter((c) =>
    shown.some((d) => d.category === c.id),
  );
  return (
    <div id="menu">
      <div className="sticky top-[78px] z-40 bg-[linear-gradient(var(--color-cream)_80%,transparent)] px-4 pt-3.5 pb-3">
        <div className="flex flex-col gap-2.5">
          <MenuSearch value={query} onChange={setQuery} />
          {!searching && <CategoryTabs />}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-16 px-5 pt-4 pb-10">
        {searching && shown.length === 0 && <NoResults query={query} />}
        {sections.map((c) => (
          <section key={c.id} id={c.id} className="flex flex-col gap-6">
            <div className="border-line flex items-baseline justify-between gap-4 border-b pb-3.5">
              <h2 className="font-display m-0 text-[clamp(28px,4vw,40px)] font-normal text-balance">
                {c.label}
              </h2>
              <span className="text-muted text-[13px] tracking-[0.14em] whitespace-nowrap uppercase">
                {platillos(shown.filter((d) => d.category === c.id).length)}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] items-start gap-5">
              {shown
                .filter((d) => d.category === c.id)
                .map((d) => (
                  <Dish key={d.id} d={d} />
                ))}
            </div>
          </section>
        ))}
        <div className="flex max-w-[760px] flex-col gap-2">
          <p className="text-body m-0 text-[15px] leading-[1.6]">
            {menuNotice}
          </p>
          <p className="text-muted m-0 text-[13px]">{menuDisclaimer}</p>
        </div>
      </div>
    </div>
  );
};
