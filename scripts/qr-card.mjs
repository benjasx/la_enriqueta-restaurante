// Tarjeta imprimible por mesa (SPEC 07): constantes de diseño y conversión de
// texto a trazos vectoriales con opentype.js + Fraunces, para que el resultado
// no dependa de las fuentes instaladas en la máquina.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import QRCode from "qrcode";
import sharp from "sharp";

export const CARD = {
  size: 1500, // px, cuadrada
  colors: {
    wine: "#b0195e",
    orange: "#d9622b",
    gold: "#c99a2e",
    cream: "#fbf6ee",
    ink: "#2a1a1f",
  },
  // Recuadro blanco: mide (módulos + 2 × quiet) × celda y se centra; la celda es
  // la menor entera con la que los módulos suman al menos `minQr` px.
  qrBox: { top: 405, radius: 40, quiet: 4, minQr: 640 },
  headline: "Visita nuestro menú.",
  hint: "Escanea para pedir desde tu mesa",
};

const FONT_DIR = fileURLToPath(
  new URL("../node_modules/@fontsource/fraunces/files", import.meta.url),
);

const fonts = {};
const loadFont = (weight) => {
  if (fonts[weight]) return fonts[weight];
  const file = `${FONT_DIR}/fraunces-latin-${weight}-normal.woff`;
  let buf;
  try {
    buf = readFileSync(file);
  } catch {
    throw new Error(
      `No se encontró la fuente ${file}. Ejecuta npm install para instalar @fontsource/fraunces.`,
    );
  }
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return (fonts[weight] = opentype.parse(ab));
};

// toPathData de opentype.js 2.0.0 puede emitir "NaN" al optimizar curvas
// (rompe el render a partir de ese glifo), así que se serializa a mano.
const n = (v) => Number(v.toFixed(2));
const pathData = (commands) =>
  commands
    .map((c) => {
      if (c.type === "M" || c.type === "L")
        return `${c.type}${n(c.x)} ${n(c.y)}`;
      if (c.type === "Q") return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
      if (c.type === "C")
        return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
      return "Z";
    })
    .join("");

// Devuelve { d, width } con el trazo SVG del texto. `anchor` alinea respecto de x:
// "middle" (centrado), "start" (izquierda) o "end" (derecha). `y` es la línea base.
export const textPath = (
  text,
  { weight = 600, size, x = 0, y = 0, anchor = "middle", tracking = 0 },
) => {
  const font = loadFont(weight);
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(text);
  const advances = glyphs.map((g) => g.advanceWidth * scale + tracking);
  const width = advances.reduce((a, b) => a + b, 0) - tracking;
  let cx =
    anchor === "middle" ? x - width / 2 : anchor === "end" ? x - width : x;
  const parts = glyphs.map((g, i) => {
    const d = pathData(g.getPath(cx, y, size).commands);
    cx += advances[i];
    return d;
  });
  return { d: parts.join(" "), width };
};

const LOGO = fileURLToPath(new URL("../public/img/logo.webp", import.meta.url));

const path = (t, o, fill) => `<path fill="${fill}" d="${textPath(t, o).d}"/>`;

// Devuelve el SVG (cadena) de la tarjeta de una mesa.
export const buildCardSvg = async ({ table, target }) => {
  const { size: S, colors: c, qrBox, headline, hint } = CARD;
  const qr = QRCode.create(target, { errorCorrectionLevel: "M" });
  const count = qr.modules.size;
  const cell = Math.ceil(qrBox.minQr / count);
  const box = (count + 2 * qrBox.quiet) * cell;
  const bx = (S - box) / 2;
  const by = qrBox.top;

  let dark = "";
  for (let r = 0; r < count; r++)
    for (let col = 0; col < count; col++)
      if (qr.modules.get(r, col)) {
        const x = bx + (qrBox.quiet + col) * cell;
        const y = by + (qrBox.quiet + r) * cell;
        dark += `M${x} ${y}h${cell}v${cell}h-${cell}z`;
      }

  const logo = await sharp(LOGO)
    .resize(104, 104, { fit: "contain", background: "#00000000" })
    .png()
    .toBuffer();
  const cx = S / 2;

  const label = `Mesa ${table}`;
  const badgeSize = 74;
  const badgeW = textPath(label, { weight: 700, size: badgeSize }).width + 140;
  const badgeH = 100;
  const badgeY = by + box + 30;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="${c.wine}"/>
  <circle cx="0" cy="${S}" r="280" fill="${c.orange}"/>
  <circle cx="${S}" cy="0" r="210" fill="${c.gold}"/>
  <rect x="24" y="24" width="${S - 48}" height="${S - 48}" rx="36" fill="none" stroke="${c.cream}" stroke-opacity="0.55" stroke-width="5"/>
  <circle cx="${cx}" cy="95" r="68" fill="${c.cream}"/>
  <image href="data:image/png;base64,${logo.toString("base64")}" x="${cx - 52}" y="${95 - 52}" width="104" height="104"/>
  ${path("La Enriqueta", { weight: 600, size: 70, x: cx, y: 232 }, c.cream)}
  ${path("ANTOJITOS TUXPEÑOS", { weight: 600, size: 26, x: cx, y: 272, tracking: 7 }, c.gold)}
  ${path(headline, { weight: 600, size: 96, x: cx, y: 372 }, c.cream)}
  <rect x="${bx}" y="${by}" width="${box}" height="${box}" rx="${qrBox.radius}" fill="#ffffff"/>
  <path d="${dark}" fill="#000000" shape-rendering="crispEdges"/>
  <rect x="${cx - badgeW / 2}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="${badgeH / 2}" fill="${c.orange}"/>
  ${path(label, { weight: 700, size: badgeSize, x: cx, y: badgeY + badgeH / 2 + badgeSize * 0.35 }, c.cream)}
  ${path(hint, { weight: 600, size: 38, x: cx, y: badgeY + badgeH + 62 }, c.cream)}
</svg>`;
};

// Devuelve el PNG (Buffer) de la tarjeta, de CARD.size × CARD.size px.
export const buildCard = async (opts) =>
  sharp(Buffer.from(await buildCardSvg(opts)))
    .png()
    .toBuffer();
