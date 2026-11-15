# SPEC 04 — Carrito de compras sobre el menú digital

> **Estado:** Aprobado
> **Depende de:** SPEC 03
> **Fecha:** 2026-11-15
> **Objetivo:** Permitir agregar productos del menú a un carrito (botón en la barra de navegación y panel con cantidades, nota, datos del cliente y total) y enviar todo el pedido, con los datos de entrega, en un solo mensaje de WhatsApp.

## Por qué existe esta spec

Hoy cada fila del menú abre WhatsApp con un solo producto (SPEC 03). Pedir una comida completa obliga a abrir WhatsApp una vez por producto. Esta spec **revoca** el flujo "una fila = un mensaje" de la SPEC 03 y lo sustituye por un carrito con un único envío. También **revoca** la exclusión de la SPEC 03 que dejaba fuera "carrito o pedido en línea" y la restricción de "sin animaciones nuevas" solo para el panel del carrito y el feedback al agregar.

## Alcance

**Dentro:**

- Carrito en memoria de React (`useReducer` + Context) con persistencia en `localStorage` (clave `enriqueta:cart:v1`), con respaldo en memoria si `localStorage` no está disponible.
- Los botones "Pedir →", "Ordenar por WhatsApp", "Copeo" y "Botella" de `Menu.tsx` pasan a **agregar** al carrito; ya no abren WhatsApp.
- Botón del carrito en la barra de navegación (`Header`), siempre visible (también en móvil, junto al menú hamburguesa), con contador de piezas y total. Sustituye al botón "Pedir por WhatsApp" del `Header` y al botón flotante "Ver pedido".
- Retirar el botón "Contactar por WhatsApp" de `Hero.tsx` y el "Pedir por WhatsApp" del `Header` (escritorio y menú móvil). "Escribir por WhatsApp" de `Contact.tsx` se conserva.
- Panel del carrito (hoja inferior en móvil, panel lateral derecho desde 768 px) con: líneas, cantidad con +/−, quitar línea, vaciar pedido, subtotal por línea, total, campo de nota del pedido y botón "Enviar pedido por WhatsApp".
- Un solo mensaje de WhatsApp con todas las líneas, el total y la nota.
- Aviso de mayoría de edad (+18) en el panel cuando hay alcohol en el carrito.
- Animación simple de entrada y salida del panel con `motion`, respetando `prefers-reduced-motion`.
- Feedback al agregar un producto (ampliación pedida tras implementar los pasos 1 a 8): toast breve "Agregado: {producto}" de 2 s bajo la barra de navegación y pulso del contador del botón del carrito.
- Datos del cliente en el panel, antes del botón de envío (ampliación pedida tras el feedback al agregar): selector "Domicilio" / "Recoger en el local", nombre completo, teléfono, domicilio y ubicación de Google Maps.
- Ubicación de Google Maps: botón "Usar mi ubicación" (geolocalización del navegador) o campo para pegar un enlace de Google Maps o coordenadas `lat, lng`; se envía al repartidor como enlace clicable.
- Los datos del cliente se guardan en `localStorage` (`enriqueta:customer:v1`) con un aviso de que quedan solo en su dispositivo.
- Tests del reducer, de la persistencia, de la validación de datos y del flujo agregar → enviar.

**Fuera de alcance (para specs futuras):**

- Pago en línea, backend, cuentas de usuario e historial de pedidos.
- Mapa embebido, selector de punto en mapa, autocompletado de direcciones o cálculo de zona de reparto (requieren API de Google).
- Nota por línea y selectores de carne o variante dentro de la tarjeta.
- Costo de envío, zonas de reparto, propinas, cupones o impuestos.
- Horario de atención: el carrito no bloquea el envío fuera de horario.
- Toasts para otros eventos (quitar, vaciar, enviar), sonido o vibración.
- Cambios en `About`, `Gallery`, `Contact`, `Footer`, en `site` o en los precios y descripciones de `src/data/menu.ts`; en `Header` y `Hero` solo lo descrito en "Dentro".
- Cambiar el texto del subtítulo del menú ("pídelo directo por WhatsApp").

## Modelo de datos

Esta feature no cambia `src/data/menu.ts` ni `src/data/site.ts`. Añade estructuras nuevas en `src/cart/`.

