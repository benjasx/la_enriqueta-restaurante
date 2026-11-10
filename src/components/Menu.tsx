import { menu } from "@/data/site";

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

export const Menu = () => (
  <section id="menu" className="mx-auto max-w-5xl px-4 py-16">
    <h2 className="font-display text-brand-pink text-4xl font-bold">Menú</h2>
    <nav
      aria-label="Categorías del menú"
      className="bg-brand-cream sticky top-14 z-[5] -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 py-2"
    >
      {menu.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className="border-brand-orange hover:bg-brand-orange shrink-0 rounded-full border px-4 py-1 text-sm font-semibold hover:text-white"
        >
          {c.title}
        </a>
      ))}
    </nav>
    {menu.map((c) => (
      <div key={c.id} id={c.id} className="mt-8 scroll-mt-28">
        <h3 className="font-display text-2xl font-semibold">{c.title}</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {c.items.map((item) => (
            <li
              key={item.name}
              className="flex gap-4 rounded-xl bg-white p-3 shadow-sm"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="size-24 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between gap-2">
                  <h4 className="font-bold">{item.name}</h4>
                  <span className="text-brand-green font-bold">
                    {money.format(item.price)}
                  </span>
                </div>
                <p className="mt-1 text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);
