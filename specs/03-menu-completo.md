# SPEC 03 — Menú digital completo con pestañas por categoría

> **Estado:** implementado
> **Depende de:** SPEC 02
> **Fecha:** 2026-11-14
> **Objetivo:** Reemplazar el menú de 9 platillos por el menú oficial completo de La Enriqueta (comida, coctelería, cervezas, licores y vinos, precios en MXN), con datos tipados en `src/data/menu.ts`, pestañas navegables desde el celular y botón de pedido por WhatsApp con el producto y el precio exactos.

## Por qué existe esta spec

El menú actual en `src/data/site.ts` tenía 9 platillos con precios que ya no coinciden con la carta oficial (por ejemplo, Gorditas Estilo Tuxpan pasa de $90/$90/$95 a $70/$80/$85). Esta spec sustituye esos datos y **revoca** la exclusión de la SPEC 02 que dejaba fuera "cambiar precios, nombres de platillos y categorías".

Después de implementar los pasos 1 a 7 llegó el documento oficial completo (`specs/menu-la-enriqueta.md`), que trae precio individual de cada coctel y cerveza, tragos clásicos, licores y vinos. Esta versión de la spec lo incorpora (pasos 8 a 13) y **sustituye** el criterio anterior de "cocteles y cervezas como grupo con rango de precio".

## Alcance

**Dentro:**

- Archivo `src/data/menu.ts` con tipos, categorías y todos los productos del menú oficial. Fuente de verdad de precios y descripciones: `specs/menu-la-enriqueta.md`.
- Mover `public/menu-la-enriqueta.md` a `specs/menu-la-enriqueta.md`, para que Vite no lo publique con las notas internas de pendientes.
- Retirar de `src/data/site.ts` lo obsoleto (`CategoryId`, `Dish`, `categories`, `categoryTag`, `dishes`, `minPrice`); se conservan `site`, `whatsappUrl` y `gallery`.
- `Menu.tsx` con 8 pestañas, sin "Todo", que abre en "Especialidades de la Casa" y hace scroll horizontal en móvil:
  1. Especialidades de la Casa
  2. Antojitos Tradicionales (incluye Tacos Dorados, Sopes, Enchiladas y Sincronizadas, como en el documento)
  3. Entradas
  4. Para Acompañar y Extras
  5. Postres
  6. Bebidas (sin alcohol)
  7. Coctelería y Cervezas
  8. Licores y Vinos
- Tarjeta por producto con nombre, descripción y precio en MXN. Cada variedad (opción, coctel, cerveza, marca) es una fila con su botón "Pedir"; el mensaje de WhatsApp lleva el producto, la variedad, la porción y el precio exacto.
- Licores: cada marca muestra "Copeo" y "Botella" con su precio y su botón propio; las marcas "de la casa" solo llevan copeo.
- Tarjetas "anchas" (sin foto, a todo el ancho, filas en 2 o 3 columnas) para los grupos largos: Mocktails, cada familia de cocteles, Tragos Clásicos, Cervezas, cada familia de licores y Vinos Tintos.
- Texto de recomendación del documento (platillos tal cual la descripción, avisar alergias) al pie del menú.
- Variantes sin precio propio (carne del pozole, gorditas suaves o doradas, relleno de la sincronizada especial) como texto informativo.
- Conservar lo que el documento no menciona: Postres (6), Aguas Frescas, Limonadas y Naranjadas, Bebidas Calientes y Mocktails.
- Fotos de `public/img/` solo donde el archivo corresponde al platillo; el resto usa el placeholder de `Photo`.
- Mantener `Reveal` y las animaciones de las SPEC 01 y 02, sin animaciones nuevas.

**Fuera de alcance (para specs futuras):**

- Selector de carne o de variante dentro de la tarjeta, carrito o pedido en línea.
- Buscador y filtros por ingrediente o precio.
- Fotos nuevas, recorte u optimización de imágenes.
- La segunda "Miche Poderosa" (cerveza con jugo de mango, piña o tamarindo): entra cuando el cliente confirme su nombre.
- Cambios en `Header`, `Hero`, `About`, `Gallery`, `Contact`, `Footer` o en los datos de `site`.
- Menú en PDF o versión imprimible.

## Modelo de datos

Todo en `src/data/menu.ts`. Los precios son enteros en MXN.

