// TODO: replace every placeholder below with real data from the client.
export const site = {
  name: "La Enriqueta",
  tagline: "Antojitos Tuxpeños",
  description:
    "Restaurante La Enriqueta en Tepic, Nayarit. Antojitos tuxpeños, menú digital, ubicación y pedidos por WhatsApp.",
  city: "Tepic, Nayarit",
  address: "Dirección por definir, Tepic, Nayarit", // TODO
  phone: "0000000000", // TODO: 10 digits
  whatsapp: "520000000000", // TODO: country code + number, digits only
  mapsEmbedUrl: "", // TODO: Google Maps embed URL
  schedule: [{ days: "Lunes a domingo", hours: "Horario por definir" }], // TODO
  about:
    "Texto de historia por definir con el cliente. Aquí va una breve presentación de La Enriqueta y de sus antojitos tuxpeños.", // TODO
};

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  image?: string;
};

export type MenuCategory = { id: string; title: string; items: MenuItem[] };

// TODO: placeholder dishes and prices, replace with the client's real menu (max 25 items).
export const menu: MenuCategory[] = [
  {
    id: "platos-fuertes",
    title: "Platos fuertes",
    items: [
      {
        name: "Chilaquiles con carne",
        description: "Totopos, salsa, queso, frijoles y carne.",
        price: 0,
        image: "/img/platillo.jpg",
      },
      {
        name: "Platillo ejemplo",
        description: "Descripción breve del platillo.",
        price: 0,
      },
    ],
  },
  {
    id: "antojitos",
    title: "Antojitos",
    items: [
      {
        name: "Antojito ejemplo",
        description: "Descripción breve del platillo.",
        price: 0,
      },
    ],
  },
  {
    id: "bebidas",
    title: "Bebidas",
    items: [
      {
        name: "Bebida ejemplo",
        description: "Descripción breve de la bebida.",
        price: 0,
      },
    ],
  },
  {
    id: "postres",
    title: "Postres",
    items: [
      {
        name: "Postre ejemplo",
        description: "Descripción breve del postre.",
        price: 0,
      },
    ],
  },
];

export const gallery = [
  { src: "/img/local.jpg", alt: "Fachada del restaurante La Enriqueta" },
  { src: "/img/platillo.jpg", alt: "Platillo de La Enriqueta" },
  { src: "/img/carta.jpg", alt: "Carta de La Enriqueta" },
];

export const whatsappUrl = (message = "Hola, quiero hacer un pedido.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
