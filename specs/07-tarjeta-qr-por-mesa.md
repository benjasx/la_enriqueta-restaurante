# SPEC 07 — Página oculta de menú por mesa y tarjeta imprimible con el QR

> **Estado:** aprobado
> **Depende de:** SPEC 06
> **Fecha:** 2026-11-16
> **Objetivo:** Hacer que el QR de cada mesa, impreso en una tarjeta de 1500 × 1500 px con la marca de La Enriqueta, abra una página oculta (`mesa.html`) con solo el menú, el banner de Viernes de Karaoke y el carrito en modo mesa, accesible únicamente con el código secreto que lleva ese QR y no desde el sitio principal.

## Por qué existe esta spec

La SPEC 06 dejó los QR como archivos sueltos y activó el modo mesa con `/?mesa=N` en el propio sitio público. Eso tiene dos problemas: un QR pelado no invita a escanearlo ni dice a qué mesa corresponde, y el sitio principal (Hero, Nosotros, Galería, Contacto…) es demasiado para un cliente que ya está sentado y solo quiere pedir. Esta spec hace dos cosas:

1. **Tarjeta imprimible por mesa** (pasos 1 a 5, ya implementados): carpeta por mesa con `qr.svg`, `qr.png` y una tarjeta `tarjeta.png` diseñada.
2. **Página oculta de menú por mesa** (pasos 6 a 11, pendientes): el QR deja de abrir el sitio principal y abre una página aparte, igual para todas las mesas salvo el número, que reutiliza el menú, el banner de karaoke y el carrito.

Esta spec **revoca** de la SPEC 06 la activación del modo mesa con `/?mesa=N` en el sitio principal, el chip flotante "Mesa N" y el botón "Salir del modo mesa". Se conserva de la SPEC 06 el comportamiento del modo mesa en el carrito: nombre opcional, sin teléfono ni domicilio, y el mensaje "Pedido para la MESA N".

## Alcance

**Dentro, tarjeta (pasos 1 a 5, implementados):**

- Salida en `qr-mesas/mesa-NN/` (NN con dos dígitos), con `qr.svg`, `qr.png` y `tarjeta.png`.
- Tarjeta PNG de 1500 × 1500 px con, de arriba abajo: logo (`public/img/logo.webp`) y nombre "La Enriqueta" con "Antojitos Tuxpeños"; el título "Visita nuestro menú."; el QR sobre un recuadro blanco; la insignia "Mesa N"; y la línea "Escanea para pedir desde tu mesa".
- Paleta de la marca (`@theme` de `src/index.css`): fondo vino, acentos naranja y dorado, textos crema, y tipografía Fraunces. Los textos van como trazos vectoriales con `opentype.js` y `@fontsource/fraunces`; se rasteriza con `sharp`.
- El `index.html` de `qr-mesas/` muestra las tarjetas; el script borra `qr-mesas/` antes de generar.
- Dos `devDependencies`: `opentype.js` y `@fontsource/fraunces`.

**Dentro, página oculta (pasos 6 a 11, pendientes):**

- Segunda entrada de Vite: `mesa.html` en la raíz, con `<meta name="robots" content="noindex, nofollow">`, sin etiquetas `og:`, y su propio punto de entrada `src/mesa-main.tsx`. `vite.config.ts` declara las dos entradas (`index.html` y `mesa.html`).
- URL canónica del QR: `{url}/mesa.html?k={código}&n={N}`, donde `N` es la mesa (1 a `site.tables`) y `código` es un secreto compartido de 16 a 32 caracteres `[A-Za-z0-9_-]`.
- El código vive en la variable de entorno `VITE_MESA_KEY`: en `.env.local` (ya ignorado por `*.local`) para desarrollo, y en las variables de entorno de Netlify para producción. El repo solo incluye `.env.example` con la variable vacía.
- Acceso: la página solo muestra el menú si `k` coincide con `VITE_MESA_KEY` y `n` es una mesa válida. Si falta cualquiera, o si `VITE_MESA_KEY` no está definida, muestra una pantalla neutra "Escanea el código QR de tu mesa para ver el menú." sin menú, sin enlaces y sin ningún dato del negocio salvo el nombre.
- Contenido de la página (misma para todas las mesas, solo cambia el número):
  - Encabezado mínimo `MesaHeader`: logo, "La Enriqueta", insignia "Mesa N" y el botón del carrito. Sin enlaces de navegación y sin enlace al sitio principal.
  - `Menu` con las 11 pestañas, las mismas tarjetas, precios y botones de agregar que el sitio.
  - `KaraokeBanner` (la imagen del banner de Viernes de Karaoke), debajo del menú, igual que en el sitio.
  - Carrito: `CartButton`, `CartPanel` y `CartToast` en modo mesa (nombre opcional; mensaje "Pedido para la MESA N").