```ts
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
  price: number; // precio de la porción; en licores, el copeo
  description?: string; // texto corto bajo la etiqueta (cocteles)
  bottlePrice?: number; // solo licores: precio de botella
};

export type MenuItem = {
  id: string; // slug único, p. ej. "torta-ahogada"
  category: CategoryId;
  name: string;
  description: string;
  unit?: string; // "1 pieza", "5 piezas", "orden"
  image?: string; // "/img/torta.jpeg"
  price?: number; // precio único, sin variedades
  options?: PriceOption[]; // variedades con su precio
  note?: string; // texto informativo: carnes, restricciones, copeo
  wide?: boolean; // tarjeta ancha, sin foto, para grupos largos
};

export const categories: { id: CategoryId; label: string }[];
export const menu: MenuItem[];
export const menuNotice: string; // recomendación del documento
export const money: (n: number) => string; // 2499 → "$2,499"
export const priceLabel: (item: MenuItem) => string; // "$80", "desde $55"
```

Se eliminan `names` y `priceRange`: con precio individual para todo ya no hacen falta.

Reglas:

- Un `MenuItem` tiene `price` u `options`, nunca ambos.
- `bottlePrice` solo aparece en filas de la categoría `licores`.
- Los mocktails pasan a 7 opciones de $89 (misma variedad, ahora con fila y botón).
- Formato del mensaje de WhatsApp por fila: `¡Hola La Enriqueta! Quiero ordenar: {producto} – {variedad} ({porción}) – {precio} MXN`; en licores, la variedad lleva "Copeo" o "Botella" y el precio correspondiente. Sin `unit`, se omite la porción.
- El orden de `menu` es el orden de aparición dentro de cada pestaña.

Contenido por categoría (precios y descripciones: `specs/menu-la-enriqueta.md`):

| Categoría (`id`)                             | Tarjetas | Qué contiene                                                                                                               |
| -------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Especialidades de la Casa (`especialidades`) | 3        | El Especial La Enriqueta, Torta Ahogada, Pollo a La Enriqueta                                                              |
| Antojitos Tradicionales (`tradicionales`)    | 6        | Pozole, Tostadas, Tacos Dorados, Sopes, Enchiladas, Sincronizadas                                                          |
| Entradas (`entradas`)                        | 5        | Gorditas, Burritos, Quesadillas, Rollitos Enriqueto, Guacamole                                                             |
| Para Acompañar y Extras (`extras`)           | 3        | Pieza de Pollo Dorado, Papa Dorada, Extras                                                                                 |
| Postres (`postres`)                          | 6        | Sin cambios respecto a los pasos 1 a 7                                                                                     |
| Bebidas (`bebidas`)                          | 4        | Aguas Frescas, Limonadas y Naranjadas, Bebidas Calientes, Mocktails (Mocktails pasa a filas)                               |
| Coctelería y Cervezas (`cocteleria`)         | 7        | Cocteles con Tequila (4), Vodka (2), Cerveza (2), Mezcal (3), Ron (5); Tragos Clásicos $99 (12); Cervezas Comerciales (14) |
| Licores y Vinos (`licores`)                  | 6        | Whisky (5), Ron (2), Tequila (8), Mezcal (2), Brandy y Coñac (2), Vinos Tintos (3)                                         |

Total: 40 tarjetas.

Asignación de fotos (el resto queda con placeholder):

| Platillo                    | Foto                    |
| --------------------------- | ----------------------- |
| Torta Ahogada Estilo Tuxpan | `/img/torta.jpeg`       |
| Pozole                      | `/img/pozole.jpeg`      |
| Tostadas                    | `/img/tostada.jpeg`     |
| Guacamole                   | `/img/guacamole.jpeg`   |
| Tacos Dorados               | `/img/taco_dorado.jpeg` |
| Sopes                       | `/img/sopes.jpg`        |
| Pieza de Pollo Dorado       | `/img/pollo_frito.jpeg` |
| Tarta de elote              | `/img/tarta_elote.png`  |
| Brownie                     | `/img/brownie.png`      |
| Plátanos fritos             | `/img/platanitos.jpeg`  |

`platillo.jpg` (plato de carne, no gorditas) y `tragos.jpg` (lleva texto de promoción) se descartaron tras revisarlas.

## Plan de implementación

