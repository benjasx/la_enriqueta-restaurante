import { site } from "@/data/site";

export const About = () => (
  <section id="nosotros" className="mx-auto max-w-3xl px-4 py-16 text-center">
    <h2 className="font-display text-brand-pink text-4xl font-bold">
      Nosotros
    </h2>
    <p className="mt-4 text-lg leading-relaxed">{site.about}</p>
  </section>
);
