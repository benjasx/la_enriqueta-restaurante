# SPEC 08 — Menú rediseñado para la página de mesa

> **Estado:** Implementado.
> **Depende de:** SPEC 03, SPEC 04, SPEC 07
> **Fecha:** 2026-11-16
> **Objetivo:** Rediseñar la página oculta `mesa.html` según el diseño "Menu La Enriqueta" de Claude Design (hero, menú con todas las categorías seguidas y pestañas ancladas, banda de karaoke y barra flotante del pedido), sin cambiar el sitio principal.

## Por qué existe esta spec

La página de mesa de la SPEC 07 reutiliza el `Menu` y el `KaraokeBanner` del sitio: una sola categoría visible a la vez, tarjetas apretadas y sin hero. El usuario preparó en Claude Design un diseño pensado para pedir desde la mesa. Esta spec lo lleva a React y Tailwind **solo en `mesa.html`**, con componentes propios, de modo que el sitio principal no cambia.

Esta spec **revoca** de la SPEC 07, únicamente para la página de mesa:

- La exclusión del Hero: ahora lleva un hero "¿Qué se te antoja hoy?".
- El reúso de `Menu` (11 pestañas con filtro) y de `KaraokeBanner` (solo imagen): se sustituyen por `MesaMenu` y `MesaKaraoke`.
- El criterio de que la página no tiene ningún enlace: ahora tiene enlaces de ancla internos (`#menu`, `#karaoke`, `#<categoría>`), pero sigue sin ningún enlace al sitio principal ni a otras páginas.

Se conserva de la SPEC 07 el acceso con código, la insignia "Mesa N", el modo mesa del carrito (nombre opcional, mensaje "Pedido para la MESA N") y la exclusión de Galería, Contacto, pie y navegación.

## Alcance

**Dentro:**

- Todo el cambio de aspecto vive solo en la página de mesa: `src/MesaApp.tsx` y componentes nuevos; el sitio principal y sus componentes (`Menu`, `KaraokeBanner`, `Header`, `Hero`…) no se tocan.
- Tipografía y paleta del diseño solo en `mesa.html`: Young Serif (títulos) y Figtree (texto), con las variables definidas en `src/mesa.css` bajo la clase `.mesa-theme`.
- `MesaHero`: etiqueta "Antojitos · Tragos · Karaoke", título "¿Qué se te antoja hoy?", párrafo, cuatro rombos de colores, botones "Ver el menú" (`#menu`) y "Viernes de karaoke" (`#karaoke`), y un collage de tres fotos (`/img/pozole.webp`, `/img/tostada.webp`, `/img/agua-fresca.webp`).
- `MesaMenu`:
  - Barra de pestañas pegajosa bajo el encabezado, con las 11 categorías y su número de platillos; cada pestaña es un enlace de ancla a su sección.
  - Las 11 categorías seguidas en una sola página, cada una con título y "N platillos".
  - Tarjeta por platillo: foto de 210 px si `image` existe, nombre, precio (`priceLabel`) y porción (`unit`), descripción, nota, y una fila por opción con su etiqueta, su descripción y su botón de agregar.
  - Licores con botella: dos botones por fila, "Copeo" y "Botella".
  - El botón muestra "Agregar +" y, tras agregar, "N en pedido" en verde; se deshabilita en 20 unidades.
  - Aviso de alérgenos (`menuNotice`) y de precios (`menuDisclaimer`) al final del menú.
- `MesaKaraoke`: banda vino oscuro con el flyer (`/img/karaoke.webp`), "Todos los viernes", "Viernes de karaoke", el texto del diseño y el botón "Ver coctelería" (`#cocteleria`).
- `MesaCartBar`: barra flotante inferior con "N producto(s)", el total, "Vaciar" y "Ver pedido", que abre el `CartPanel` actual; visible solo con el carrito no vacío y oculta con el panel abierto.
- `MesaHeader` restilizado como el del diseño: logo de 40 px y nombre, insignia "Mesa N" y el `CartButton` actual; sin enlaces.
- El carrito, el panel, el mensaje de WhatsApp, `CartToast` y el acceso con código se conservan sin cambios.
- Tests actualizados de `MesaApp` y nuevos de `MesaMenu`.

