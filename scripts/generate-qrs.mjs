// Genera en qr-mesas/ una carpeta por mesa (mesa-NN/) con qr.svg, qr.png y la
// tarjeta imprimible tarjeta.png, más un index.html con todas las tarjetas.
// Cada QR abre la página oculta de mesa: `{url}/mesa.html?k={key}&n={N}`.
// `key` es el código secreto y debe ser el mismo valor que VITE_MESA_KEY en
// .env.local y en las variables de entorno de Netlify.
// OJO: qr-mesas/ se borra completa antes de generar (es una carpeta generada
// e ignorada por git); no guardes ahí archivos propios.
//
// Uso:
//   npm run generate:qrs -- --url=https://tudominio.com --key=CODIGO
//   npm run generate:qrs -- --url=https://tudominio.com --key=CODIGO --tables=20
//
// --key: 16 a 32 caracteres [A-Za-z0-9_-]. --tables debe coincidir con `site.tables` en src/data/site.ts (por defecto 30).
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";
import { buildCard } from "./qr-card.mjs";

const args = process.argv.slice(2);
const arg = (name) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
};
const fail = (msg) => {
  console.error(`Error: ${msg}`);
  process.exit(1);
};

const rawUrl = arg("url");
if (!rawUrl)
  fail(
    "falta --url. Ej: npm run generate:qrs -- --url=https://tudominio.com --key=CODIGO",
  );
let base;
try {
  const u = new URL(rawUrl);
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
  base = rawUrl.replace(/\/+$/, "");
} catch {
  fail(
    `--url debe ser una URL que empiece con http:// o https:// (recibido: ${rawUrl})`,
  );
}

const key = arg("key");
if (!key) {
  fail(
    "falta --key (el mismo valor que VITE_MESA_KEY). Ej: --key=Ab3dEf6hIj9lMn2pQr",
  );
}
if (!/^[A-Za-z0-9_-]{16,32}$/.test(key)) {
  fail("--key debe tener de 16 a 32 caracteres: letras, números, _ o -");
}

const tables = Number(arg("tables") ?? 30);
if (!Number.isInteger(tables) || tables < 1) {
  fail("--tables debe ser un entero mayor o igual a 1");
}

const outDir = "qr-mesas";
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const items = [];
for (let n = 1; n <= tables; n++) {
  const name = `mesa-${String(n).padStart(2, "0")}`;
  const target = `${base}/mesa.html?k=${key}&n=${n}`;
  const dir = join(outDir, name);
  await mkdir(dir);
  await writeFile(
    join(dir, "qr.svg"),
    await QRCode.toString(target, { type: "svg", margin: 2 }),
  );
  await writeFile(
    join(dir, "qr.png"),
    await QRCode.toBuffer(target, { type: "png", width: 800, margin: 2 }),
  );
  await writeFile(
    join(dir, "tarjeta.png"),
    await buildCard({ table: n, target }),
  );
  items.push({ n, name, target });
}

const cards = items
  .map(
    ({ n, name }) => `    <figure>
      <img src="${name}/tarjeta.png" alt="Tarjeta de la mesa ${n}" />
    </figure>`,
  )
  .join("\n");

await writeFile(
  join(outDir, "index.html"),
  `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Tarjetas por mesa</title>
    <style>
      body { font-family: sans-serif; margin: 16px; }
      main { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
      figure { margin: 0; text-align: center; break-inside: avoid; border: 1px solid #ccc; padding: 8px; }
      img { width: 100%; display: block; }
      @media print { main { grid-template-columns: repeat(2, 1fr); } }
    </style>
  </head>
  <body>
    <main>
${cards}
    </main>
  </body>
</html>
`,
);

console.log(
  `Listo: ${tables} mesas en ${outDir}/ apuntando a ${base}/mesa.html`,
);
