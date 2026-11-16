# SPEC 06 — QR por mesa para pedir desde el restaurante

> **Estado:** implementado.
> **Depende de:** SPEC 04
> **Fecha:** 2026-11-16
> **Objetivo:** Generar un QR imprimible por mesa que abra el menú en "modo mesa", donde el cliente pide sin dar teléfono, domicilio ni ubicación y el pedido llega al WhatsApp del negocio identificado con el número de mesa.

## Por qué existe esta spec

El carrito de la SPEC 04 está pensado para pedidos a domicilio o para recoger: exige nombre completo, teléfono y domicilio. Un cliente sentado en el restaurante no tiene nada de eso que dar, y el negocio solo necesita saber a qué mesa llevar la comida. Esta spec añade un tercer modo de entrega, "en mesa", que se activa únicamente al entrar por el QR de una mesa. **Modifica** la validación del cliente y el formato del mensaje de la SPEC 04 solo cuando hay una mesa activa; el flujo normal no cambia.

## Alcance

**Dentro:**

- Parámetro de URL `?mesa=N` (N entero de 1 a `site.tables`) que activa el modo mesa.
- La mesa activa se guarda en `sessionStorage` (clave `enriqueta:table:v1`), se quita del parámetro de la URL con `history.replaceState` y sobrevive a recargas de la pestaña; con `sessionStorage` bloqueado, vive solo en memoria.
- Un parámetro `mesa` inválido (`0`, `21`, `abc`, vacío) se ignora; si ya había una mesa guardada, se conserva.
- En modo mesa, el panel del carrito (`CartPanel`) oculta teléfono, domicilio, ubicación y el selector Domicilio/Recoger; solo muestra un campo "Nombre (opcional)". El envío nunca se bloquea por datos del cliente; solo por carrito vacío.
- Mensaje de WhatsApp distinto en modo mesa, con la mesa en la primera línea y sin teléfono, domicilio ni ubicación (formato en "Modelo de datos").
- Chip "Mesa N" en la barra de navegación (`Header`) junto al botón del carrito, y botón "Salir del modo mesa" dentro del panel del carrito para volver al flujo normal (a domicilio o recoger).
- Constante `tables` en `src/data/site.ts` con el número de mesas (20).
- Script `npm run generate:qrs` que escribe en `qr-mesas/` un SVG y un PNG por mesa (`mesa-01.svg`, `mesa-01.png`, …) y un `index.html` imprimible con todos los QR rotulados "Mesa N". La carpeta se agrega a `.gitignore`.
- Dependencia nueva solo de desarrollo: `qrcode`. No entra al bundle del sitio.
- Tests de `tableSession`, del mensaje en modo mesa, de la validación y del flujo `?mesa=7` → agregar → enviar.

**Fuera de alcance (para specs futuras):**

- Panel de cocina o de meseros, estado del pedido, notificaciones o impresión de comandas.
- Pago en línea o cuenta de la mesa; propinas.
- Verificar que el cliente está físicamente en el restaurante, o impedir que alguien arme una URL `?mesa=N` a mano.
- QR firmados, expirables o de un solo uso.
- Pedidos de varias personas en la misma mesa con carritos compartidos.
- Cambios en el menú, precios, el `Hero` o las demás secciones del sitio.
- Diseño gráfico de los QR (logo, marco, tamaño de tarjeta); el `index.html` imprimible es funcional, no de marca.
- Modo mesa por nombre libre ("Terraza 3", "Barra"); solo mesas numeradas.

## Modelo de datos

```ts
// src/data/site.ts
export const site = {
  // …existente
  tables: 20, // mesas numeradas 1..tables
};
```

```ts
// src/table/tableSession.ts (funciones puras salvo load/save)
export const TABLE_KEY = "enriqueta:table:v1"; // sessionStorage; valor: "7"

export const parseTable = (raw: string | null, max: number): number | null;
// Acepta solo enteros decimales sin ceros a la izquierda entre 1 y max.
// Con max 20: "7" → 7; null, "", "0", "21", "3.5", "abc" y "07" → null.

export const loadTable: () => number | null; // sessionStorage, tolera errores
export const saveTable: (table: number | null) => void; // null borra la clave
```

```ts
// src/table/useTable.ts + src/table/TableContext.tsx
export type TableContextValue = {
  table: number | null; // mesa activa o null (flujo normal)
  leaveTable: () => void; // pone table en null y borra la clave
};
```

Reglas:

