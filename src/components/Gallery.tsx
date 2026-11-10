import { Photo } from "@/components/Photo";
import { gallery } from "@/data/site";

export const Gallery = () => (
  <section
    id="galeria"
    className="px-[clamp(20px,4vw,32px)] py-[clamp(64px,10vw,112px)]"
  >
    <div className="mx-auto max-w-[1200px]">
      <div className="text-orange mb-3 font-mono text-xs tracking-[0.2em] uppercase">
        Galería
      </div>
      <h2 className="font-display text-wine m-0 mb-9 text-[clamp(36px,5vw,58px)] leading-none font-normal">
        Pásale a ver
      </h2>
      <div className="grid grid-flow-dense auto-rows-[220px] grid-cols-[repeat(auto-fill,minmax(min(100%,240px),1fr))] gap-3.5">
        {gallery.map((g) => (
          <div
            key={g.id}
            className={`relative overflow-hidden rounded-[18px] ${g.className}`}
          >
            <Photo src={g.src} hint={g.hint} />
          </div>
        ))}
      </div>
    </div>
  </section>
);
