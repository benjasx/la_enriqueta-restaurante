export type CategoryId =
  | "especialidades"
  | "tradicionales"
  | "entradas"
  | "extras"
  | "postres"
  | "bebidas"
  | "cocteleria"
  | "licores";

export type PriceOption = {
  label: string;
  price: number;
  description?: string;
  bottlePrice?: number;
};

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  unit?: string;
  image?: string;
  price?: number;
  options?: PriceOption[];
  note?: string;
  wide?: boolean;
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "especialidades", label: "Especialidades de la Casa" },
  { id: "tradicionales", label: "Antojitos Tradicionales" },
  { id: "entradas", label: "Entradas" },
  { id: "extras", label: "Para Acompañar y Extras" },
  { id: "postres", label: "Postres" },
  { id: "bebidas", label: "Bebidas" },
  { id: "cocteleria", label: "Coctelería y Cervezas" },
  { id: "licores", label: "Licores y Vinos" },
];

export const menuNotice =
  "Todos nuestros platillos son preparados tal cual se menciona en la descripción; puedes ajustarlo a tu gusto. Si eres alérgico o intolerante a algún producto, no olvides mencionarlo a tu mesero.";

export const menuDisclaimer =
  "Precios en MXN, IVA incluido. Sujetos a cambio sin previo aviso.";

export const money = (n: number) => `$${n.toLocaleString("es-MX")}`;

export const priceLabel = (item: MenuItem) => {
  if (item.options) {
    const prices = item.options.map((o) => o.price);
    const min = Math.min(...prices);
    return min === Math.max(...prices) ? money(min) : `desde ${money(min)}`;
  }
  return money(item.price ?? 0);
};

