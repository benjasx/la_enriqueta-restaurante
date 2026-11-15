import { Reveal } from "@/components/Reveal";

const src = "/img/karaoke.webp";
const stripe =
  "absolute inset-x-0 h-1 bg-[linear-gradient(90deg,#b3195a,#f08a24,#e8b43a,#4a8a3c,#b3195a)]";

export const KaraokeBanner = () => (
  <section aria-label="Viernes de Karaoke" className="w-full">
    <Reveal className="w-full">
      <div className="group relative isolate flex h-[clamp(240px,38vw,520px)] w-full items-center justify-center overflow-hidden bg-[#1c0a14]">
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full scale-125 object-cover opacity-70 blur-2xl saturate-150"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(28,10,20,0.75)_100%)]"
        />
        <img
          src={src}
          alt="Viernes de Karaoke en La Enriqueta: ven a cantar, cena y disfruta. ¡Tú eliges la canción, tú eres la estrella!"
          className="h-full max-w-full object-contain drop-shadow-[0_0_40px_rgba(255,120,60,0.35)] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        <div aria-hidden="true" className={`${stripe} top-0`} />
        <div aria-hidden="true" className={`${stripe} bottom-0`} />
      </div>
    </Reveal>
  </section>
);