**Fuera de alcance (para specs futuras):**

- Cambios en el sitio principal: `Menu`, `KaraokeBanner`, `Header`, `Hero`, tipografías, colores y `index.html`.
- Galería, pie, Contacto y enlaces de navegación (Menú, Galería) del encabezado en la página de mesa.
- Que la pestaña activa cambie al hacer scroll (resaltado por posición); las pestañas solo saltan a su sección.
- Cambios en `src/data/menu.ts`, precios, categorías o fotos de platillos.
- Cambios en el `CartPanel`, `CartButton`, el mensaje de WhatsApp o el acceso con código.
- El envío directo a WhatsApp de la barra flotante del diseño: la barra abre el panel actual.
- `image-slot`, `support.js` y cualquier otro elemento del prototipo de Claude Design (no se portan).
- Imágenes nuevas: se usan las que ya están en `public/img/`.

## Modelo de datos

Esta feature no introduce estructuras de datos nuevas. El menú sigue saliendo de `src/data/menu.ts` (`categories`, `menu`, `priceLabel`, `money`, `menuNotice`, `menuDisclaimer`) y el carrito de `useCart`. `menu-data.js` del diseño es la misma carta y no se usa.

Variables de estilo solo para la página de mesa (`src/mesa.css`), aplicadas en el elemento raíz `.mesa-theme` de `MesaApp`:

```css
.mesa-theme {
  --font-display: "Young Serif", serif;
  --font-sans: "Figtree", system-ui, sans-serif;
  --color-wine: #a8185a;
  --color-orange: #d9622b;
  --color-green: #2f6b3a;
  --color-gold: #d4a63a;
  --color-ink: #3a1d22;
  --color-body: #5a3a3f;
  --color-muted: #8a6f72;
  --color-cream: #fcf6ef;
  --color-sand: #f3e6d9;
  --color-line: #ecdccb;
}
html {
  scroll-padding-top: 150px;
} /* pestañas pegajosas; scroll-behavior: smooth salvo prefers-reduced-motion */
```

Convenciones:

- Los ids de ancla son `menu`, `karaoke` y el `CategoryId` de cada categoría (`especialidades`, `cocteleria`, …).
- Los componentes nuevos leen las variables con las utilidades de Tailwind ya existentes (`font-display`, `bg-wine`, `text-body`…); como las variables se redefinen en `.mesa-theme`, el `CartPanel` y el `CartButton` compartidos adoptan la tipografía y la paleta del diseño solo dentro de la página de mesa.
- El botón de una fila usa la línea del carrito: la clave es `lineKey({ itemId, optionLabel, size })` y la cantidad se lee de `state.lines`.
- Copeo y Botella conservan los nombres de la SPEC 04 (no "Copa").

Archivos que aparecen o cambian:

| Archivo                            | Cambio                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| `mesa.html`                        | Carga Young Serif y Figtree en lugar de Fraunces e Inter                              |
| `src/mesa.css`                     | Nuevo. Variables `.mesa-theme` y `scroll-padding-top`                                 |
| `src/mesa-main.tsx`                | Importa `./mesa.css` después de `./index.css`                                         |
| `src/MesaApp.tsx`                  | Envuelve en `.mesa-theme`; monta `MesaHero`, `MesaMenu`, `MesaKaraoke`, `MesaCartBar` |
| `src/components/MesaHeader.tsx`    | Restilizado como el encabezado del diseño                                             |
| `src/components/MesaHero.tsx`      | Nuevo. Hero con collage de tres fotos                                                 |
| `src/components/MesaMenu.tsx`      | Nuevo. Pestañas pegajosas, categorías seguidas y tarjetas con filas                   |
| `src/components/MesaKaraoke.tsx`   | Nuevo. Banda de karaoke                                                               |
| `src/components/MesaCartBar.tsx`   | Nuevo. Barra flotante del pedido                                                      |
| `src/MesaApp.test.tsx`             | Se ajusta: enlaces de ancla, pestañas como enlaces, hero, banda y barra               |
| `src/components/MesaMenu.test.tsx` | Nuevo. Tests de pestañas, secciones, filas y estados del botón                        |
| `specs/07-tarjeta-qr-por-mesa.md`  | Nota breve que remite a esta spec en lo que revoca                                    |