```ts
// src/cart/cartReducer.ts
export type Size = "copeo" | "botella";

export type CartLine = {
  key: string; // `${itemId}|${optionLabel ?? ""}|${size ?? ""}`
  itemId: string; // MenuItem.id
  optionLabel?: string; // PriceOption.label; ausente si el producto tiene precio único
  size?: Size; // solo licores con botella: "copeo" o "botella"
  qty: number; // entero entre 1 y 20
};

export type DeliveryMode = "domicilio" | "recoger";

export type Customer = {
  name: string; // nombre completo, máx. 80
  phone: string; // como lo escribe el cliente; se valida y normaliza a 10 dígitos
  mode: DeliveryMode; // por defecto "domicilio"
  address: string; // máx. 200; solo se pide con "domicilio"
  mapsLink: string; // texto crudo: enlace de Google Maps o "lat, lng"; opcional
};

export type CartState = {
  lines: CartLine[];
  note: string;
  customer: Customer; // se guarda aparte, en `enriqueta:customer:v1`
  lastAdded?: { seq: number; key: string }; // último "add"; seq crece en cada uno
};

export type CartAction =
  | { type: "add"; line: Omit<CartLine, "key" | "qty"> }
  | { type: "setQty"; key: string; qty: number } // qty <= 0 elimina la línea
  | { type: "remove"; key: string }
  | { type: "setNote"; note: string }
  | { type: "setCustomer"; customer: Partial<Customer> }
  | { type: "clear" }; // vacía líneas y nota; conserva `customer`
```

Reglas:

- **El carrito no guarda precios.** Guarda `itemId`, `optionLabel` y `size`; el precio se resuelve contra `menu` al mostrar y al enviar. Así un cambio de precio en `menu.ts` nunca deja precios viejos en el carrito.
- Agregar una línea con la misma `key` suma 1 a su `qty`. Máximo 20 por línea; el botón + se deshabilita en 20.
- Precio unitario de una línea: `price` del producto si no tiene `options`; `option.price` si tiene `options`; `option.bottlePrice` si `size === "botella"`.
- Un producto con `options` en licores sin `bottlePrice` (marcas "de la casa") solo genera líneas con `size: "copeo"`.
- La nota admite hasta 300 caracteres.
- `lastAdded` lo fija solo la acción `add` (`seq` = anterior + 1, `key` = línea afectada); no se persiste en `localStorage` y `clear` lo borra. El toast y el pulso reaccionan a su `seq`.
- Al cargar desde `localStorage`, se descartan las líneas cuyo `itemId`, `optionLabel` o `size` ya no existan en `menu`; si el JSON es inválido o la clave tiene otra versión, el carrito arranca vacío.
- Validación (`src/cart/customer.ts`, funciones puras):
  - Nombre: al menos dos palabras (nombre y apellido).
  - Teléfono: tras quitar espacios, guiones, paréntesis y `+`, 10 dígitos (se acepta el prefijo `52`, que se descarta).
  - Domicilio (solo con `"domicilio"`): al menos 10 caracteres.
  - Ubicación: opcional. Si no está vacía debe ser un enlace `https` de `google.com/maps`, `google.com.mx/maps`, `maps.google.com`, `maps.app.goo.gl` o `goo.gl/maps`, o coordenadas válidas (`lat` −90 a 90, `lng` −180 a 180), que se normalizan a `https://www.google.com/maps?q={lat},{lng}`. Cualquier otro texto bloquea el envío.
  - Con `"recoger"` solo se exigen nombre y teléfono; domicilio y ubicación se ocultan y no se envían.
- "Usar mi ubicación" llama a `navigator.geolocation.getCurrentPosition` (con permiso del cliente) y escribe `https://www.google.com/maps?q={lat},{lng}` con 6 decimales; si se niega o falla, el panel muestra el motivo y el cliente puede pegar el enlace.
- Contiene alcohol: alguna línea cuyo producto sea de categoría `cocteleria` o `licores`.

Formato del mensaje de WhatsApp (`src/cart/cartMessage.ts`), pasado por `whatsappUrl` de `src/data/site.ts`:

```
¡Hola La Enriqueta! Quiero hacer este pedido:
- 2 × Pozole – Mediano (1 orden) – $260 MXN
- 1 × Black Label – Botella – $2,499 MXN
- 1 × Torta Ahogada Estilo Tuxpan – $120 MXN

Total: $2,879 MXN
Nota: sin cebolla

Cliente: Ana Pérez López
Teléfono: 311 123 4567
Entrega: A domicilio
Domicilio: Calle Brasil 120, Col. Moctezuma, casa azul
Ubicación: https://www.google.com/maps?q=21.504100,-104.894500
```