- **El carrito no guarda la mesa.** El carrito sigue en `localStorage` (`enriqueta:cart:v1`) y la mesa en `sessionStorage`: una mesa nunca debe quedar pegada al navegador del cliente para la próxima visita. Las líneas del carrito sobreviven a entrar y salir del modo mesa.
- Al montar, `TableProvider` lee `location.search`: si `mesa` es válida, la guarda y limpia el parámetro; si no, usa `loadTable()`.
- `validateCustomer(customer, table)` en `src/cart/customer.ts` recibe la mesa como segundo argumento: con mesa devuelve `ok: true` sin exigir nada; el nombre, si existe, se recorta a `customerLimits.name`.
- En modo mesa el teléfono, domicilio, ubicación y `mode` guardados en `enriqueta:customer:v1` **no se envían** aunque existan de pedidos anteriores. El nombre escrito en modo mesa se guarda en el mismo `customer.name`.
- `cartMessage(state, table?)` recibe la mesa como segundo argumento opcional.

Formato del mensaje en modo mesa (`src/cart/cartMessage.ts`):

```
¡Hola La Enriqueta! Pedido para la MESA 7:
- 2 × Pozole – Mediano (1 orden) – $260 MXN
- 1 × Torta Ahogada Estilo Tuxpan – $120 MXN

Total: $380 MXN
Nota: sin cebolla

Cliente: Ana
```

- La línea `Nota:` y el bloque `Cliente:` (precedido de línea en blanco) solo aparecen si hay nota o nombre.
- No hay `Teléfono:`, `Entrega:`, `Domicilio:` ni `Ubicación:`.
- Sin mesa, el mensaje es idéntico al de la SPEC 04.

Contenido de cada QR: `{url}/?mesa={N}`, donde `url` viene de `--url=` sin barra final. Ejemplo: `https://ejemplo.com/?mesa=7`.

Archivos que aparecen o cambian:

