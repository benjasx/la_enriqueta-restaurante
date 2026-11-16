// Genera un QR por mesa en qr-mesas/ (SVG, PNG e index.html imprimible).
// Cada QR abre `{url}/?mesa=N`, que activa el modo mesa del sitio.
//
// Uso:
//   npm run generate:qrs -- --url=https://tudominio.com
//   npm run generate:qrs -- --url=https://tudominio.com --tables=20
//
// --tables debe coincidir con `site.tables` en src/data/site.ts (por defecto 20).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import QRCode from "qrcode";

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
  fail("falta --url. Ej: npm run generate:qrs -- --url=https://tudominio.com");
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

const tables = Number(arg("tables") ?? 20);
if (!Number.isInteger(tables) || tables < 1) {
  fail("--tables debe ser un entero mayor o igual a 1");
}

const outDir = "qr-mesas";
await mkdir(outDir, { recursive: true });

const items = [];
for (let n = 1; n <= tables; n++) {
  const name = `mesa-${String(n).padStart(2, "0")}`;
  const target = `${base}/?mesa=${n}`;
  await writeFile(
    join(outDir, `${name}.svg`),
    await QRCode.toString(target, { type: "svg", margin: 2 }),
  );
  await writeFile(
    join(outDir, `${name}.png`),
    await QRCode.toBuffer(target, { type: "png", width: 800, margin: 2 }),
  );
  items.push({ n, name, target });
}

const cards = items
  .map(
    ({ n, name }) => `    <figure>
      <img src="${name}.svg" alt="QR de la mesa ${n}" />
      <figcaption>Mesa ${n}</figcaption>
    </figure>`,
  )
  .join("\n");

await writeFile(
  join(outDir, "index.html"),
  `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>QR por mesa</title>
    <style>
      body { font-family: sans-serif; margin: 16px; }
      main { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
      figure { margin: 0; text-align: center; break-inside: avoid; border: 1px solid #ccc; padding: 12px; }
      img { width: 100%; max-width: 220px; }
      figcaption { font-size: 28px; font-weight: 700; }
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

console.log(`Listo: ${tables} QR en ${outDir}/ apuntando a ${base}/?mesa=N`);