- Cada línea: `- {qty} × {producto}[ – {variedad o Copeo/Botella}][ ({unit})] – {subtotal} MXN`. Sin `unit`, se omite la porción; sin variedad, se omite.
- La línea `Nota:` solo aparece si la nota no está vacía.
- El bloque de cliente va después de una línea en blanco. Con `"recoger"`: `Entrega: Recoger en el local` y sin `Domicilio:` ni `Ubicación:`. `Ubicación:` solo aparece si hay ubicación válida. El teléfono se escribe como `NNN NNN NNNN`.
- `money` de `src/data/menu.ts` formatea todos los importes.

Archivos que aparecen o cambian:

| Archivo                           | Cambio                                                                 |
| --------------------------------- | ---------------------------------------------------------------------- |
| `src/cart/cartReducer.ts`         | Nuevo. Tipos, reducer y funciones puras (`lineUnitPrice`, `cartTotal`) |
| `src/cart/cartMessage.ts`         | Nuevo. Construye el texto del mensaje                                  |
| `src/cart/CartContext.tsx`        | Nuevo. Provider, hook `useCart`, persistencia en `localStorage`        |
| `src/cart/customer.ts`            | Nuevo. Validación y normalización de los datos del cliente             |
| `src/components/CartButton.tsx`   | Nuevo. Botón del carrito en la barra de navegación                     |
| `src/components/CartPanel.tsx`    | Nuevo. Panel con líneas, nota, total y envío                           |
| `src/components/CartToast.tsx`    | Nuevo. Toast "Agregado: …" de 2 s                                      |
| `src/components/CustomerForm.tsx` | Nuevo. Formulario de datos del cliente y ubicación                     |
| `src/components/Menu.tsx`         | Botones pasan a agregar; se retiran los mensajes por fila              |
| `src/App.tsx`                     | Envuelve con `CartProvider` y monta `CartButton` y `CartPanel`         |
| `src/cart/cartReducer.test.ts`    | Nuevo. Tests del reducer y del total                                   |
| `src/App.test.tsx`                | Ajustes por los textos de botones y flujo del carrito                  |

## Plan de implementación

