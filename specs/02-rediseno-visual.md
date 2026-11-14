# SPEC 02 — Rediseño visual moderno de Antojitos Tuxpeños

> **Estado:** Implementado.
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-14
> **Objetivo:** Rediseñar el layout, la tipografía y el copy de todas las secciones del sitio con una estética moderna y cálida, con toques tradicionales tuxpeños, conservando la paleta, los datos del negocio y las animaciones actuales.

## Por qué existe esta spec

El sitio actual se ve como una plantilla genérica de restaurante. La meta es que se sienta contemporáneo y con identidad propia de los Antojitos Tuxpeños: fotos protagonistas, mucho aire y tipografía con carácter, sin perder el papel picado ni la paleta vino/naranja/verde que ya identifican a La Enriqueta.

## Alcance

**Dentro:**

- Tipografía nueva: `Fraunces` (display, variable) e `Inter` (cuerpo) desde Google Fonts. Se elimina `Yeseva One`, `Work Sans` y `DM Mono` del `<link>` de `index.html` y de `@theme`.
- Tokens en `src/index.css`: se conservan los colores actuales (`wine`, `orange`, `green`, `gold`, `ink`, `cream`, `sand`, `line`, `muted`, `body`); se redefinen `--font-display` y `--font-sans`, se elimina `--font-mono` (las etiquetas mono pasan a `font-sans` en mayúsculas con tracking) y se añaden tokens de radio y sombra (`--radius-card`, `--shadow-card`) si hacen falta.
- Rediseño de layout y estilos de: `Header.tsx`, `Hero.tsx`, `Menu.tsx`, `About.tsx`, `Gallery.tsx`, `Contact.tsx`, `Footer.tsx` y `Photo.tsx` (placeholder acorde a la nueva paleta).
- Copy nuevo en encabezados, subtítulos y textos de sección, con tono tuxpeño y casero. Los textos viven en los componentes, no en `site.ts`.
- Uso de las fotos ya existentes en `public/img/` (ver Modelo de datos). Nombres de archivo ya confirmados por el usuario como suyos; no se descarga ni se genera ninguna imagen.
- Adaptar los `Reveal` y animaciones de la SPEC 01 a los nuevos layouts (mismos componentes, mismos parámetros).
- Diseño responsive: móvil primero, breakpoints en 560 px, 768 px y 1024 px como mínimo.
- Ampliación pedida durante la implementación: la galería pasa a 12 fotos solo de platillos y cada foto se abre en un visor (lightbox) que se cierra con clic fuera, botón × o `Esc`. El visor no lleva animación.

**Fuera de alcance (para specs futuras):**

- Cambiar precios, nombres de platillos, categorías, horarios, teléfono o dirección en `site.ts`.
- Animaciones nuevas más allá de adaptar las de la SPEC 01 (parallax, `AnimatePresence`, menú móvil animado, papel picado animado).
- Modo oscuro.
- Nuevas páginas, rutas, carrito de pedidos o pedido en línea.
- Optimización o recorte de las fotos (peso, formatos WebP/AVIF).
- Logo nuevo o cambio de identidad de marca.
- Internacionalización.

## Modelo de datos

Esta feature no introduce estructuras nuevas. Único cambio en `src/data/site.ts`: usar el campo opcional ya existente `image` de `Dish` y las `src` de `gallery` para apuntar a fotos que ya están en `public/img/`. No se modifican `name`, `price`, `options`, `unit`, `description` ni `category`.

Asignación de fotos (solo si el archivo coincide con el platillo; el resto sigue con el placeholder de `Photo`):

| Platillo                                             | Foto                              |
| ---------------------------------------------------- | --------------------------------- |
| Gorditas Estilo Tuxpan                               | `/img/platillo.jpg` (ya asignada) |
| Guacamole                                            | `/img/guacamole.jpeg`             |
| Pozole                                               | `/img/pozole.jpeg`                |
| Tostadas de Huesito                                  | `/img/tostada.jpeg`               |
| Tostadas de Pata                                     | `/img/tostada_p.jpeg`             |
| Burritos, Quesadillas, Rollitos Enriqueto, Chanfaina | sin foto (placeholder)            |

Galería: reemplazar los huecos sin `src` (`gal-2`, `gal-3`, `gal-6`, `gal-7`) por fotos de `public/img/` que correspondan (`sopes.jpg`, `pozole_v.jpeg`, `taco_dorado.jpeg`, `gete_local.jpg`), y conservar `id`, `hint` y `className` de cada celda.

Convenciones visuales:

- Fuente display: `Fraunces`, pesos 500–700, para `h1`/`h2` y precios.
- Fuente cuerpo: `Inter`, pesos 400/500/600.
- Radio de tarjetas e imágenes: 20–28 px; botones en forma de píldora (como ahora).
- Papel picado: se mantiene solo en el Hero y como divisor entre secciones clave; no se repite en todas.

## Plan de implementación