| Archivo                                                                                                         | Cambio                                                                                       |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/data/site.ts`                                                                                              | Añade `tables: 20`                                                                           |
| `src/table/tableSession.ts`                                                                                     | Nuevo. `parseTable`, `loadTable`, `saveTable`                                                |
| `src/table/TableContext.tsx`                                                                                    | Nuevo. `TableProvider`: lee la URL, guarda y limpia el parámetro                             |
| `src/table/useTable.ts`                                                                                         | Nuevo. Contexto y hook `useTable`                                                            |
| `src/table/tableSession.test.ts`                                                                                | Nuevo. Tests de `parseTable` y del almacenamiento                                            |
| `src/cart/customer.ts`                                                                                          | `validateCustomer` acepta la mesa                                                            |
| `src/cart/cartMessage.ts`                                                                                       | Formato de modo mesa                                                                         |
| `src/components/CustomerForm.tsx`                                                                               | Modo mesa: solo nombre opcional                                                              |
| `src/components/CartPanel.tsx`                                                                                  | Pasa la mesa a validación y mensaje; botón "Salir del modo mesa"; aviso "Pedido para Mesa N" |
| `src/components/Header.tsx`                                                                                     | Chip "Mesa N"                                                                                |
| `src/App.tsx`                                                                                                   | Envuelve con `TableProvider`                                                                 |
| `scripts/generate-qrs.mjs`                                                                                      | Nuevo. Genera SVG, PNG e `index.html` imprimible                                             |
| `package.json`                                                                                                  | Script `generate:qrs` y `qrcode` en `devDependencies`                                        |
| `.gitignore`                                                                                                    | Añade `qr-mesas/`                                                                            |
| `src/cart/cartMessage.test.ts`, `src/cart/customer.test.ts`, `src/components/Cart.test.tsx`, `src/App.test.tsx` | Casos de modo mesa                                                                           |

## Plan de implementación

1. Añadir `tables: 20` a `src/data/site.ts` y crear `src/table/tableSession.ts` con `parseTable`, `loadTable` y `saveTable`, más `tableSession.test.ts` (válidos, fuera de rango, decimales, ceros a la izquierda, `sessionStorage` que lanza error). Verificar: `npm test` y `npm run typecheck`.
2. Crear `useTable.ts` y `TableContext.tsx` (lee `location.search`, guarda, limpia el parámetro con `history.replaceState`, expone `leaveTable`) y envolver `App` con `TableProvider`. Verificar: `npm run dev` en `/?mesa=7` conserva la mesa tras recargar y la quita de la URL; `/?mesa=99` no activa nada.
3. Ampliar `validateCustomer(customer, table)` y `cartMessage(state, table)` con el modo mesa, con tests (mensaje con y sin nombre, sin nota, sin mesa idéntico al actual, datos viejos de domicilio ignorados). Verificar: `npm test`.
4. Adaptar `CustomerForm.tsx` y `CartPanel.tsx`: con mesa, solo el campo "Nombre (opcional)", aviso "Pedido para la Mesa N", botón "Salir del modo mesa", envío habilitado con carrito no vacío y enlace de WhatsApp con el mensaje de modo mesa. Verificar: `npm test`; en `/?mesa=7` agregar un producto y ver el enlace con `MESA 7`.
5. Mostrar el chip "Mesa N" en `Header.tsx` junto al botón del carrito. Verificar: `npm run dev` a 375 px y 1280 px, sin scroll horizontal.
6. Crear `scripts/generate-qrs.mjs`: lee `--url=` (obligatoria, termina con error claro si falta o no es `https`/`http`) y `--tables=` (por defecto 20), escribe `qr-mesas/mesa-NN.svg`, `mesa-NN.png` e `index.html` imprimible; añadir `qrcode` a `devDependencies`, el script `generate:qrs` en `package.json` y `qr-mesas/` a `.gitignore`. Verificar: `npm run generate:qrs -- --url=https://ejemplo.com` crea 20 SVG, 20 PNG y el `index.html`.
7. Añadir tests de flujo: con `?mesa=7` en la URL, el panel no pide teléfono ni domicilio, el chip dice "Mesa 7" y el enlace trae `MESA 7`; "Salir del modo mesa" devuelve el formulario normal. Verificar: `npm test`.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` terminan sin errores; `format:check` no falla por los archivos tocados.
- [ ] Abrir `/?mesa=7` muestra el chip "Mesa 7" en la barra de navegación, y la URL queda sin el parámetro `mesa`.
- [ ] Recargar la pestaña conserva la mesa; abrir el sitio en una pestaña o sesión nueva sin `?mesa=` no la conserva.
- [ ] `?mesa=0`, `?mesa=21`, `?mesa=abc`, `?mesa=3.5`, `?mesa=07` y `?mesa=` no activan el modo mesa.
- [ ] Con una mesa guardada, abrir `?mesa=99` conserva la mesa anterior.
- [ ] En modo mesa el panel no muestra teléfono, domicilio, ubicación ni el selector Domicilio/Recoger; solo "Nombre (opcional)".
- [ ] En modo mesa con carrito no vacío, el botón "Enviar pedido por WhatsApp" está habilitado sin escribir nada; con carrito vacío sigue deshabilitado.
- [ ] El enlace de envío empieza con `https://wa.me/523111397571?text=` y su texto decodificado empieza con `¡Hola La Enriqueta! Pedido para la MESA 7:`.
- [ ] El mensaje en modo mesa no contiene `Teléfono:`, `Entrega:`, `Domicilio:` ni `Ubicación:`, aunque haya datos de esos campos en `localStorage`.
- [ ] El mensaje trae `Cliente: {nombre}` solo si se escribió un nombre y `Nota:` solo si hay nota.
- [ ] Sin mesa activa, el mensaje y la validación son idénticos a los de la SPEC 04 (los tests existentes pasan sin cambios de expectativa).
- [ ] "Salir del modo mesa" quita el chip, borra `enriqueta:table:v1` y vuelve a mostrar el formulario normal, conservando las líneas del carrito.
- [ ] Con `sessionStorage` bloqueado el modo mesa funciona hasta recargar y no hay errores en consola.
- [ ] A 375 px el chip, el botón del carrito y el nombre del restaurante caben en la barra sin superponerse ni provocar scroll horizontal.
- [ ] `npm run generate:qrs -- --url=https://ejemplo.com` crea `qr-mesas/mesa-01.svg` a `mesa-20.svg`, los 20 PNG y `index.html`.
- [ ] Al decodificar `mesa-07.png` con un lector de QR se obtiene exactamente `https://ejemplo.com/?mesa=7`; con `--url=https://ejemplo.com/` (barra final) el resultado es el mismo.
- [ ] Ejecutar el script sin `--url` o con un valor que no empieza con `http://` o `https://` termina con código distinto de 0 y un mensaje que lo explica.
- [ ] `index.html` muestra los 20 QR rotulados "Mesa 1" a "Mesa 20".
- [ ] `qr-mesas/` está en `.gitignore`; `qrcode` aparece solo en `devDependencies` y el bundle de `dist/` no lo incluye.

## Decisiones

