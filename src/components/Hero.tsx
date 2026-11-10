import { motion } from "motion/react";
import { Photo } from "@/components/Photo";
import { site, whatsappUrl } from "@/data/site";

const enter = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" as const, delay },
});

const palette = ["#B0195E", "#D9622B", "#2F6B3A", "#C99A2E", "#E04E8B"];
const flagShape =
  "polygon(0 0,100% 0,100% 74%,87.5% 100%,75% 74%,62.5% 100%,50% 74%,37.5% 100%,25% 74%,12.5% 100%,0 74%)";
const flagHole =
  "radial-gradient(circle at 50% 38%,transparent 5px,#000 5.5px)";

const PapelPicado = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden"
  >
    <div className="absolute inset-x-0 top-1.5 h-[1.5px] bg-[rgba(251,246,238,0.7)]" />
    <div className="flex gap-1.5 pt-[7px] pl-1.5">
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          className="h-[50px] flex-none basis-[46px] opacity-[0.94]"
          style={{
            background: palette[i % palette.length],
            clipPath: flagShape,
            WebkitMask: flagHole,
            mask: flagHole,
          }}
        />
      ))}
    </div>
  </div>
);

export const Hero = () => (
  <>
    <section
      id="inicio"
      className="relative flex min-h-[min(88vh,760px)] items-end overflow-hidden bg-[#3a1424]"
    >
      <div className="absolute inset-0">
        <Photo
          src="/img/local.jpg"
          hint="Foto: fachada del restaurante"
          alt="Fachada de La Enriqueta"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(42,10,24,0.15)_0%,rgba(42,10,24,0.55)_45%,rgba(42,10,24,0.9)_100%)]" />
      <PapelPicado />
      <div className="text-cream pointer-events-none relative mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,32px)] pt-[clamp(120px,18vh,180px)] pb-[clamp(48px,8vh,88px)]">
        <motion.div
          {...enter(0)}
          className="mb-[18px] inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] text-[#ffd7a8] uppercase"
        >
          <span className="bg-orange h-0.5 w-7" />
          {site.city} · Cocina casera
        </motion.div>
        <motion.h1
          {...enter(0.15)}
          className="font-display m-0 max-w-[900px] text-[clamp(46px,8vw,104px)] leading-[0.95] font-normal tracking-[-0.01em] text-balance"
        >
          {site.name}
          <span className="mt-2.5 block text-[0.48em] leading-[1.15] text-[#ffb98a]">
            — {site.tagline}
          </span>
        </motion.h1>
        <motion.p
          {...enter(0.3)}
          className="mt-[22px] max-w-[540px] text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-pretty text-[#f5e6da]"
        >
          Las recetas de Tuxpan, hechas a mano como en casa: masa recién
          preparada, pozole de olla y el sazón de siempre.
        </motion.p>
        <motion.div
          {...enter(0.45)}
          className="pointer-events-auto mt-8 flex flex-wrap gap-3"
        >
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href="#menu"
            className="bg-wine hover:bg-wine-light rounded-full px-7 py-4 text-base font-semibold text-white"
          >
            Ver Menú Digital
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cream text-ink hover:text-green flex items-center gap-2.5 rounded-full px-7 py-4 text-base font-semibold hover:bg-white"
          >
            <span className="size-[9px] rounded-full bg-[#2f9e48]" />
            Contactar por WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
    <div
      aria-hidden="true"
      className="h-3.5 bg-[linear-gradient(135deg,#B0195E_25%,transparent_25%)_-14px_0/28px_14px,linear-gradient(225deg,#B0195E_25%,transparent_25%)_-14px_0/28px_14px,#D9622B]"
    />
  </>
);