- El sitio principal deja de conocer el modo mesa: se quitan de `App.tsx` el `TableProvider` y el `TableChip`, el parámetro `/?mesa=N` se ignora, y ningún enlace, `sitemap` ni `robots.txt` del sitio apunta a `mesa.html`.
- `useTable` deja de lanzar error fuera de un proveedor: devuelve `{ table: null }` para que el carrito del sitio principal siga igual que en la SPEC 04.
- Se quita el botón "Salir del modo mesa" del panel: no hay a dónde salir, porque la página de mesa es independiente del sitio.
- El código de los QR se genera con el script: `npm run generate:qrs -- --url=https://la-enriqueta.netlify.app --key=CODIGO`.

**Fuera de alcance (para specs futuras):**

- Protección real de acceso (token validado en un servidor, QR firmados o de un solo uso, caducidad): el sitio es estático y el código viaja en el bundle de `mesa.html`; es disuasión, no seguridad (ver Riesgos).
- Cabeceras HTTP (`X-Robots-Tag`) o `netlify.toml`; basta con la etiqueta `noindex`.
- Hero, Nosotros, Galería, Banner de local, Contacto y pie en la página de mesa.
- Pedidos a domicilio o para recoger desde la página de mesa.
- PDF, SVG de la tarjeta, otros tamaños, sangrado y CMYK.
- URL escrita en la tarjeta; logo o color dentro del QR.
- Cambios en el menú, sus precios, el banner de karaoke o el mensaje de WhatsApp más allá de lo descrito.
- Rotación del código desde el panel de Netlify sin reimprimir (cambiar el código obliga a regenerar y reimprimir los QR).

## Modelo de datos

Constantes de la tarjeta (ya implementadas) en `scripts/qr-card.mjs`:

```js
export const CARD = {
  size: 1500,
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
// buildCard({ table, target }) → Promise<Buffer>  // PNG 1500 × 1500
// textPath(texto, { weight, size, x, y, anchor, tracking }) → { d, width }  // texto a trazo SVG
```

Acceso a la página de mesa (pasos 6 a 11):

```ts
// src/table/tableSession.ts
export const parseTable = (raw: string | null, max?: number): number | null;
// Solo enteros decimales sin ceros a la izquierda entre 1 y max (por defecto site.tables).

export const readAccess = (
  search: string, // location.search
  key: string | undefined, // import.meta.env.VITE_MESA_KEY
  max?: number,
): number | null;
// Devuelve la mesa solo si `key` es una cadena no vacía, el parámetro `k` es idéntico
// a `key` y `n` pasa parseTable. En cualquier otro caso, null.
```

```ts
// src/table/useTable.ts
export type TableContextValue = { table: number | null };
// Sin proveedor devuelve { table: null }; ya no existe `leaveTable`.
```

```
# .env.example (en el repo; el valor real va en .env.local y en Netlify)
VITE_MESA_KEY=
```

Reglas:

