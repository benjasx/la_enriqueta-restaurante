import { gallery } from "@/data/site";

export const Gallery = () => (
  <section id="galeria" className="bg-white py-16">
    <div className="mx-auto max-w-5xl px-4">
      <h2 className="font-display text-brand-pink text-4xl font-bold">
        Galería
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gallery.map((g) => (
          <li key={g.src}>
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
