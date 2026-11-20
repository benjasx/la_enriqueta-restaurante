import { useCart } from "@/cart/useCart";
import { menu, money } from "@/data/menu";

const burro = menu.find((d) => d.id === "burro-sarabia");

const extras = ["Pollo", "Bistec", "Queso", "Frijoles", "Aguacate"];

export const BurroBanner = ({ menuHref }: { menuHref: string }) => {
  const { dispatch } = useCart();
  if (!burro) return null;
  return (
    <section
      id="burro-sarabia"
      aria-label="Nuevo: Burro Sarabia"
      className="px-[clamp(16px,4vw,32px)] pt-6 pb-2"
    >
      <div className="from-orange via-wine to-wine text-cream relative mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-[clamp(24px,5vw,56px)] overflow-hidden rounded-[clamp(28px,4vw,44px)] bg-linear-to-br p-[clamp(22px,4.5vw,56px)] shadow-[0_24px_60px_-20px_rgba(176,25,94,0.55)]">
        <div className="relative mx-auto w-full max-w-[520px] md:order-2">
          <span className="bg-gold text-ink absolute -top-3 -left-3 z-10 rotate-[-6deg] rounded-full px-4 py-2 text-sm font-extrabold tracking-[0.14em] uppercase shadow-lg motion-safe:animate-pulse">
            ¡Nuevo!
          </span>
          <img
            src="/img/burro-sarabia_2.webp"
            alt="Burro Sarabia: tortilla de harina dorada con ensalada y salsa roja"
            className="aspect-square w-full rounded-[24px] object-cover shadow-[0_0_0_8px_#C99A2E]"
          />
          <span className="font-display text-ink absolute -right-2 -bottom-4 rounded-2xl bg-white px-5 py-2 text-[clamp(26px,4vw,36px)] shadow-lg">
            {money(burro.price ?? 0)}
          </span>
        </div>
        <div className="md:order-1">
          <div className="mb-3 font-sans text-xs font-semibold tracking-[0.2em] text-[#ffe3a8] uppercase">
            Nuevo en La Enriqueta
          </div>
          <h2 className="font-display m-0 mb-5 text-[clamp(34px,5vw,60px)] leading-[1.02] font-semibold tracking-[-0.02em] text-balance">
            ¡Ya llegó el Burro Sarabia a La Enriqueta!
          </h2>
          <p className="m-0 max-w-[520px] text-[clamp(17px,1.8vw,20px)] leading-[1.55] text-pretty text-[#fbe9dd]">
            Doradito por fuera y bien servido por dentro, con ensalada fresca,
            cebollita curtida y salsa roja. Vénganse a probarlo.
          </p>
          <ul className="m-0 mt-6 flex list-none flex-wrap gap-2 p-0">
            {extras.map((e) => (
              <li
                key={e}
                className="rounded-full bg-white/15 px-3.5 py-2 text-sm font-medium backdrop-blur-sm"
              >
                {e}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "add", line: { itemId: burro.id } })
              }
              className="bg-gold text-ink hover:bg-cream min-h-12 cursor-pointer rounded-full border-0 px-7 text-base font-bold transition-colors"
            >
              Pedir Burro Sarabia · {money(burro.price ?? 0)}
            </button>
            <a
              href={menuHref}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("menu:select-category", {
                    detail: burro.category,
                  }),
                )
              }
              className="inline-flex min-h-12 items-center rounded-full border border-white/50 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver en el menú
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
