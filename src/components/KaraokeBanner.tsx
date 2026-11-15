import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";

export const KaraokeBanner = () => (
  <section
    aria-label="Viernes de Karaoke"
    className="px-[clamp(16px,4vw,32px)] pt-[clamp(40px,8vw,96px)]"
  >
    <Reveal className="mx-auto max-w-[1200px]">
      <div className="rounded-card shadow-card h-80 overflow-hidden bg-[#3a1424] sm:aspect-[1584/672] sm:h-auto">
        <Photo
          src="/img/karaoke.jpg"
          hint="Banner: Viernes de Karaoke"
          alt="Viernes de Karaoke en La Enriqueta: ven a cantar, cena y disfruta. ¡Tú eliges la canción, tú eres la estrella!"
        />
      </div>
    </Reveal>
  </section>
);