## Plan de implementación

1. Crear `src/mesa.css` con `.mesa-theme` y `scroll-padding-top`, importarlo en `src/mesa-main.tsx`, envolver `MesaApp` en `.mesa-theme` y cambiar `mesa.html` a Young Serif y Figtree. Verificar: `npm run build`; `dist/mesa.html` enlaza las dos fuentes y `dist/index.html` no; en `/mesa.html?k=…&n=7` los títulos salen en Young Serif y el sitio principal sigue igual.
2. Crear `MesaHero.tsx` y montarlo bajo el encabezado, antes del menú. Verificar: `npm run dev` a 375 px y 1280 px; "Ver el menú" salta a `#menu`.
3. Crear `MesaMenu.tsx` con la barra de pestañas pegajosa (11 enlaces con conteo), las 11 secciones y tarjetas con foto, nombre, precio, descripción, nota y filas con botón "Agregar +" que agrega a la línea del carrito; sustituir `Menu` por `MesaMenu` en `MesaApp.tsx`. Verificar: agregar "Pozole · Mediano" sube el contador del carrito; cada pestaña salta a su sección.
4. Completar las filas: estado "N en pedido" en verde, botón deshabilitado en 20, botones Copeo y Botella en licores, y el aviso de alérgenos y precios al final. Verificar: Black Label agrega Copeo y Botella como dos líneas; "Whisky de la casa" solo ofrece Copeo.
5. Crear `MesaKaraoke.tsx` y sustituir `KaraokeBanner` en `MesaApp.tsx`. Verificar: la banda sale tras el menú y "Ver coctelería" salta a `#cocteleria`.
6. Crear `MesaCartBar.tsx` y montarla en `MesaApp.tsx`, visible solo con el carrito no vacío y oculta con el panel abierto. Verificar: agregar un producto muestra la barra con total y "Ver pedido" abre el panel; "Vaciar" deja el carrito en cero y la barra desaparece.
7. Restilizar `MesaHeader.tsx` como el encabezado del diseño. Verificar: a 375 px el logo, "Mesa N" y el carrito caben sin superponerse.
8. Ajustar `src/MesaApp.test.tsx` y crear `src/components/MesaMenu.test.tsx`; añadir a `specs/07-tarjeta-qr-por-mesa.md` la nota de lo revocado. Verificar: `npm test`, `npm run lint`, `npm run build`.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` terminan sin errores; `format:check` no falla por los archivos tocados.
- [ ] El sitio principal no cambia: `Menu.tsx`, `KaraokeBanner.tsx`, `Header.tsx`, `Hero.tsx`, `App.tsx` e `index.html` no tienen diferencias respecto a la rama anterior, y `dist/index.html` no enlaza Young Serif ni Figtree.
- [ ] `dist/mesa.html` enlaza Young Serif y Figtree, y sigue conteniendo `noindex` y ninguna etiqueta `og:`.
- [ ] El acceso con código no cambia: con `k` o `n` inválidos solo se ve la pantalla neutra, sin hero, menú ni barra.
- [ ] Con acceso válido la página muestra, en este orden: encabezado, hero, pestañas y menú, banda de karaoke; y no contiene Galería, pie, Contacto ni el banner "Aquí te esperamos, en Tepic".
- [ ] El encabezado muestra logo, nombre, insignia "Mesa N" y el botón del carrito; el logo no es un enlace.
- [ ] El hero muestra "¿Qué se te antoja hoy?", los botones "Ver el menú" y "Viernes de karaoke", y tres fotos.
- [ ] La barra de pestañas tiene 11 enlaces (uno por categoría, en el orden de `categories`) con su número de platillos; cada uno apunta a `#<id de la categoría>` y la barra queda pegada bajo el encabezado al hacer scroll.
- [ ] Las 11 categorías aparecen seguidas en la página con su título y "N platillos"; el total de tarjetas es 57 y cada tarjeta muestra nombre, precio y descripción.
- [ ] Una tarjeta con `image` muestra su foto; una sin `image` no muestra recuadro de foto vacío.
- [ ] Las notas de los platillos (por ejemplo la de chilaquiles en Platos Fuertes) y las descripciones de las opciones se muestran.
- [ ] Tras el menú aparecen los textos `menuNotice` y `menuDisclaimer`.
- [ ] Pulsar "Agregar +" en "Pozole · Mediano" agrega una línea al carrito, el botón pasa a "1 en pedido" y pulsar de nuevo lo deja en "2 en pedido".
- [ ] Un botón llega a "20 en pedido" y queda deshabilitado.
- [ ] Black Label ofrece "Copeo" y "Botella", cada uno agrega una línea distinta; "Whisky de la casa", "Tequila de la Casa" y "Mezcal de la Casa" solo ofrecen "Copeo".
- [ ] La banda de karaoke muestra el flyer `/img/karaoke.webp` con texto alternativo "Viernes de Karaoke…", "Todos los viernes" y "Ver coctelería", que salta a `#cocteleria`.
- [ ] La barra flotante no se ve con el carrito vacío; con productos muestra "N producto(s)" y el total en MXN, y no se ve con el panel abierto.
- [ ] "Ver pedido" de la barra abre el `CartPanel` ("Pedido para la Mesa N", solo "Nombre (opcional)"); "Vaciar" deja el carrito en 0 líneas.
- [ ] El enlace de envío empieza con `https://wa.me/523111397571?text=`, su texto empieza con `¡Hola La Enriqueta! Pedido para la MESA N:` y no contiene `Teléfono:`, `Entrega:`, `Domicilio:`, `Ubicación:` ni el código secreto.
- [ ] La página no tiene enlaces a otras páginas ni al sitio principal: todos sus enlaces son de ancla (`href` que empieza con `#`) y los de WhatsApp del panel.
- [ ] `src/data/menu.ts` no cambia y un cambio de precio ahí se refleja en `MesaMenu` y en el mensaje sin tocar la página.
- [ ] A 375 px la página no tiene scroll horizontal, la barra de pestañas se desplaza horizontalmente por dentro, y el encabezado, la barra flotante y el panel no se superponen.
- [ ] Con `prefers-reduced-motion: reduce` los saltos de ancla no se animan.
- [ ] No hay dependencias nuevas en `package.json`.