- **La URL es la fuente de verdad.** La página no guarda la mesa ni el código en `sessionStorage` ni `localStorage`: se valida en cada carga a partir de `?k=…&n=…`. Recargar funciona porque los parámetros siguen en la URL; abrir `mesa.html` sin ellos muestra la pantalla neutra. Se eliminan `TABLE_KEY`, `loadTable` y `saveTable` de la SPEC 06.
- `n` solo cambia el número que se muestra y se envía; no existe ninguna diferencia de contenido entre mesas.
- El código nunca se escribe en la UI, en la consola ni en el mensaje de WhatsApp.
- Con mesa activa, `validateCustomer(customer, table)` y `cartMessage(state, table)` se comportan como en la SPEC 06.
- El contenido del QR pasa a `{url}/mesa.html?k={key}&n={N}` (con `url` sin barra final). Con una URL de unos 75 a 85 caracteres el QR es de versión 5 o 6 (37 o 41 módulos); `buildCard` ya calcula la celda y el recuadro a partir de `minQr` = 640 px, así que el diseño se adapta solo.
- `--key` es obligatoria en el script, de 16 a 32 caracteres `[A-Za-z0-9_-]`; si falta o no cumple, el script termina con código distinto de 0 y un mensaje que lo explica.

Estructura de salida de los QR (sin cambios respecto a lo ya implementado):

```
qr-mesas/
  index.html
  mesa-01/
    qr.svg
    qr.png
    tarjeta.png
  …
  mesa-20/
```

Archivos que aparecen o cambian:

| Archivo                                                          | Cambio                                                                                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `scripts/qr-card.mjs`                                            | Nuevo (hecho). `CARD`, `textPath`, `buildCard`                                                                           |
| `scripts/generate-qrs.mjs`                                       | Carpeta por mesa (hecho); añade `--key` y el nuevo contenido del QR (paso 10)                                            |
| `package.json`                                                   | `opentype.js` y `@fontsource/fraunces` en `devDependencies` (hecho)                                                      |
| `mesa.html`                                                      | Nuevo. Entrada HTML oculta con `noindex, nofollow`, mismas fuentes que `index.html`                                      |
| `src/mesa-main.tsx`                                              | Nuevo. Monta `MesaApp` (con `MotionConfig` como `main.tsx`)                                                              |
| `src/MesaApp.tsx`                                                | Nuevo. Valida el acceso; con acceso muestra `MesaHeader`, `Menu`, `KaraokeBanner` y el carrito; sin acceso, `MesaLocked` |
| `src/components/MesaHeader.tsx`                                  | Nuevo. Logo, nombre, insignia "Mesa N" y `CartButton`; sin enlaces                                                       |
| `src/components/MesaLocked.tsx`                                  | Nuevo. Pantalla neutra "Escanea el código QR de tu mesa para ver el menú."                                               |
| `vite.config.ts`                                                 | `build.rollupOptions.input` con `index.html` y `mesa.html`                                                               |
| `src/table/tableSession.ts`                                      | Se añade `readAccess`; se eliminan `TABLE_KEY`, `loadTable` y `saveTable`                                                |
| `src/table/TableContext.tsx`                                     | Se elimina (ya no hay proveedor que lea la URL); `MesaApp` entrega el valor del contexto                                 |
| `src/table/useTable.ts`                                          | Contexto con valor por defecto `{ table: null }`, sin `leaveTable`                                                       |
| `src/components/TableChip.tsx`                                   | Se elimina                                                                                                               |
| `src/App.tsx`                                                    | Se quitan `TableProvider` y `TableChip`                                                                                  |
| `src/components/CartPanel.tsx`                                   | Se quita el botón "Salir del modo mesa"; se conserva la franja "Pedido para la Mesa N"                                   |
| `.env.example`                                                   | Nuevo. `VITE_MESA_KEY=`                                                                                                  |
| `src/table/tableSession.test.ts`, `src/table/TableMode.test.tsx` | Se reescriben para `readAccess` y para `MesaApp`; el sitio principal ignora `/?mesa=N`                                   |

## Plan de implementación

