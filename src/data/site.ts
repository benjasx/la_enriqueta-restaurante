export const site = {
  name: "La Enriqueta",
  tagline: "Antojitos Tuxpeños",
  city: "Tepic, Nayarit",
  addressLines: ["C. Brasil 261, Col. Moctezuma", "Tepic, Nayarit"],
  phone: "523115130988",
  phoneLabel: "311 513 0988",
  whatsapp: "523111397571",
  socials: [
    {
      id: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/share/1A2s9vUFCV/",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/laenriquetaantojitostuxpenos",
    },
    {
      id: "tiktok",
      label: "TikTok",
      url: "https://www.tiktok.com/@laenriquetatepic",
    },
  ],
  tables: 20, // mesas numeradas 1..tables (QR en modo mesa)
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=C.%20Brasil%20261%2C%20Moctezuma%2C%20Tepic%2C%20Nayarit&z=16&output=embed",
  hours: [
    {
      days: "Abrimos todos los días de",
      time: "8:00 am – 10:30 pm",
      open: true,
    },
    { days: "Lunes", time: "Cerrado", open: false },
  ],
};

export const whatsappUrl = (
  message = "¡Hola La Enriqueta! Me gustaría hacer un pedido.",
) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const gallery: {
  id: string;
  hint: string;
  src?: string;
  className: string;
}[] = [
  {
    id: "gal-1",
    hint: "Chilaquiles con carne asada",
    src: "/img/platillo.webp",
    className: "row-span-2",
  },
  {
    id: "gal-2",
    hint: "Sopes",
    src: "/img/sopes.webp",
    className: "",
  },
  {
    id: "gal-3",
    hint: "Taco dorado",
    src: "/img/taco_dorado.webp",
    className: "",
  },
  {
    id: "gal-4",
    hint: "Pozole rojo",
    src: "/img/pozole.webp",
    className: "col-span-2",
  },
  {
    id: "gal-5",
    hint: "Chilaquiles",
    src: "/img/chilaquiles.webp",
    className: "row-span-2",
  },
  {
    id: "gal-6",
    hint: "Tostadas surtidas",
    src: "/img/tostadas_v.webp",
    className: "",
  },
  {
    id: "gal-7",
    hint: "Pozole con tostadas",
    src: "/img/pozole_v.webp",
    className: "",
  },
  {
    id: "gal-8",
    hint: "Molletes con carne",
    src: "/img/molletes.webp",
    className: "",
  },
  {
    id: "gal-9",
    hint: "Pollo frito",
    src: "/img/pollo_frito.webp",
    className: "row-span-2",
  },
  {
    id: "gal-10",
    hint: "Torta ahogada",
    src: "/img/torta.webp",
    className: "col-span-2",
  },
  {
    id: "gal-11",
    hint: "Plátanos fritos",
    src: "/img/platanitos.webp",
    className: "",
  },
];