1. Crear `src/data/menu.ts` con los tipos, `categories`, `priceLabel` y las primeras categorías. Verificar: `npm run typecheck`. _(hecho)_
2. Completar `menu` con `extras`, `postres` y `bebidas`. Verificar: `npm run typecheck`. _(hecho)_
3. Cambiar `Menu.tsx` para leer de `src/data/menu.ts` y limpiar `src/data/site.ts`. Verificar: `npm run typecheck`; cada pestaña muestra sus platillos. _(hecho)_
4. Ajustar la tarjeta: precio, filas "Pedir", `note`. _(hecho)_
5. Asignar fotos y revisarlas. _(hecho)_
6. Pestañas con scroll horizontal y pestaña activa visible. _(hecho)_
7. Ajustar `src/App.test.tsx`. _(hecho)_
8. Mover `public/menu-la-enriqueta.md` a `specs/menu-la-enriqueta.md`. Verificar: `npm run build` no deja `menu-la-enriqueta.md` en `dist/`.
9. En `src/data/menu.ts`: añadir `description?`, `bottlePrice?` y `wide?` a los tipos, `money` y `menuNotice`; pasar de 7 a 8 categorías (`tacos` desaparece y sus 4 productos pasan a `tradicionales`; `bebidas` queda sin alcohol; aparece `cocteleria`); actualizar las descripciones de comida al texto del documento. Verificar: `npm run typecheck`.
10. Reemplazar en `menu.ts` Mocktails, Cocteles y Cervezas por grupos con `options` y `wide` (cocteles por familia con su descripción, más Tragos Clásicos y Cervezas Comerciales); eliminar `names` y `priceRange` de los tipos. En `Menu.tsx`: tarjeta ancha (sin foto, `col-span-full`, filas en columnas) controlada por `wide`, `description` bajo la etiqueta de la fila y mensaje sin la rama de "por confirmar". Verificar: `npm run typecheck`; las filas de coctelería muestran su precio exacto.
11. Añadir a `menu.ts` los licores y vinos (6 tarjetas, `licores`) y en `Menu.tsx` la fila de dos botones "Copeo" y "Botella" con `money`. Verificar: Black Label muestra Copeo $170 y Botella $2,499; "Whisky de la casa" solo copeo.
12. Mostrar `menuNotice` al pie de `Menu.tsx`, junto a la nota de precios. Verificar: el texto aparece bajo las tarjetas de cualquier pestaña.
13. Ajustar `src/App.test.tsx`: 8 pestañas, 3 tarjetas en Especialidades, 6 en Tradicionales y 40 en total. Verificar: `npm test`.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` terminan sin errores; `format:check` no falla por los archivos tocados (hay fallas previas en el repo ajenas a esta spec).
- [ ] `src/data/menu.ts` existe y `src/data/site.ts` ya no exporta `dishes`, `categories`, `categoryTag`, `minPrice`, `Dish` ni `CategoryId`.
- [ ] El menú muestra exactamente 8 pestañas, sin "Todo", y abre en "Especialidades de la Casa".
- [ ] La suma de tarjetas de las 8 pestañas es 40; Especialidades tiene 3 y Antojitos Tradicionales 6.
- [ ] Todos los precios de `specs/menu-la-enriqueta.md` aparecen en pantalla con su valor exacto (por ejemplo, Pozole Mediano $130 y Grande $160; Margarita la Mexicana $119; Stella $60; Black Label copeo $170 y botella $2,499).
- [ ] No existen `names` ni `priceRange` en `src/data/menu.ts` ni se muestran rangos de precio.
- [ ] Mocktails tiene 7 filas de $89; Tragos Clásicos 12 filas de $99; Cervezas Comerciales 14 filas con su precio.
- [ ] Cada fila abre `https://wa.me/523111397571?text=…` con producto, variedad, porción (si hay) y precio exacto; en licores el mensaje dice "Copeo" o "Botella" con su precio.
- [ ] "Miche Poderosa" aparece una sola vez y "Piña Colada" aparece sin descripción.
- [ ] Las filas de licores con botella muestran dos botones; "Whisky de la casa", "Tequila de la Casa" y "Mezcal de la Casa" solo muestran copeo.
- [ ] El texto de recomendación del documento aparece al pie del menú.
- [ ] `public/menu-la-enriqueta.md` no existe y `dist/` no contiene `menu-la-enriqueta.md`.
- [ ] Las variantes sin precio propio (carne del pozole, gorditas suaves o doradas) se muestran como texto y no como botón.
- [ ] A 375 px no hay scroll horizontal de la página, la barra de pestañas se desplaza y ningún título se superpone con su precio.
- [ ] Con `prefers-reduced-motion: reduce` las tarjetas se ven de inmediato (`Reveal` sin cambios).
- [ ] No hay dependencias nuevas en `package.json` y los colores de `@theme` conservan sus valores.