1. Cambiar las fuentes: actualizar el `<link>` de Google Fonts en `index.html` y `--font-display`/`--font-sans` en `src/index.css`; retirar `--font-mono` y reemplazar sus usos por `font-sans uppercase tracking-[0.2em]`. Verificar: `npm run dev` carga con las fuentes nuevas y sin errores en consola.
2. Añadir tokens de radio y sombra en `@theme` y rediseñar `Photo.tsx` (placeholder con paleta cálida). Verificar: `npm run typecheck`.
3. Rediseñar `Header.tsx` (logo, enlaces, CTA WhatsApp, menú móvil), manteniendo el cambio de fondo con `scrollY > 8` de la SPEC 01. Verificar: los enlaces `#menu`, `#galeria`, etc. siguen llevando a su sección.
4. Rediseñar `Hero.tsx`: nuevo layout, copy y jerarquía, manteniendo `PapelPicado`, la entrada en cascada y los CTA. Verificar: el `h1` conserva el texto "La Enriqueta" y "Antojitos Tuxpeños".
5. Rediseñar `Menu.tsx`: tarjetas y filtros de categoría nuevos, con foto cuando el platillo tiene `image`. Verificar: filtrar por categoría muestra solo sus platillos.
6. Añadir las rutas de foto en `src/data/site.ts` según la tabla del modelo de datos. Verificar: `npm run typecheck` y las fotos se ven en el menú.
7. Rediseñar `About.tsx` con copy nuevo. Verificar: sección visible y responsive en 375 px y 1280 px.
8. Rediseñar `Gallery.tsx` y completar las `src` de la galería. Verificar: no quedan celdas con placeholder de las 7 definidas.
9. Rediseñar `Contact.tsx` (horarios, mapa, WhatsApp, teléfono) y `Footer.tsx`. Verificar: el CTA abre `wa.me/523115130988` y el mapa carga.
10. Ajustar `src/App.test.tsx` solo si algún test falla por el nuevo copy o estructura.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test` y `npm run build` terminan sin errores.
- [ ] `index.html` carga únicamente `Fraunces` e `Inter` de Google Fonts; no quedan referencias a `Yeseva One`, `Work Sans` ni `DM Mono` en `index.html`, `src/index.css` ni `src/**`.
- [ ] Los colores definidos en `@theme` de `src/index.css` (`wine`, `orange`, `green`, `gold`, `ink`, `cream`, `sand`, `line`, `muted`, `body`) conservan sus valores hexadecimales actuales.
- [ ] `git diff` de `src/data/site.ts` no muestra cambios en `name`, `price`, `options`, `unit`, `description`, `category`, `hours`, `phone`, `whatsapp` ni `addressLines`.
- [ ] Los 9 platillos y las 2 categorías (más "Todo") siguen apareciendo en el menú, y cada filtro muestra solo sus platillos.
- [ ] Los platillos de la tabla del modelo de datos muestran su foto en la tarjeta.
- [ ] Las 7 celdas de la galería muestran una foto real.
- [ ] Ninguna sección produce scroll horizontal a 375 px de ancho.
- [ ] Los enlaces del header llevan a `#inicio`, `#menu`, `#nosotros`/`#galeria`/`#contacto` (los `id` actuales) y los CTA abren `https://wa.me/523115130988`.
- [ ] Los `Reveal` y las animaciones de la SPEC 01 siguen funcionando; con `prefers-reduced-motion: reduce` el contenido se ve de inmediato.
- [ ] Ninguna dependencia nueva en `package.json`.

## Decisiones

- **Sí:** una sola spec para todo el rediseño. Garantiza coherencia visual; el plan por componentes mantiene cada paso commiteable.
- **Sí:** dirección "moderno cálido con toques tradicionales". Es moderno sin perder la identidad de fonda tuxpeña.
- **No:** estética oscura/gourmet ni editorial saturada. Alejan la marca de su carácter casero.
- **Sí:** conservar la paleta actual. Es la identidad de color existente; solo se renueva tipografía y composición.
- **Sí:** `Fraunces` + `Inter`. Serif cálida con carácter para títulos y cuerpo muy legible; ambas gratuitas y variables.
- **No:** `Bricolage Grotesque` + `DM Sans`. Más contemporánea pero menos cálida.
- **Sí:** copy nuevo en los componentes y `site.ts` intacto en precios y datos. Permite cambiar el tono sin riesgo de alterar información comercial.
- **Sí:** reusar las fotos ya presentes en `public/img/`. El usuario indicó que ya las tiene en esa carpeta.
- **Sí:** mantener `motion` y `Reveal` sin animaciones nuevas. La SPEC 01 ya cubre el movimiento; mezclarlo con el rediseño ampliaría el alcance.
- **Sí:** retirar `font-mono`. Tres familias recargan; las etiquetas se resuelven con Inter en mayúsculas.

## Riesgos

| Riesgo                                                     | Mitigación                                                                                                 |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Fotos de `public/img/` pesadas o con proporciones dispares | Usar `object-cover` con proporciones fijas en las tarjetas; la optimización queda fuera de alcance.        |
| Nombres de foto que no corresponden al platillo asignado   | Solo se asigna donde el nombre coincide; revisar visualmente en el paso 6 y dejar placeholder si hay duda. |
| Tests de `App.test.tsx` que buscan el copy actual          | Paso 10 contempla ajustarlos; los textos de `site.ts` (nombre, tagline) no cambian.                        |
| Cambio de fuente altera métricas y rompe layouts ajustados | Verificar a 375 px y 1280 px en cada paso; usar `font-display` solo en títulos y precios.                  |
| `Reveal` (transform) en contenedores `sticky` del header   | No aplicar `Reveal` al header, igual que en la SPEC 01.                                                    |

## Qué **no** entra en esta spec

- Cambios de precios, platillos, categorías, horarios o datos de contacto.
- Animaciones nuevas, parallax o menú móvil animado.
- Modo oscuro.
- Logo o identidad de marca nueva.
- Optimización de imágenes.
- Pedido en línea, carrito o nuevas páginas.