1. Crear `src/cart/cartReducer.ts` con tipos, reducer, `lineUnitPrice` y `cartTotal`, y `src/cart/cartReducer.test.ts`. Verificar: `npm test` y `npm run typecheck`.
2. Crear `src/cart/cartMessage.ts` con su test (mensaje con licor en botella, línea con `unit` y nota vacía). Verificar: `npm test`.
3. Crear `src/cart/CartContext.tsx` con `CartProvider`, `useCart` y persistencia en `localStorage` con respaldo en memoria; envolver `App` con el provider. Verificar: `npm run typecheck`; test de que un carrito guardado se restaura y uno inválido arranca vacío.
4. Crear `CartButton.tsx` y `CartPanel.tsx` (líneas, +/−, quitar, total, estado vacío, cierre con ×, clic fuera y `Esc`) y montarlos en `App.tsx`. Verificar: `npm run typecheck`; el panel abre desde el botón con un carrito precargado en `localStorage`.
5. En `Menu.tsx`, cambiar los botones de fila, el botón de precio único y los botones Copeo y Botella para llamar a `add`; retirar `rowMessage` y `sizeMessage`. Verificar: agregar Pozole Mediano dos veces muestra `2` en el botón del carrito y $260 en el panel.
6. Añadir al panel la nota (300 caracteres), "Vaciar pedido", el botón "Enviar pedido por WhatsApp" (abre `whatsappUrl(cartMessage(...))` en pestaña nueva, deshabilitado con carrito vacío) y el aviso +18. Verificar: el enlace trae el mensaje con el formato del modelo de datos.
7. Animar la entrada y salida del panel con `motion` (hoja desde abajo en móvil, desde la derecha desde 768 px; fundido del fondo), con `prefers-reduced-motion` activo sin animación. Verificar: `npm run dev` en ambos tamaños.
8. Ajustar `src/App.test.tsx` al nuevo flujo. Verificar: `npm test`.
9. Añadir `lastAdded` al reducer, crear `CartToast.tsx` (montado en `App.tsx`, oculto con el panel abierto) y el pulso del contador en `CartButton.tsx`. Verificar: `npm test`; al pulsar "Agregar al pedido" aparece "Agregado: …" y desaparece a los 2 s.
10. Crear `src/cart/customer.ts` (tipos, `validateCustomer`, `parseMapsLocation`, `formatPhone`) con su test. Verificar: `npm test`.
11. Añadir `customer` y la acción `setCustomer` al reducer y su persistencia aparte en `cartStorage.ts` (`enriqueta:customer:v1`), sin que `clear` lo borre. Verificar: `npm test`; recargar conserva los datos.
12. Ampliar `cartMessage.ts` con el bloque de cliente según el modelo de datos. Verificar: `npm test`.
13. Crear `CustomerForm.tsx` (selector Domicilio/Recoger, nombre, teléfono, domicilio, ubicación con "Usar mi ubicación" y campo de pegado, aviso de privacidad), montarlo en el área desplazable de `CartPanel.tsx` antes de la nota y deshabilitar "Enviar pedido por WhatsApp" mientras falten datos, indicando qué falta. Verificar: `npm test`; el botón se habilita solo con datos válidos.
14. Ajustar los tests existentes del envío (`Cart.test.tsx`, `App.test.tsx`) para precargar datos del cliente. Verificar: `npm test`.
15. Mover el botón del carrito a `Header.tsx` (sustituye a "Pedir por WhatsApp" en escritorio y en el menú móvil, y se elimina el flotante de `App.tsx`), reubicar el toast bajo la barra, quitar "Contactar por WhatsApp" de `Hero.tsx` y ajustar los tests. Verificar: `npm test`; `npm run dev` a 375 px y 1280 px.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` terminan sin errores; `format:check` no falla por los archivos tocados.
- [ ] La barra de navegación muestra el botón del carrito en lugar de "Pedir por WhatsApp", en escritorio y en móvil; con el carrito vacío no muestra contador y, tras agregar un producto, muestra 1.
- [ ] Ya no existe el botón flotante "Ver pedido" ni el texto "Pedir por WhatsApp" en el `Header`, ni "Contactar por WhatsApp" en el `Hero`; "Escribir por WhatsApp" de Contacto sigue ahí.
- [ ] Pulsar el botón del carrito en la barra de navegación abre el panel, también con el carrito vacío (estado vacío).
- [ ] Ninguna fila de `Menu.tsx` abre WhatsApp directamente: ya no hay enlaces `wa.me` dentro de las tarjetas.
- [ ] Agregar Pozole Mediano dos veces deja una sola línea con cantidad 2 y subtotal $260.
- [ ] Black Label permite agregar "Copeo" ($170) y "Botella" ($2,499) como dos líneas distintas.
- [ ] "Whisky de la casa", "Tequila de la Casa" y "Mezcal de la Casa" solo se pueden agregar como copeo.
- [ ] El botón + se deshabilita en 20; el botón − en 1 elimina la línea.
- [ ] El total del panel es la suma exacta de `cantidad × precio unitario` de todas las líneas.
- [ ] El mensaje de WhatsApp coincide con el formato del modelo de datos: producto, variedad, porción (si hay), subtotal, total y nota solo si existe.
- [ ] El enlace de envío empieza con `https://wa.me/523111397571?text=` y el botón está deshabilitado con el carrito vacío.
- [ ] El aviso +18 aparece solo si hay al menos una línea de `cocteleria` o `licores`.
- [ ] Al pulsar cualquier botón de agregar aparece un toast "Agregado: {producto}" (con variedad y Copeo/Botella si aplica) que desaparece solo a los 2 s.
- [ ] Agregar dos veces seguidas reinicia el toast con el producto más reciente, sin apilar toasts.
- [ ] El toast no se muestra con el panel abierto y se anuncia a lectores de pantalla (`role="status"`).
- [ ] El contador del botón del carrito hace un pulso en cada adición.
- [ ] Con `prefers-reduced-motion: reduce` el toast y el pulso aparecen sin animación.
- [ ] Antes del botón "Enviar pedido por WhatsApp" el panel pide nombre completo, teléfono y domicilio, y ofrece ubicación de Google Maps.
- [ ] El botón de envío está deshabilitado mientras falte un dato obligatorio y el panel indica cuáles faltan.
- [ ] Un nombre de una sola palabra, un teléfono que no sea de 10 dígitos o un domicilio de menos de 10 caracteres no habilitan el envío.
- [ ] "Usar mi ubicación" rellena el campo con `https://www.google.com/maps?q={lat},{lng}`; si el navegador la niega, se muestra el motivo y se puede pegar un enlace.
- [ ] Pegar un enlace `https://maps.app.goo.gl/...`, uno de `google.com/maps` o `21.5041, -104.8945` es válido; cualquier otro texto bloquea el envío con un mensaje.
- [ ] Con "Recoger en el local" se ocultan domicilio y ubicación, solo se exigen nombre y teléfono, y el mensaje dice `Entrega: Recoger en el local`.
- [ ] El mensaje de WhatsApp incluye `Cliente:`, `Teléfono:`, `Entrega:`, `Domicilio:` y, si hay, `Ubicación:` con el enlace normalizado.
- [ ] Los datos del cliente se conservan al recargar y tras "Vaciar pedido"; con `localStorage` bloqueado el formulario funciona sin persistir.
- [ ] El panel muestra el aviso de que los datos quedan solo en el dispositivo del cliente.
- [ ] Recargar la página conserva líneas y nota; con `localStorage` bloqueado el carrito funciona sin persistir y sin errores en consola.
- [ ] Una línea guardada con un `itemId` inexistente se descarta al cargar sin romper la página.
- [ ] "Vaciar pedido" deja el carrito en 0 líneas y sin nota; enviar el pedido no lo vacía.
- [ ] El panel se cierra con ×, clic en el fondo y `Esc`, y el foco vuelve al botón del carrito de la barra de navegación.
- [ ] A 375 px no hay scroll horizontal de la página y el botón del carrito y el nombre del restaurante caben en la barra de navegación sin superponerse.
- [ ] Con `prefers-reduced-motion: reduce` el panel aparece y desaparece sin animación.
- [ ] No hay dependencias nuevas en `package.json` y los colores de `@theme` conservan sus valores.