## Decisiones

- **Sí:** `src/data/menu.ts` en TypeScript. El repo es TS y los tipos evitan precios mal formados; se descarta el `menuData.js` del pedido original.
- **No:** ampliar `src/data/site.ts`. Mezclaría datos del negocio con cientos de renglones de menú.
- **Sí:** quitar la pestaña "Todo". Con 40 tarjetas sería interminable en celular.
- **Sí:** transcribir el documento a `menu.ts` a mano, sin parsear el `.md` en tiempo de ejecución. Evita una dependencia y un formato frágil; el `.md` queda como fuente documentada.
- **Sí:** mover el documento a `specs/`. Vite publica todo `public/`, y el archivo trae notas internas de pendientes.
- **Sí:** seguir la agrupación del documento: Tacos Dorados, Sopes, Enchiladas y Sincronizadas dentro de Antojitos Tradicionales; desaparece la categoría "Tacos, Sopes y Enchiladas".
- **Sí:** conservar Postres, Aguas Frescas, Limonadas, Bebidas Calientes y Mocktails aunque el documento no los traiga. El documento solo actualiza lo que menciona.
- **Sí:** cocteles, tragos, cervezas y licores como filas con precio y botón individual. Sustituye la decisión anterior de "grupo con rango de precio", que existía solo porque faltaban precios.
- **Sí:** eliminar `names` y `priceRange` del modelo. Con precio individual, un solo mecanismo (`options`) cubre todo.
- **Sí:** licores con dos botones por fila (Copeo y Botella). Cada mensaje de WhatsApp lleva el precio exacto de lo que se pide.
- **Sí:** mostrar solo la primera "Miche Poderosa" hasta que el cliente confirme el nombre de la segunda. No inventamos nombres.
- **Sí:** "Tequila de la Casa $70" como copeo, igual que "Whisky de la casa" y "Mezcal de la Casa"; así aparece en la columna Copeo del documento. El cliente aún debe confirmarlo.
- **Sí:** tarjetas anchas para grupos largos (`wide`). 16 filas en una tarjeta de 270 px estiran a sus vecinas y rompen la distribución.
- **Sí:** variantes sin precio propio como texto informativo. Evita estado y selectores nuevos; el cliente aclara en WhatsApp.
- **Sí:** fotos solo donde el nombre del archivo corresponde al platillo. Misma regla que la SPEC 02.

## Riesgos

| Riesgo                                                                                    | Mitigación                                                                                                           |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Errores de captura en ~150 precios                                                        | Los criterios verifican precios clave; se revisa `menu.ts` contra `specs/menu-la-enriqueta.md` en los pasos 10 y 11. |
| Pendientes del cliente (Miche duplicada, tequila de la casa, Piña Colada sin descripción) | Quedan documentados en las decisiones; se ajustan cuando el cliente responda.                                        |
| Alcohol con venta por WhatsApp sin restricciones visibles                                 | Los tragos clásicos del documento traen "Aplican restricciones"; se muestra tal cual en `note`.                      |
| 8 pestañas no caben en móvil                                                              | Scroll horizontal en la barra y pestaña activa visible (ya implementado en el paso 6).                               |
| Filas de licores con dos botones se aprietan a 375 px                                     | Revisar a 375 px en el paso 11; las filas pueden apilar etiqueta y botones.                                          |
| `App.test.tsx` depende del número de pestañas y tarjetas                                  | Los pasos 9 y 13 lo contemplan.                                                                                      |

## Qué **no** entra en esta spec

- Selectores de carne o variante, carrito y pedido en línea.
- Buscador y filtros.
- Fotos nuevas u optimización de imágenes.
- La segunda "Miche Poderosa" hasta que el cliente confirme su nombre.
- Cambios en otras secciones del sitio o en los datos del negocio.
- Menú en PDF.
