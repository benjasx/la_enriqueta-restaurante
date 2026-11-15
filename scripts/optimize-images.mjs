// Convierte las imagenes de public/ (jpg, jpeg, png) a WebP y actualiza
// las referencias en src/ e index.html.
//
// Uso:
//   npm run optimize:images              -> convierte y borra los originales
//   npm run optimize:images -- --keep    -> conserva los originales
//   npm run optimize:images -- --width=1600 --quality=85
import { readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { basename, extname, join, relative, sep } from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split("=")[1]) : fallback;
};
const keep = args.includes("--keep");
const maxWidth = flag("width", 1280);
const quality = flag("quality", 80);

const publicDir = "public";
const sourceDirs = ["src", "index.html"];
const inputExt = new Set([".jpg", ".jpeg", ".png"]);
const textExt = new Set([".ts", ".tsx", ".css", ".html", ".json"]);

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
};

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const urlPath = (file) => "/" + relative(publicDir, file).split(sep).join("/");

const images = (await walk(publicDir)).filter((f) =>
  inputExt.has(extname(f).toLowerCase()),
);

if (images.length === 0) {
  console.log("No hay imagenes jpg/jpeg/png para optimizar en public/.");
  process.exit(0);
}

let before = 0;
let after = 0;
const renamed = new Map();

for (const file of images) {
  const target = join(file, "..", `${basename(file, extname(file))}.webp`);
  const { size } = await stat(file);
  const buf = await sharp(file)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  await writeFile(target, buf);
  if (!keep) await rm(file);
  before += size;
  after += buf.length;
  renamed.set(urlPath(file), urlPath(target));
  console.log(`${urlPath(file)}  ${kb(size)} -> ${kb(buf.length)}`);
}

// Actualiza las referencias (/img/foo.jpg -> /img/foo.webp)
const sources = [];
for (const p of sourceDirs) {
  const s = await stat(p);
  sources.push(...(s.isDirectory() ? await walk(p) : [p]));
}
let touched = 0;
for (const file of sources.filter((f) => textExt.has(extname(f)))) {
  let text = await readFile(file, "utf8");
  const original = text;
  for (const [from, to] of renamed) text = text.split(from).join(to);
  if (text !== original) {
    await writeFile(file, text);
    touched++;
    console.log(`referencias actualizadas: ${file}`);
  }
}

console.log(
  `\n${images.length} imagenes: ${kb(before)} -> ${kb(after)} ` +
    `(-${Math.round((1 - after / before) * 100)}%). ` +
    `${touched} archivos de codigo actualizados.`,
);