## Decisiones

- **Sí:** rediseñar solo `mesa.html`. Pedido del usuario: "sin cambiar el menú del sitio principal".
- **Sí:** componentes nuevos (`MesaMenu`, `MesaHero`, `MesaKaraoke`, `MesaCartBar`) en lugar de parametrizar `Menu`. `Menu` está acoplado a su layout de pestañas con filtro y al sitio; una variante con banderas ensuciaría los dos.
- **Sí:** hero incluido. Elegido por el usuario entre las opciones de alcance; revoca la exclusión del Hero de la SPEC 07.
- **No:** galería, pie y enlaces de navegación. El usuario eligió "menú, banda de karaoke y hero"; en un restaurante donde ya están sentados no aportan.
- **Sí:** todas las categorías seguidas con pestañas ancladas. Es lo que muestra el diseño y se hojea mejor en el celular; la página es más larga, aceptado.
- **No:** mantener el filtro por pestaña. Menos fiel al diseño.
- **Sí:** pestañas como enlaces de ancla y sin resaltado por scroll. Lo que muestra el diseño; el resaltado añade un `IntersectionObserver` y estado que no pidió nadie.
- **Sí:** barra flotante del diseño que abre el panel actual. Elegido por el usuario: conserva cantidades, nota, nombre y el mensaje "Pedido para la MESA N" de las SPEC 04 y 06.
- **No:** envío directo a WhatsApp desde la barra, como en el diseño. Perdería la mesa en el mensaje, que es el objetivo del QR.
- **Sí:** tipografía y paleta del diseño (Young Serif, Figtree, vino `#a8185a`) solo en la página de mesa, con variables bajo `.mesa-theme`. Elegido por el usuario; el sitio principal y la tarjeta del QR siguen con Fraunces y su paleta, una pequeña diferencia de marca aceptada.
- **Sí:** que `CartPanel` y `CartButton` adopten la tipografía y paleta del diseño dentro de la página. Es consecuencia de las variables; evita componentes duplicados y mantiene coherencia visual en la página.
- **Sí:** `CartToast` se conserva. No está en el diseño, pero sigue confirmando cada adición con el panel cerrado; quitarlo cambiaría el comportamiento de la SPEC 04.
- **Sí:** "Copeo" y "Botella" como en la SPEC 04, no "Copa" como en el prototipo.
- **Sí:** datos desde `src/data/menu.ts`, no de `menu-data.js`. Es la misma carta; un solo origen evita que se desincronicen.
- **No:** portar `image-slot`, `support.js` ni el número de WhatsApp de ejemplo del diseño (`5210000000000`). Son andamiaje del prototipo; el número real sale de `site.whatsapp`.
- **Sí:** las fotos del hero salen de `public/img/` (`pozole`, `tostada`, `agua-fresca`) y el flyer es `karaoke.webp`. Ya existen; las del prototipo eran marcadores vacíos.
- **Sí:** el logo del encabezado sigue sin ser un enlace. El diseño lo enlaza a `#inicio`; se mantiene la regla de la SPEC 07 de no dejar rutas hacia fuera ni anclas del sitio.