Pasos 1 a 5: **implementados** (tarjeta y carpeta por mesa). Se conservan como registro.

1. Instalar `opentype.js` y `@fontsource/fraunces` como `devDependencies`.
2. Crear `scripts/qr-card.mjs` con `CARD` y `textPath` (texto a trazos).
3. Completar `buildCard({ table, target })` y rasterizar con `sharp`.
4. Cambiar `scripts/generate-qrs.mjs`: carpeta por mesa y `index.html` con las tarjetas.
5. Decodificar las tarjetas con un lector de QR.

Pasos 6 a 11: **pendientes**.

6. En `src/table/tableSession.ts`, añadir `readAccess` (las funciones `TABLE_KEY`, `loadTable` y `saveTable` se eliminan en el paso 9, porque `TableContext.tsx` las usa hasta entonces); ampliar `tableSession.test.ts` (código correcto, código distinto, sin código, `VITE_MESA_KEY` indefinida o vacía, `n` inválido, `n` con ceros a la izquierda). Verificar: `npm test` y `npm run typecheck`.
7. Crear `mesa.html`, `src/mesa-main.tsx`, `src/MesaApp.tsx` (solo la validación, `MesaHeader` y `MesaLocked`), `src/components/MesaHeader.tsx` y `src/components/MesaLocked.tsx`, y declarar la segunda entrada en `vite.config.ts`. Verificar con `VITE_MESA_KEY=abc…` en `.env.local`: `npm run dev` y abrir `/mesa.html?k=CODIGO&n=7` muestra el encabezado con "Mesa 7"; sin `k`, con `k` incorrecto o con `n=99` muestra la pantalla neutra.
8. Completar `MesaApp.tsx`: bajo el encabezado montar `Menu` y `KaraokeBanner`, y envolver con `CartProvider`, `CartPanel` y `CartToast`; entregar la mesa por `useTable`. Quitar el botón "Salir del modo mesa" de `CartPanel.tsx`. Verificar: en `/mesa.html?k=CODIGO&n=7` agregar un producto, abrir el carrito, ver "Pedido para la Mesa 7" y el enlace de WhatsApp con "Pedido para la MESA 7:".
9. Retirar el modo mesa del sitio principal: quitar `TableProvider` y `TableChip` de `App.tsx`, eliminar `TableContext.tsx` y `TableChip.tsx`, eliminar `TABLE_KEY`, `loadTable` y `saveTable` de `tableSession.ts` (y sus tests), y dejar `useTable` con valor por defecto `{ table: null }`. Verificar: `npm test`; `/?mesa=7` en el sitio principal no muestra nada de mesa y el carrito pide los datos normales.
10. Actualizar `scripts/generate-qrs.mjs`: exigir `--key` (16 a 32 caracteres `[A-Za-z0-9_-]`), usar `{url}/mesa.html?k={key}&n={N}` como contenido del QR, y añadir `.env.example`. Verificar: `npm run generate:qrs -- --url=https://la-enriqueta.netlify.app --key=CODIGO` crea las 20 carpetas; decodificar `mesa-07/tarjeta.png` y `mesa-07/qr.png` devuelve exactamente la URL con `k` y `n=7`.
11. Reescribir `src/table/TableMode.test.tsx` para `MesaApp` (acceso válido, sin código, código incorrecto, mesa inválida, flujo agregar → carrito → enlace de WhatsApp, y que la página no contiene Hero, Nosotros, Galería ni Contacto) y añadir a `src/App.test.tsx` que `/?mesa=7` no muestra el modo mesa. Verificar: `npm test`, `npm run lint`, `npm run build`, y que `dist/` contenga `index.html` y `mesa.html`.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` terminan sin errores; `format:check` no falla por los archivos tocados.
- [ ] `npm run build` genera `dist/mesa.html` además de `dist/index.html`.

Tarjeta y archivos (implementado):

- [ ] El script crea `qr-mesas/mesa-01/` a `mesa-20/`, cada una con exactamente `qr.svg`, `qr.png` y `tarjeta.png`, y no deja archivos `mesa-NN.svg` ni `mesa-NN.png` sueltos.
- [ ] Cada `tarjeta.png` mide exactamente 1500 × 1500 px y muestra "Visita nuestro menú." con tilde, "La Enriqueta", "Antojitos Tuxpeños", "Escanea para pedir desde tu mesa" y la insignia con el número de su carpeta.
- [ ] El logo aparece completo y no tapa texto ni el QR; el QR es negro sobre blanco con margen de 4 módulos y mide al menos 640 px de ancho.
- [ ] Los colores usados salen de la paleta de `@theme` y el texto se ve con Fraunces aunque la máquina no la tenga (trazos vectoriales).
- [ ] `qr-mesas/index.html` muestra las 20 tarjetas sin imágenes rotas.
- [ ] `opentype.js` y `@fontsource/fraunces` están solo en `devDependencies` y no aparecen en `dist/`; `qr-mesas/` sigue en `.gitignore`.

Página oculta de mesa (pendiente):

- [ ] Al decodificar `mesa-07/tarjeta.png` y `mesa-07/qr.png` con un lector de QR se obtiene exactamente `https://la-enriqueta.netlify.app/mesa.html?k={código}&n=7`; lo mismo con `mesa-01` y `mesa-20` y su número.
- [ ] Abrir `/mesa.html?k={código}&n=7` muestra el encabezado con "Mesa 7", el menú con las 11 pestañas, el banner de Viernes de Karaoke y el botón del carrito.
- [ ] Con `n=1`, `n=7` y `n=20` la página es idéntica salvo el número de mesa.
- [ ] Abrir `/mesa.html` sin parámetros, con `k` incorrecto, con `n=0`, `n=21`, `n=07` o `n=abc`, o con `k` correcto y sin `n`, muestra solo "Escanea el código QR de tu mesa para ver el menú." sin menú, banner ni enlaces.
- [ ] Con `VITE_MESA_KEY` indefinida, la página muestra siempre la pantalla neutra, aunque la URL traiga `k`.
- [ ] Recargar `/mesa.html?k={código}&n=7` sigue mostrando el menú; abrirla en una pestaña nueva sin parámetros muestra la pantalla neutra.
- [ ] La página de mesa no contiene Hero, "Nosotros", Galería, banner "Aquí te esperamos, en Tepic", Contacto, pie ni ningún enlace a `index.html`, `/` o `#inicio`; el logo del encabezado no es un enlace.
- [ ] `mesa.html` contiene `<meta name="robots" content="noindex, nofollow">` y no contiene etiquetas `og:`.
- [ ] `dist/index.html` no contiene `mesa.html`, y no hay enlaces, `sitemap` ni `robots.txt` del sitio que mencionen `mesa.html`.
- [ ] El código secreto no aparece en ningún archivo del repo; solo en `.env.local` (ignorado), en Netlify y en los QR impresos. `.env.example` tiene `VITE_MESA_KEY=` vacío.
- [ ] Agregar un producto en la página de mesa y abrir el carrito muestra "Pedido para la Mesa 7", solo "Nombre (opcional)" (sin teléfono, domicilio, ubicación ni selector de entrega), y el botón de enviar habilitado con carrito no vacío.
- [ ] El enlace de envío empieza con `https://wa.me/523111397571?text=`, su texto decodificado empieza con `¡Hola La Enriqueta! Pedido para la MESA 7:` y no contiene `Teléfono:`, `Entrega:`, `Domicilio:`, `Ubicación:` ni el código secreto.
- [ ] El panel del carrito no tiene el botón "Salir del modo mesa".
- [ ] En el sitio principal, `/?mesa=7` no muestra chip, franja ni cambios en el carrito, que sigue pidiendo nombre, teléfono y domicilio como en la SPEC 04.
- [ ] El script `generate:qrs` sin `--url`, sin `--key` o con una clave de menos de 16 o más de 32 caracteres, o con caracteres fuera de `[A-Za-z0-9_-]`, termina con código distinto de 0 y un mensaje que lo explica.
- [ ] A 375 px la página de mesa no tiene scroll horizontal y el encabezado muestra logo, "Mesa N" y el carrito sin superponerse.

