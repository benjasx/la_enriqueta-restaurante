export const site = {
  name: "La Enriqueta",
  tagline: "Antojitos Tuxpeños",
  city: "Tepic, Nayarit",
  addressLines: ["C. Brasil 261, Col. Moctezuma", "Tepic, Nayarit"],
  phone: "523115130988",
  phoneLabel: "311 513 0988",
  whatsapp: "523115130988",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=C.%20Brasil%20261%2C%20Moctezuma%2C%20Tepic%2C%20Nayarit&z=16&output=embed",
  hours: [
    { days: "Martes a Domingo", time: "8:00 – 17:00", open: true },
    { days: "Lunes", time: "Cerrado", open: false },
  ],
};

export const whatsappUrl = (
  message = "¡Hola La Enriqueta! Me gustaría hacer un pedido.",
) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export type CategoryId = "entradas" | "tradicionales";

export type Dish = {
  category: CategoryId;
  name: string;
  unit: string;
  description: string;
  image?: string;
  price?: number;
  options?: { label: string; price: number }[];
};

export const categories: { id: "todos" | CategoryId; label: string }[] = [
  { id: "todos", label: "Todo" },
  { id: "entradas", label: "Entradas" },
  { id: "tradicionales", label: "Antojitos Tradicionales" },
];

export const categoryTag: Record<CategoryId, { label: string; bg: string }> = {
  entradas: { label: "Entrada", bg: "bg-orange" },
  tradicionales: { label: "Tradicional", bg: "bg-wine" },
};

export const dishes: Dish[] = [
  {
    category: "entradas",
    name: "Gorditas Estilo Tuxpan",
    unit: "5 piezas",
    description: "Disfruta nuestras gorditas en su versión suave o dorada.",
    image: "/img/platillo.jpg",
    options: [
      { label: "Papa", price: 90 },
      { label: "Pollo", price: 90 },
      { label: "Pierna", price: 95 },
    ],
  },
  {
    category: "entradas",
    name: "Burritos",
    unit: "1 pieza",
    description:
      "Deliciosas tortillas de harina, rellenas de pollo o pierna acompañadas de verdura y salsa.",
    options: [
      { label: "Pollo", price: 40 },
      { label: "Pierna", price: 45 },
    ],
  },
  {
    category: "entradas",
    name: "Quesadillas",
    unit: "1 pieza",
    description: "Clásica quesadilla de harina, acompáñala a tu gusto.",
    price: 50,
  },
  {
    category: "entradas",
    name: "Rollitos Enriqueto",
    unit: "orden",
    description:
      "Taquitos dorados enrollados con crema, queso y salsa de la casa.",
    price: 70,
  },
  {
    category: "entradas",
    name: "Guacamole",
    unit: "orden",
    description: "Aguacate machacado con jitomate, cebolla, chile y totopos.",
    price: 80,
  },
  {
    category: "tradicionales",
    name: "Pozole",
    unit: "plato",
    description:
      "Pozole rojo de cerdo con lechuga, rábano, orégano, limón y tostadas.",
    price: 110,
  },
  {
    category: "tradicionales",
    name: "Tostadas de Huesito",
    unit: "pieza",
    description:
      "Carne de espinazo deshebrada sobre frijol, con repollo y salsa.",
    price: 35,
  },
  {
    category: "tradicionales",
    name: "Tostadas de Pata",
    unit: "pieza",
    description: "Pata de cerdo en vinagre con frijol, lechuga, crema y queso.",
    price: 35,
  },
  {
    category: "tradicionales",
    name: "Chanfaina",
    unit: "plato",
    description:
      "Guiso tradicional en salsa de chile, servido con frijoles y totopos.",
    price: 95,
  },
];

export const minPrice = (d: Dish) =>
  d.options ? Math.min(...d.options.map((o) => o.price)) : (d.price ?? 0);

export const gallery: {
  id: string;
  hint: string;
  src?: string;
  className: string;
}[] = [
  {
    id: "gal-1",
    hint: "Platillo",
    src: "/img/platillo.jpg",
    className: "row-span-2",
  },
  { id: "gal-2", hint: "Cocina: masa a mano", className: "" },
  { id: "gal-3", hint: "Platillo: gorditas", className: "" },
  {
    id: "gal-4",
    hint: "Fachada",
    src: "/img/local.jpg",
    className: "min-[560px]:col-span-2",
  },
  {
    id: "gal-5",
    hint: "Carta",
    src: "/img/carta.jpg",
    className: "row-span-2",
  },
  { id: "gal-6", hint: "Instalaciones: comedor", className: "" },
  { id: "gal-7", hint: "Cocina: ollas y comal", className: "" },
];