## Riesgos

| Riesgo                                                                               | Mitigación                                                                                                                   |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| La tipografía y la paleta del diseño se filtran al sitio principal                   | Variables solo bajo `.mesa-theme`, CSS importado solo desde `mesa-main.tsx`; criterio de aceptación sobre `dist/index.html`. |
| Página larga (57 tarjetas con fotos) lenta en el celular                             | Las fotos van con `loading="lazy"`; no hay animaciones por tarjeta.                                                          |
| Las pestañas pegajosas quedan tapadas por el encabezado o salen mal al saltar        | `scroll-padding-top: 150px` y `top` de la barra igual a la altura del encabezado; se revisa a 375 px en el paso 3.           |
| `CartPanel` y `CartButton` se ven distintos con la nueva tipografía y colores        | Se revisan en el paso 6; si hay desajustes, se ajustan las variables y no los componentes.                                   |
| La barra flotante tapa el final de la página o el botón de agregar                   | Margen inferior en la página igual a la altura de la barra cuando está visible.                                              |
| El criterio de "sin enlaces" de la SPEC 07 y su test chocan con los enlaces de ancla | El test se ajusta en el paso 8: se prohíben enlaces que no empiecen con `#`; la nota en la SPEC 07 lo deja registrado.       |
| Dos pantallas de pedido (barra y panel) confunden                                    | La barra solo resume y abre el panel; el envío vive en un único lugar.                                                       |

## Qué **no** entra en esta spec

- Cambios en el sitio principal (`Menu`, `KaraokeBanner`, `Header`, `Hero`, `index.html`).
- Galería, pie, Contacto y navegación en la página de mesa.
- Resaltado de la pestaña activa por scroll.
- Cambios en la carta, precios, categorías o fotos de platillos.
- Cambios en el carrito, el panel, el mensaje de WhatsApp o el acceso con código.
- Envío directo a WhatsApp desde la barra flotante.
- Elementos del prototipo de Claude Design (`image-slot`, `support.js`).
