export const MesaKaraoke = () => (
  <section
    id="karaoke"
    aria-label="Viernes de Karaoke"
    className="bg-[#5c0f33] px-5 py-16 text-[#fff3e8]"
  >
    <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-10">
      <img
        src="/img/karaoke.webp"
        alt="Viernes de Karaoke en La Enriqueta: ven a cantar, cena y disfruta. ¡Tú eliges la canción, tú eres la estrella!"
        loading="lazy"
        className="h-auto w-full min-w-0 rounded-3xl"
      />
      <div className="flex flex-col gap-[18px]">
        <div className="text-xs font-semibold tracking-[0.22em] text-[#f2b84b] uppercase">
          Todos los viernes
        </div>
        <h2 className="font-display m-0 text-[clamp(36px,5vw,56px)] leading-[1.05] font-normal">
          Viernes de karaoke
        </h2>
        <p className="m-0 max-w-[440px] text-lg leading-[1.55] text-[#f3d9cf]">
          Ven a cantar, cena y disfruta nuestros tragos y antojitos. ¡Tú eliges
          la canción, tú eres la estrella!
        </p>
        <div className="flex flex-wrap gap-2.5">
          <a
            href="#cocteleria"
            className="text-ink flex-none rounded-full bg-[#f2b84b] px-6 py-3.5 font-bold whitespace-nowrap"
          >
            Ver coctelería
          </a>
        </div>
      </div>
    </div>
  </section>
);
