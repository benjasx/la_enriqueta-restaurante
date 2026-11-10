import { Photo } from "@/components/Photo";

const badges = ["Masa hecha a mano", "Recetas familiares", "Cocina nayarita"];

export const About = () => (
  <section
    id="nosotros"
    className="bg-wine text-cream relative overflow-hidden px-[clamp(20px,4vw,32px)] py-[clamp(64px,10vw,112px)]"
  >
    <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(32px,6vw,72px)]">
      <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-[200px_200px_24px_24px] shadow-[0_0_0_8px_#D9622B]">
        <Photo
          src="/img/carta.jpg"
          hint="Foto: la cocina o la familia"
          alt="Carta de La Enriqueta"
        />
      </div>
      <div>
        <div className="mb-3.5 font-mono text-xs tracking-[0.2em] text-[#ffc79e] uppercase">
          Nosotros
        </div>
        <h2 className="font-display m-0 mb-6 text-[clamp(34px,4.6vw,54px)] leading-[1.05] font-normal text-balance">
          Sazón de Tuxpan, servido en Tepic
        </h2>
        <p className="font-display m-0 max-w-[560px] text-[clamp(20px,2vw,24px)] leading-[1.45] text-pretty text-white">
          Desde el corazón del sazón y el reino del sabor, ofreceremos en Tepic
          antojitos tuxpeños, como solo en el bello Tuxpan los puedes encontrar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded-full border-[1.5px] border-[rgba(251,246,238,0.5)] px-4 py-[9px] text-sm font-medium"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