// Todo el contenido del menú vive aquí: nombre, descripción, porción, precios,
// notas e imagen (`image: "/img/archivo.jpg"`, opcional). Edita este arreglo y
// el sitio se actualiza solo. Fuente de referencia: specs/menu-la-enriqueta.md
export const menu: MenuItem[] = [
  {
    id: "especial-la-enriqueta",
    category: "especialidades",
    name: "El Especial La Enriqueta",
    description:
      "¡Para los que quieren probarlo todo! 1 tostada, 1 taco dorado, 1 pieza de pollo dorada, 2 gorditas doradas o blanditas y una porción de papa dorada.",
    price: 180,
  },
  {
    id: "torta-ahogada",
    category: "especialidades",
    image: "/img/torta.jpeg",
    name: "Torta Ahogada Estilo Tuxpan",
    description: "Torta ahogada bañada en salsa de jitomate.",
    unit: "1 pieza",
    options: [
      { label: "Pollo", price: 80 },
      { label: "Pierna", price: 85 },
    ],
  },
  {
    id: "pollo-la-enriqueta",
    category: "especialidades",
    image: "/img/pollo_frito.jpeg",
    name: "Pollo a La Enriqueta",
    description:
      "4 piezas de pollo dorado, acompañado con ensalada, papa dorada y arroz a la mexicana.",
    price: 160,
  },
  {
    id: "pozole",
    category: "tradicionales",
    image: "/img/pozole.jpeg",
    name: "Pozole",
    description:
      "Caldito con maíz cacahuazintle, carnita de cerdo y pollo. Acompañado de lechuga o repollo, rábanos, pepino, cebolla, orégano y tostadas doradas.",
    note: "Opciones: pollo, pierna, pata, cabeza, lengua y/o surtido.",
    options: [
      { label: "Mediano", price: 130 },
      { label: "Grande", price: 160 },
    ],
  },
  {
    id: "tostadas",
    category: "tradicionales",
    image: "/img/tostada.jpeg",
    name: "Tostadas",
    description: "Crujientes, con tu ingrediente favorito.",
    unit: "1 pieza",
    options: [
      { label: "Huesito de pollo", price: 55 },
      { label: "Gallina", price: 55 },
      { label: "Chanfaina", price: 60 },
      { label: "Pollo", price: 70 },
      { label: "Pierna", price: 75 },
      { label: "Pata", price: 80 },
    ],
  },
  {
    id: "gorditas",
    category: "entradas",
    name: "Gorditas Estilo Tuxpan",
    description: "Disfruta nuestras gorditas en su versión suave o dorada.",
    unit: "5 piezas",
    options: [
      { label: "Papa", price: 70 },
      { label: "Pollo", price: 80 },
      { label: "Pierna", price: 85 },
    ],
  },
  {
    id: "burritos",
    category: "entradas",
    name: "Burritos",
    description:
      "Tortillas de harina rellenas de pollo o pierna, acompañadas de verdura y salsa.",
    unit: "1 pieza",
    options: [
      { label: "Pollo", price: 40 },
      { label: "Pierna", price: 45 },
    ],
  },
  {
    id: "quesadillas",
    category: "entradas",
    name: "Quesadillas",
    description: "Clásica quesadilla de harina, acompáñala a tu gusto.",
    unit: "1 pieza",
    options: [
      { label: "Panela", price: 40 },
      { label: "Queso", price: 40 },
      { label: "Pollo", price: 45 },
      { label: "Pierna", price: 50 },
    ],
  },
  {
    id: "rollitos-enriqueto",
    category: "entradas",
    name: "Rollitos Enriqueto",
    description:
      "Tortillas de harina fritas, rellenas de queso, camarón y pimiento morrón.",
    unit: "3 piezas",
    price: 85,
  },
  {
    id: "guacamole",
    category: "entradas",
    image: "/img/guacamole.jpeg",
    name: "Guacamole",
    description: "Aguacate machacado, sazonado y servido con pico de gallo.",
    unit: "orden",
    price: 79,
  },
  {
    id: "tacos-dorados",
    category: "tradicionales",
    image: "/img/taco_dorado.jpeg",
    name: "Tacos Dorados",
    description: "La textura perfecta en cada bocado.",
    unit: "1 pieza",
    options: [
      { label: "Gallina", price: 55 },
      { label: "Pollo", price: 70 },
      { label: "Pierna", price: 75 },
    ],
  },
  {
    id: "sopes",
    category: "tradicionales",
    image: "/img/sopes.jpg",
    name: "Sopes",
    description: "Sabrosos y tradicionales estilo Tuxpan.",
    unit: "1 pieza",
    options: [
      { label: "Gallina", price: 35 },
      { label: "Pollo", price: 40 },
      { label: "Pierna", price: 45 },
      { label: "Pata", price: 50 },
    ],
  },
  {
    id: "enchiladas",
    category: "tradicionales",
    name: "Enchiladas",
    description:
      "Tortillas de maíz rellenas, bañadas en salsa roja de chile guajillo, con crema, queso fresco y cebolla.",
    unit: "2 piezas",
    options: [
      { label: "Queso", price: 55 },
      { label: "Pollo", price: 65 },
      { label: "Pierna", price: 70 },
    ],
  },
  {
    id: "sincronizadas",
    category: "tradicionales",
    name: "Sincronizadas",
    description:
      "Tortilla de harina rellena de queso, jamón y ingredientes al gusto.",
    unit: "1 pieza",
    options: [
      { label: "Queso y jamón", price: 60 },
      { label: "Especial (queso, jamón, panela, pollo o pierna)", price: 80 },
    ],
  },
  {
    id: "pollo-dorado",
    category: "extras",
    image: "/img/pollo_frito.jpeg",
    name: "Pieza de Pollo Dorado",
    description:
      "Una pieza de pollo dorado acompañada con dos rodajas de papa dorada.",
    unit: "1 pieza",
    price: 40,
  },
  {
    id: "papa-dorada",
    category: "extras",
    name: "Papa Dorada",
    description: "Papa dorada para acompañar.",
    options: [
      { label: "Media orden", price: 40 },
      { label: "Orden completa", price: 75 },
    ],
  },
  {
    id: "extras",
    category: "extras",
    name: "Extras",
    description: "Complementa tu platillo.",
    options: [
      { label: "Frijoles", price: 35 },
      { label: "Arroz", price: 35 },
      { label: "Crema", price: 15 },
      { label: "Queso", price: 15 },
      { label: "Tiritas de pollo", price: 20 },
      { label: "Pierna deshebrada", price: 20 },
      { label: "Tostada seca", price: 7 },
    ],
  },
  {
    id: "tarta-elote",
    category: "postres",
    image: "/img/tarta_elote.png",
    name: "Tarta de elote",
    description: "Tarta de elote con nieve de vainilla.",
    price: 99,
  },
  {
    id: "brownie",
    category: "postres",
    image: "/img/brownie.png",
    name: "Brownie",
    description: "Brownie con nieve de vainilla.",
    price: 99,
  },
  {
    id: "platanos-fritos",
    category: "postres",
    image: "/img/platanitos.jpeg",
    name: "Plátanos fritos",
    description: "Plátanos fritos.",
    price: 79,
  },
  {
    id: "jericallas",
    category: "postres",
    name: "Jericallas",
    description: "Jericallas.",
    price: 55,
  },
  {
    id: "arroz-con-leche",
    category: "postres",
    name: "Arroz con leche",
    description: "Arroz con leche.",
    price: 55,
  },
  {
    id: "postre-del-dia",
    category: "postres",
    name: "Postre del día",
    description: "Pregunta por el postre del día.",
    price: 99,
  },
  {
    id: "aguas-frescas",
    category: "bebidas",
    name: "Aguas Frescas del día",
    description: "Aguas frescas preparadas cada día.",
    options: [
      { label: "Vaso mediano", price: 30 },
      { label: "Vaso grande", price: 50 },
    ],
  },
  {
    id: "limonadas-naranjadas",
    category: "bebidas",
    name: "Limonadas y Naranjadas",
    description: "Bebidas de la casa, naturales o minerales.",
    price: 60,
  },
  {
    id: "bebidas-calientes",
    category: "bebidas",
    name: "Bebidas Calientes",
    description: "Para acompañar tu comida.",
    options: [
      { label: "Champurrado", price: 45 },
      { label: "Café americano o de olla", price: 35 },
      { label: "Té", price: 35 },
    ],
  },
  {
    id: "mocktails",
    category: "bebidas",
    name: "Mocktails",
    description: "Bebidas sin alcohol, $89 cada una.",
    wide: true,
    options: [
      "Mojito Inocente",
      "Aguas frescas con twist",
      "Sol Sin Pecado",
      "Chapulín Colorado",
      "Piñada",
      "Fresada",
      "Conga",
    ].map((label) => ({ label, price: 89 })),
  },
  {
    id: "cocteles-tequila",
    category: "cocteleria",
    name: "Cocteles con Tequila",
    description: "Coctelería preparada con tequila.",
    wide: true,
    options: [
      {
        label: "La Tricolor",
        description: "Tres caballitos con tequila, limón y sangrita.",
        price: 99,
      },
      {
        label: "Besito Costeño",
        description: "Tequila con piña, limón y un toque de granadina.",
        price: 119,
      },
      {
        label: "Agüita del Rancho",
        description: "El clásico Ranch Water: tequila, limón y agua mineral.",
        price: 119,
      },
      {
        label: "Margarita la Mexicana",
        description: "Elige entre fresa, mango, tamarindo, kiwi o pepino.",
        price: 119,
      },
    ],
  },
  {
    id: "cocteles-vodka",
    category: "cocteleria",
    name: "Cocteles con Vodka",
    description: "Coctelería preparada con vodka.",
    wide: true,
    options: [
      {
        label: "Toniko del Norte",
        description: "Vodka, agua tónica y limón.",
        price: 119,
      },
      {
        label: "Refrescón del Bajío",
        description: "Pepino, limón y vodka.",
        price: 119,
      },
    ],
  },
  {
    id: "cocteles-cerveza",
    category: "cocteleria",
    name: "Cocteles con Cerveza",
    description: "Coctelería preparada con cerveza.",
    wide: true,
    options: [
      {
        label: "La Clamatada",
        description: "Cerveza con clamato, salsas, limón y escarchado.",
        price: 89,
      },
      {
        label: "Miche Poderosa",
        description: "Michelada cubana, fuerte y bien condimentada.",
        price: 89,
      },
    ],
  },
  {
    id: "cocteles-mezcal",
    category: "cocteleria",
    name: "Cocteles con Mezcal",
    description: "Coctelería preparada con mezcal.",
    wide: true,
    options: [
      {
        label: "Burro Ahumado",
        description: "Mezcal con ginger ale y un toque cítrico.",
        price: 119,
      },
      {
        label: "Pasión del Valle",
        description: "Maracuyá y mezcal en un cóctel tropical.",
        price: 119,
      },
      {
        label: "Diablito del Monte",
        description: "Mezcal con refresco de tamarindo y escarchado de chile.",
        price: 119,
      },
    ],
  },
  {
    id: "cocteles-ron",
    category: "cocteleria",
    name: "Cocteles con Ron",
    description: "Coctelería preparada con ron.",
    wide: true,
    options: [
      {
        label: "Brisa Caribeña",
        description: "Daiquirí clásico con ron, limón y jarabe.",
        price: 119,
      },
      {
        label: "Tropicalísima",
        description: "Caipirinha al estilo caribeño, con ron.",
        price: 119,
      },
      {
        label: "Flor de Ron",
        description: "Jamaica con ron y limón.",
        price: 119,
      },
      {
        label: "Fiesta Antillana",
        description: "Punch caribeño con naranja, piña y granadina.",
        price: 119,
      },
      { label: "Piña Colada", price: 119 },
    ],
  },
  {
    id: "tragos-clasicos",
    category: "cocteleria",
    name: "Tragos Clásicos",
    description: "Pídelo a tu gusto.",
    note: "Aplican restricciones.",
    wide: true,
    options: [
      "Cerveza española",
      "Clericot",
      "Charro negro",
      "Palomas",
      "Mojitos clásicos",
      "Desarmador",
      "Bloody mary",
      "Canario",
      "Perro negro",
      "Bull",
      "Ruso blanco",
      "Ruso negro",
    ].map((label) => ({ label, price: 99 })),
  },
  {
    id: "cervezas",
    category: "cocteleria",
    name: "Cervezas Comerciales",
    description: "Cervezas de media.",
    wide: true,
    options: [
      { label: "Pacífico", price: 40 },
      { label: "Corona", price: 40 },
      { label: "Ultra Michelob", price: 50 },
      { label: "Modelo Especial", price: 50 },
      { label: "Negra Modelo", price: 50 },
      { label: "Stella", price: 60 },
      { label: "Tecate Light", price: 25 },
      { label: "Tecate Original", price: 25 },
      { label: "Indio", price: 30 },
      { label: "Bohemia Cristal", price: 35 },
      { label: "Bohemia Clásica", price: 35 },
      { label: "XX Lager", price: 35 },
      { label: "Miller", price: 40 },
      { label: "Heineken 0°", price: 30 },
    ],
  },
  {
    id: "licores-whisky",
    category: "licores",
    name: "Whisky",
    description: "Copeo o botella.",
    note: "Copeo de 45 ml.",
    wide: true,
    options: [
      { label: "Black Label", price: 170, bottlePrice: 2499 },
      { label: "Old Parr", price: 130, bottlePrice: 1819 },
      { label: "Jack Daniel's", price: 90, bottlePrice: 1199 },
      { label: "Buchanan's Master", price: 180, bottlePrice: 2649 },
      { label: "Whisky de la casa", price: 70 },
    ],
  },
  {
    id: "licores-ron",
    category: "licores",
    name: "Ron",
    description: "Copeo o botella.",
    note: "Copeo de 45 ml.",
    wide: true,
    options: [
      { label: "Bacardí", price: 70, bottlePrice: 699 },
      { label: "Matusalem", price: 80, bottlePrice: 899 },
    ],
  },
  {
    id: "licores-tequila",
    category: "licores",
    name: "Tequila",
    description: "Copeo o botella.",
    note: "Copeo de 45 ml.",
    wide: true,
    options: [
      { label: "Tradicional Plata", price: 80, bottlePrice: 819 },
      { label: "Tradicional Reposado", price: 80, bottlePrice: 819 },
      { label: "Maestro Dobel Blanco", price: 100, bottlePrice: 1449 },
      { label: "Maestro Dobel Diamante", price: 120, bottlePrice: 1699 },
      { label: "1800 Cristalino", price: 130, bottlePrice: 1899 },
      { label: "Don Julio Reposado", price: 120, bottlePrice: 1699 },
      { label: "Don Julio 70", price: 150, bottlePrice: 2299 },
      { label: "Tequila de la Casa", price: 70 },
    ],
  },
  {
    id: "licores-mezcal",
    category: "licores",
    name: "Mezcal",
    description: "Copeo o botella.",
    note: "Copeo de 45 ml.",
    wide: true,
    options: [
      { label: "400 Conejos", price: 100, bottlePrice: 1199 },
      { label: "Mezcal de la Casa", price: 70 },
    ],
  },
  {
    id: "licores-brandy",
    category: "licores",
    name: "Brandy y Coñac",
    description: "Copeo o botella.",
    note: "Copeo de 45 ml.",
    wide: true,
    options: [
      { label: "Torres 10", price: 80, bottlePrice: 899 },
      { label: "Torres 15", price: 100, bottlePrice: 1449 },
    ],
  },
  {
    id: "vinos-tintos",
    category: "licores",
    name: "Vinos Tintos",
    description: "Botella o copa.",
    wide: true,
    options: [
      { label: "Concha y Toro – Malbec (botella)", price: 549 },
      { label: "Finca Las Moras – Malbec (botella)", price: 599 },
      { label: "Copa de vino de la casa", price: 80 },
    ],
  },
];