- **Sí:** modo mesa activado por `?mesa=N`. El sitio ya es una SPA sin router ni backend; un parámetro de URL no añade dependencias y funciona con cualquier lector de QR.
- **No:** rutas tipo `/mesa/7`. Exigen router y que `nginx` reescriba rutas; el `try_files` actual ya lo permitiría, pero se añade código sin ganar nada.
- **Sí:** guardar la mesa en `sessionStorage`, no en `localStorage`. La mesa describe la visita, no a la persona; si se guardara para siempre, quien escanee hoy y pida a domicilio la próxima semana mandaría una mesa vieja.
- **Sí:** limpiar el parámetro de la URL tras leerlo. Evita compartir sin querer un enlace con la mesa y que la URL visible no mienta tras salir del modo mesa.
- **Sí:** ignorar un `mesa` inválido y conservar la mesa guardada. Un QR dañado o editado no debe romper una sesión válida.
- **Sí:** mesas numeradas `1..site.tables` con `tables = 20`. Confirmado por el usuario; cambiar el número es un solo valor, más `--tables=` en el script.
- **No:** nombres libres de mesa ("Terraza 3"). Se puede añadir después si el negocio los necesita.
- **Sí:** nombre opcional en modo mesa. Confirmado por el usuario; ayuda al mesero sin frenar el pedido.
- **Sí:** el nombre de modo mesa se guarda en el mismo `customer.name`. Ahorra reescribirlo y no crea otra estructura.
- **Sí:** ignorar teléfono, domicilio y ubicación guardados al enviar en modo mesa. Datos de un pedido a domicilio anterior nunca deben llegar al mensaje de una mesa.
- **Sí:** mensaje con "Pedido para la MESA N" en la primera línea, sin repetir la mesa abajo. Lo primero que lee el negocio es a dónde llevarlo.
- **Sí:** chip "Mesa N" en la barra y "Salir del modo mesa" dentro del panel. El chip no es interactivo para evitar toques accidentales y ahorrar ancho a 375 px; la salida vive donde se arma el pedido.
- **Sí:** script Node con `qrcode` como `devDependency`, mismo patrón que `optimize:images`. Los QR se imprimen una vez; no hace falta código en producción.
- **No:** página `/qr` dentro del sitio. Expone una ruta pública, añade dependencia al bundle y no hay motivo para generarlos desde el navegador.
- **Sí:** la URL base se pasa con `--url=` y no queda fija en el código. El dominio no está en el repo y puede cambiar; cambiarlo implica reimprimir, así que se evita dejarlo escondido.
- **Sí:** SVG (para imprimir en grande sin pérdida) y PNG (para insertar en otros diseños), más un `index.html` rotulado para imprimir todos. Un QR sin rótulo visible se coloca fácil en la mesa equivocada.
- **Sí:** `qr-mesas/` fuera de git. Son artefactos regenerables que dependen de la URL.
- **No:** verificar que el cliente está en el restaurante ni firmar los QR. Un pedido falso llega a WhatsApp, donde el negocio lo valida como cualquier otro; el costo de defenderse supera el riesgo.

## Riesgos

| Riesgo                                                                                         | Mitigación                                                                                                                                        |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alguien arma `?mesa=N` a mano y pide desde fuera del restaurante                               | Aceptado: el pedido llega a WhatsApp, donde el negocio puede confirmarlo; se documenta en Decisiones.                                             |
| Cambiar `site.tables` y olvidar regenerar los QR (o al revés)                                  | El script usa `--tables=` con default 20 y el criterio de aceptación verifica 20; se documenta en el encabezado del script.                       |
| El dominio de los QR cambia y los impresos dejan de funcionar                                  | Fuera del alcance; si pasa, se regeneran con `--url=` nuevo. Se recomienda dominio estable antes de imprimir.                                     |
| El navegador de la cámara abre el enlace en un visor integrado sin `sessionStorage` compartido | La mesa se guarda en esa misma pestaña al abrir; el criterio de recarga lo verifica. Si el cliente cambia de navegador, deberá escanear de nuevo. |
| El chip no cabe en la barra a 375 px                                                           | Chip compacto con texto corto "Mesa 7"; se revisa en el paso 5.                                                                                   |
| Un cliente de mesa se queda con datos de domicilio escritos antes                              | En modo mesa se ignoran al enviar y no se muestran; al salir del modo reaparecen intactos.                                                        |

## Qué **no** entra en esta spec

- Panel de cocina, estado del pedido, impresión de comandas.
- Pago en línea, cuenta de la mesa y propinas.
- Verificación de ubicación del cliente, QR firmados o de un solo uso.
- Carritos compartidos entre varias personas de una mesa.
- Nombres libres de mesa.
- Diseño gráfico de los QR más allá del `index.html` imprimible.
- Cambios en el menú, precios y demás secciones del sitio.