## Decisiones

Tarjeta (implementada):

- **Sí:** PNG cuadrado de 1500 × 1500 px. Lo eligió el usuario; sirve para placas, stickers o insertarlo en otros diseños. A 12.7 cm de lado equivale a 300 dpi.
- **No:** PDF, A6 o A5. El usuario eligió PNG; si hace falta, va en otra spec.
- **Sí:** una carpeta por mesa con `qr.svg`, `qr.png` y `tarjeta.png`, y el script borra `qr-mesas/` antes de escribir. Carpeta generada e ignorada por git.
- **Sí:** paleta vino, naranja, dorado y crema de la marca; número de mesa grande en insignia; línea "Escanea para pedir desde tu mesa". Todo pedido por el usuario.
- **Sí:** QR negro sobre recuadro blanco, sin logo dentro ni colores de marca. La prioridad es que escanee con cualquier cámara y luz de restaurante.
- **No:** URL en texto en la tarjeta. El usuario pidió quitarla.
- **Sí:** textos a trazos con `opentype.js` + `@fontsource/fraunces`; woff (no woff2, que `opentype.js` no lee); serialización de los trazos a mano porque `toPathData` de `opentype.js` 2.0.0 emite `NaN`.
- **Sí:** rasterizar con `sharp`, ya instalado, sin sumar un navegador sin cabeza.

