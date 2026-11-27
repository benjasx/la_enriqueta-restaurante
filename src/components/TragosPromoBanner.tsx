import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

const days = ["Jue", "Vie"];

export const TragosPromoBanner = () => (
  <section
    id="promo-tragos"
    aria-label="Tragos 2x1"
    className="px-[clamp(16px,4vw,32px)] py-[clamp(40px,8vw,96px)]"
  >
    <div className="bg-wine text-cream mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(32px,6vw,72px)] overflow-hidden rounded-[clamp(28px,4vw,48px)] p-[clamp(24px,5vw,64px)]">
      <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-[24px] shadow-[0_0_0_8px_#C99A2E] md:order-1">
        <Photo
          src="/img/tragos.webp"
          hint="Foto: tragos"
          alt="Promoción de La Enriqueta: tragos 2x1 jueves y viernes"
        />
      </div>
      <div className="md:order-2">
        <Reveal>
          <div className="mb-3.5 font-sans text-xs font-semibold tracking-[0.2em] text-[#ffc79e] uppercase">
            Promoción de la semana
          </div>
          <h2 className="font-display m-0 mb-6 text-[clamp(34px,4.6vw,54px)] leading-[1.02] font-semibold tracking-[-0.02em] text-balance">
            Tragos 2x1, jueves y viernes
          </h2>
        </Reveal>
        <p className="m-0 max-w-[560px] text-[clamp(17px,1.8vw,20px)] leading-[1.6] text-pretty text-[#f5e6da]">
          Pide un trago y llévate el segundo sin pagar de más: perfectos para
          brindar con antojitos tuxpeños.
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
      </div>
    </div>
  </section>
);
