import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

const days = ["Lun", "Mar", "Mié"];

export const MichePromoBanner = () => (
  <section
    id="promo-micheladas"
    aria-label="Micheladas 2x1"
    className="px-[clamp(16px,4vw,32px)] py-[clamp(40px,8vw,96px)]"
  >
    <div className="bg-wine text-cream mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(32px,6vw,72px)] overflow-hidden rounded-[clamp(28px,4vw,48px)] p-[clamp(24px,5vw,64px)]">
      <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[24px] shadow-[0_0_0_8px_#C99A2E] md:order-2">
        <Photo
          src="/img/promo_miche.webp"
          hint="Foto: michelada"
          alt="Promoción de La Enriqueta: micheladas 2x1 de lunes a miércoles"
        />
      </div>
      <div className="md:order-1">
        <Reveal>
          <div className="mb-3.5 font-sans text-xs font-semibold tracking-[0.2em] text-[#ffc79e] uppercase">
            Promoción de la semana
          </div>
          <h2 className="font-display m-0 mb-6 text-[clamp(34px,4.6vw,54px)] leading-[1.02] font-semibold tracking-[-0.02em] text-balance">
            Micheladas 2x1, de lunes a miércoles
          </h2>
        </Reveal>
        <p className="m-0 max-w-[560px] text-[clamp(17px,1.8vw,20px)] leading-[1.6] text-pretty text-[#f5e6da]">
          Escarchadas con chile, bien heladas y con ese toque de limón que pide
          la tarde. Pide una y llévate la segunda sin pagar de más: perfectas
          para compartir con antojitos tuxpeños.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {days.map((d) => (
            <span
              key={d}
              className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur-sm"
            >
              {d}
            </span>
          ))}
        </div>
        <a
          href="#menu"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("menu:select-category", {
                detail: "cocteleria",
              }),
            )
          }
          className="bg-gold text-ink hover:bg-orange mt-8 inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-base font-semibold transition-colors"
        >
          Ver tragos en el menú
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>
);