Página oculta (pendiente):

- **Sí:** el QR abre una página aparte (`mesa.html`) y no el sitio principal. Pedido del usuario: la página es oculta para el enlace de acceso principal y solo se llega con el QR de la mesa.
- **Sí:** segunda entrada de Vite con su propio HTML y `noindex, nofollow`. La página no comparte ruta ni navegación con el sitio, y no se indexa.
- **No:** ruta `/mesa/7` dentro de la misma app. Exige `netlify.toml` con redirect y deja la página oculta compartiendo punto de entrada con el sitio público.
- **Sí:** `mesa.html` en la URL en lugar de `/mesa`. Funciona igual en Netlify, `vite` y el `nginx` del `Dockerfile`, que reescribe todo a `index.html` y no resolvería `/mesa`; la URL más corta no compensa el riesgo de un QR que no abra.
- **Sí:** `k` (código) y `n` (mesa) en la URL; la mesa es el número, el código es el mismo para todas. Un solo código por local es suficiente: el objetivo es que la página no se encuentre ni se adivine, no distinguir mesas.
- **Sí:** el código vive en `VITE_MESA_KEY` (`.env.local` y variables de Netlify), no en el repo. El repo de GitHub es público; un código escrito en el código fuente dejaría de ser secreto.
- **Sí:** reconocer que es disuasión y no seguridad. El código viaja dentro del bundle de `mesa.html` y quien lea el JavaScript lo ve. Se acepta porque no hay backend y un pedido falso llega a WhatsApp, donde el negocio lo valida como cualquier otro. La protección real queda fuera de alcance.
- **Sí:** fallar cerrado: sin `VITE_MESA_KEY` o con valores incorrectos se muestra la pantalla neutra. Un despliegue sin la variable nunca deja la página abierta.
- **Sí:** la URL como única fuente de verdad, sin `sessionStorage` ni `localStorage` para la mesa. Revoca de la SPEC 06 el guardado de la mesa en sesión: era necesario cuando se limpiaba el parámetro de la URL; aquí se deja la URL intacta, la recarga funciona sin almacenamiento y desaparece el caso de `sessionStorage` bloqueado en navegadores integrados de cámara.
- **Sí:** retirar el modo mesa del sitio principal. Un solo punto de entrada a la mesa evita dejar una puerta pública (`/?mesa=N`) y código muerto. Los QR de la SPEC 06 (`/?mesa=N`) dejan de funcionar; por eso los QR se regeneran y reimprimen.
- **Sí:** la página incluye menú, banner de karaoke y carrito. Sin el carrito no se puede pedir, que es el motivo de los QR; el banner lo pidió el usuario.
- **Sí:** reutilizar `Menu`, `KaraokeBanner`, `CartButton`, `CartPanel` y `CartToast`. Mismo diseño y mismos precios que el sitio, sin duplicar código ni datos.
- **No:** Hero, Nosotros, Galería, banner de local, Contacto, pie ni navegación. El cliente ya está en el local y solo necesita el menú.
- **Sí:** insignia "Mesa N" en el encabezado de la página, no un chip flotante. Revoca el `TableChip` de la SPEC 06: el encabezado es mínimo, ya no hay barra recargada con la que se empalme.
- **Sí:** quitar "Salir del modo mesa". La página de mesa es independiente del sitio; no hay flujo normal al que volver.
- **Sí:** `useTable` con valor por defecto `{ table: null }`. Permite que `CartPanel` y `CustomerForm` sigan iguales en el sitio principal sin envolverlo en un proveedor que ya no existe.
- **No:** `netlify.toml`, `X-Robots-Tag` ni `robots.txt`. `robots.txt` revelaría la ruta de la página oculta; la meta `noindex` basta.