## Decisiones

- **Sí:** un solo mensaje de WhatsApp con todo el pedido. No hay backend y WhatsApp ya es el canal del negocio.
- **No:** pago en línea. Requiere backend y pasarela; es otra spec si el cliente lo pide.
- **Sí:** los botones de fila pasan a "agregar" y se retira el pedido directo. Dos flujos en la misma fila saturan la tarjeta a 375 px.
- **Sí:** `useReducer` + Context. Sin dependencias nuevas, igual que las SPEC 02 y 03; se descarta Zustand.
- **Sí:** `localStorage` con clave versionada `enriqueta:cart:v1`. Un pedido a medias no debe perderse al recargar en móvil.
- **Sí:** guardar solo `itemId`, `optionLabel` y `size`, nunca precios. El precio viene de `menu.ts` y siempre coincide con la carta vigente.
- **Sí:** línea = producto + variedad + tamaño. Copeo y botella del mismo licor son líneas distintas.
- **Sí:** un campo de nota para todo el pedido. Cubre las variantes sin precio propio (carne del pozole, tipo de gordita) sin añadir selectores.
- **No:** nota por línea. Más UI y más estado.
- **Sí:** datos del cliente en el carrito (revoca la exclusión original). El repartidor necesita nombre, teléfono y dónde llegar sin ir y venir por WhatsApp.
- **Sí:** nombre, teléfono y domicilio obligatorios; ubicación opcional. El domicilio escrito siempre existe como respaldo; la ubicación de Maps reduce errores, pero no debe bloquear a quien no pueda darla.
- **Sí:** selector Domicilio / Recoger. Quien recoge no debe dar su dirección.
- **Sí:** ubicación con "Usar mi ubicación" más campo de pegado. La geolocalización es el camino de un toque; el pegado cubre pedir para otra dirección o permiso denegado. Sin API de Google, sin dependencias ni claves.
- **No:** mapa embebido o selector de punto. Requiere API de Google con clave y facturación.
- **Sí:** aceptar solo enlaces `https` de dominios de Google Maps o coordenadas válidas. Evita enlaces arbitrarios en el mensaje que ve el repartidor.
- **Sí:** guardar los datos del cliente en `localStorage` (`enriqueta:customer:v1`), aparte del carrito, con aviso de privacidad. Ahorra reescribir en cada pedido; no hay backend ni envío a terceros salvo el mensaje de WhatsApp.
- **Sí:** "Vaciar pedido" no borra los datos del cliente. Vaciar es del carrito, no de la persona.
- **Sí:** botón flotante más panel (hoja inferior en móvil, lateral desde 768 px). Es accesible desde las 8 pestañas sin volver al encabezado.
- **Sí:** el carrito vive en la barra de navegación (que es `sticky`) y se retira el botón flotante. Un solo acceso, siempre visible, y ocupa el lugar del antiguo "Pedir por WhatsApp", que ya no tiene sentido porque el envío ocurre desde el carrito.
- **Sí:** retirar "Contactar por WhatsApp" del Hero y "Pedir por WhatsApp" del Header. El pedido pasa por el carrito; "Escribir por WhatsApp" de Contacto se conserva para dudas generales.
- **Sí:** un único botón de carrito en el DOM (junto al hamburguesa), sin duplicado para escritorio y móvil. Evita dos controles iguales y que los lectores de pantalla lo anuncien dos veces.
- **Sí:** el botón del carrito se muestra aunque esté vacío. En una barra fija es la señal de que existe un carrito; el panel explica el estado vacío.
- **Sí:** animación del panel con `motion` ya instalado. Revoca "sin animaciones nuevas" únicamente para este panel; `Reveal` y el resto no cambian.
- **Sí:** feedback al agregar con toast + pulso del contador. Confirma el toque sin abrir el panel; el pulso va en el contador (no en el botón entero) para no remontar el botón ni perder el foco.
- **Sí:** un solo toast que se reinicia al agregar de nuevo. Evita apilar avisos al pulsar varias veces.
- **Sí:** `lastAdded` en el estado del carrito, sin persistirlo. Derivarlo de la acción mantiene el reducer puro y testeable.
- **Sí:** aviso +18 en el panel cuando hay alcohol, sin bloquear el envío. El negocio valida la edad en WhatsApp; la nota "Aplican restricciones" de los tragos clásicos se mantiene.
- **Sí:** máximo 20 por línea. Evita cantidades absurdas por toques repetidos; si hace falta más, se aclara en la nota.
- **Sí:** enviar no vacía el carrito. Abrir WhatsApp no confirma que el mensaje se mandó; "Vaciar pedido" es explícito.

