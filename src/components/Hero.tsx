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
      className="relative -mt-[84px] flex min-h-[min(92vh,820px)] items-end overflow-hidden bg-[#3a1424]"
    >
      <div className="absolute inset-0 [&_img]:object-[70%_50%] [&_img]:saturate-[1.2]">
        <Photo
          src="/img/tostada_v.jpeg"
          hint="Foto: tostada de La Enriqueta"
          alt="Tostada de La Enriqueta"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(42,10,24,0.82)_0%,rgba(42,10,24,0.4)_50%,rgba(42,10,24,0)_100%),linear-gradient(180deg,rgba(42,10,24,0.15)_0%,transparent_30%,transparent_60%,rgba(42,10,24,0.8)_100%)]" />
      <PapelPicado />
      <div className="text-cream pointer-events-none relative mx-auto w-full max-w-[1200px] px-[clamp(20px,4vw,32px)] pt-[clamp(140px,20vh,200px)] pb-[clamp(48px,8vh,88px)]">
        <motion.div
          {...enter(0)}
          className="bg-gold text-ink mb-5 inline-flex items-center gap-2.5 rounded-full px-4 py-2 font-sans text-xs font-bold tracking-[0.18em] uppercase shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]"
        >
          <span className="bg-wine size-2 rounded-full" />
          {site.city} · Sabor de Tuxpan
        </motion.div>
        <motion.h1
          {...enter(0.15)}
          className="font-display m-0 max-w-[900px] text-[clamp(48px,8.5vw,112px)] leading-[0.95] font-semibold tracking-[-0.02em] text-balance [text-shadow:0_4px_28px_rgba(0,0,0,0.45)]"
        >
          {site.name}
          <span className="mt-4 block text-[0.4em] leading-[1.1]">
            <span className="bg-orange inline-block -rotate-1 rounded-2xl px-5 py-2 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)]">
              Antojitos Tuxpeños
            </span>
          </span>
        </motion.h1>
        <motion.p
          {...enter(0.3)}
          className="mt-6 max-w-[540px] text-[clamp(17px,1.6vw,20px)] leading-[1.55] font-medium text-pretty text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]"
        >
          Gorditas, pozole de olla y tostadas con el sazón de Tuxpan. Masa hecha
          a mano, todos los días, como en casa.
        </motion.p>
        <motion.div
          {...enter(0.45)}
          className="pointer-events-auto mt-9 flex flex-wrap gap-3"
        >
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href="#menu"
            className="bg-wine hover:bg-wine-light rounded-full px-8 py-4 text-base font-semibold text-white"
          >
            Ver Menú Digital
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cream text-ink hover:text-green flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-semibold hover:bg-white"
          >
            <span className="size-[9px] rounded-full bg-[#2f9e48]" />
            Contactar por WhatsApp
          </motion.a>
        </motion.div>
        <motion.p
          {...enter(0.6)}
          className="mt-8 font-sans text-sm text-[#e8d3c4]"
        >
          {site.hours[0].days} · {site.hours[0].time}
        </motion.p>
      </div>
    </section>
    <div
      aria-hidden="true"
      className="h-3.5 bg-[linear-gradient(135deg,#B0195E_25%,transparent_25%)_-14px_0/28px_14px,linear-gradient(225deg,#B0195E_25%,transparent_25%)_-14px_0/28px_14px,#D9622B]"
    />
  </>
);