## Riesgos

| Riesgo                                                                                     | Mitigación                                                                                                                            |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| El código secreto es visible en el JavaScript de `mesa.html`                               | Aceptado y documentado: disuasión, no seguridad. Un pedido falso llega a WhatsApp, donde el negocio lo valida.                        |
| Alguien comparte la URL del QR (con `k`) fuera del restaurante                             | Aceptado; mismo mitigante. Para cortar el acceso se cambia el código, se redespliega y se reimprimen los QR.                          |
| `VITE_MESA_KEY` no está en Netlify o cambió en un despliegue y los QR impresos tienen otro | La página falla cerrada (pantalla neutra). Al cambiar el código hay que redesplegar y regenerar los QR; se probará `mesa-07` impresa. |
| QR de versión 5 o 6 (37 o 41 módulos) más difícil de escanear con módulos pequeños         | Celda de 18 px o más con 4 módulos de margen y QR de 666 px o más; el paso 10 decodifica la tarjeta y se imprime una prueba antes.    |
| `mesa.html` no se sirve en una plataforma con reescritura a `index.html`                   | Se usa `mesa.html` literal (Netlify y `vite` lo sirven tal cual); se verifica en el despliegue con el QR de una mesa.                 |
| Los QR de la SPEC 06 (`/?mesa=N`) ya impresos dejan de funcionar                           | Se avisa en esta spec; se reimprimen con la nueva URL.                                                                                |
| Una página de mesa sin enlaces a nada deja al cliente atrapado si quiere ver el sitio      | Es intencional; el sitio principal sigue accesible escribiendo la dirección.                                                          |
| El código aparece en el historial o en los logs del navegador de la persona                | Solo está en la URL del QR; el código no se escribe en la UI, en la consola ni en el mensaje de WhatsApp.                             |
| Colores de impresora distintos al vino de pantalla                                         | Fuera de alcance (sin perfil CMYK); se recomienda una prueba impresa de una sola mesa antes de imprimir las 20.                       |

## Qué **no** entra en esta spec

- Protección real de acceso: token validado en servidor, QR firmados, de un solo uso o con caducidad.
- `netlify.toml`, `X-Robots-Tag` y `robots.txt`.
- Hero, Nosotros, Galería, banner de local, Contacto o pie en la página de mesa.
- Pedidos a domicilio o para recoger desde la página de mesa.
- PDF, SVG de la tarjeta, otros tamaños, sangrado y CMYK.
- URL escrita en la tarjeta, logo o color de marca dentro del QR.
- Cambios en el menú, sus precios o el banner de karaoke.