## Riesgos

| Riesgo                                                                              | Mitigación                                                                                                  |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Carrito guardado con productos que ya no existen o cambiaron                        | No se guardan precios; se descartan líneas inválidas al cargar.                                             |
| `localStorage` deshabilitado (modo privado)                                         | Respaldo en memoria; el carrito funciona sin persistir.                                                     |
| URL de WhatsApp demasiado larga con pedidos muy grandes                             | Límite de 20 por línea y 300 caracteres de nota; el paso 6 se prueba con un pedido de 10 líneas.            |
| El botón del carrito no cabe en la barra de navegación a 375 px                     | En móvil solo icono y contador (sin texto ni total); se revisa en el paso 15.                               |
| Foco atrapado o perdido al abrir y cerrar el panel                                  | Panel con `role="dialog"` y `aria-modal`, foco inicial dentro y retorno al botón del carrito al cerrar.     |
| Datos personales (nombre, teléfono, domicilio, ubicación) guardados en el navegador | Solo en `localStorage` del dispositivo, sin backend; aviso visible en el panel; no se registran en consola. |
| Geolocalización negada, imprecisa o no disponible (HTTP, navegador sin soporte)     | Mensaje con el motivo y campo de pegado como alternativa; el domicilio escrito sigue siendo obligatorio.    |
| Enlace de ubicación malicioso o ilegible para el repartidor                         | Lista cerrada de dominios de Google Maps y normalización de coordenadas.                                    |
| Pedido con alcohol a menores                                                        | Aviso +18 en el panel; la validación real queda en la conversación de WhatsApp.                             |
| `App.test.tsx` depende de los textos de los botones                                 | El paso 8 lo ajusta al nuevo flujo.                                                                         |

## Qué **no** entra en esta spec

- Pago en línea, backend, cuentas e historial de pedidos.
- Pago, costo de envío, zonas de reparto, propinas y cupones.
- Mapa embebido, selector de punto en mapa y autocompletado de direcciones (API de Google).
- Nota por línea y selectores de variante en la tarjeta.
- Bloqueo por horario de atención.
- Toasts o animaciones fuera del panel del carrito y del feedback al agregar.
- Cambios en precios, productos o en las demás secciones del sitio.
