import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

const badges = ["Masa hecha a mano", "Recetas familiares", "Cocina nayarita"];

export const About = () => (
  <section
    id="nosotros"
    className="px-[clamp(16px,4vw,32px)] py-[clamp(40px,8vw,96px)]"
  >
    <div className="bg-wine text-cream mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(32px,6vw,72px)] rounded-[clamp(28px,4vw,48px)] p-[clamp(24px,5vw,64px)]">
      <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-[200px_200px_24px_24px] shadow-[0_0_0_8px_#C99A2E]">
        <Photo
          src="/img/carta.webp"
          hint="Foto: la cocina o la familia"
          alt="Carta de La Enriqueta"
        />
      </div>
      <div>
        <Reveal>
          <div className="mb-3.5 font-sans text-xs font-semibold tracking-[0.2em] text-[#ffc79e] uppercase">
            Nosotros
          </div>
          <h2 className="font-display m-0 mb-6 text-[clamp(34px,4.6vw,54px)] leading-[1.02] font-semibold tracking-[-0.02em] text-balance">
            Antojitos Tuxpeños
          </h2>
        </Reveal>
        <p className="m-0 max-w-[560px] text-[clamp(17px,1.8vw,20px)] leading-[1.6] text-pretty text-[#f5e6da]">
          Cocinamos las recetas que crecimos comiendo en Tuxpan: masa hecha a
          mano, guisos de olla y salsas del día. Aquí en Tepic, con el mismo
          sazón de siempre.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium backdrop-blur-sm"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
