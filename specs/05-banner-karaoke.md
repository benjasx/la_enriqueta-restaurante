# SPEC 05 — Banner de Viernes de Karaoke después de la galería

> **Estado:** Implementado.
> **Depende de:** SPEC 02
> **Fecha:** 2026-11-15
> **Objetivo:** Mostrar la imagen `public/img/karaoke.jpg` como banner informativo de ancho completo entre la galería y el banner "Aquí te esperamos, en Tepic".

## Alcance

**Dentro:**

- Componente nuevo `src/components/KaraokeBanner.tsx` con la imagen `/img/karaoke.jpg` dentro de una `section` con el mismo ancho máximo (1200 px), padding horizontal, radio (`rounded-card`) y sombra (`shadow-card`) que `LocalBanner`.
- Montarlo en `src/App.tsx` entre `<Gallery />` y `<LocalBanner />`.
- Texto alternativo descriptivo: "Viernes de Karaoke en La Enriqueta: ven a cantar, cena y disfruta. ¡Tú eliges la canción, tú eres la estrella!". El texto visible es solo el que ya trae la imagen.
- Diseño responsive:
  - Menos de 640 px: altura fija de 320 px con `object-cover` centrado, para que el logo, "KARAOKE" y el micrófono se lean; se pierden los bordes laterales.
  - Desde 640 px: proporción original de la imagen (1584 × 672), sin recorte.
- Entrada con `Reveal`, mismos parámetros que el resto de secciones.
- Un test en `src/App.test.tsx` que verifica la imagen y su posición.

**Fuera de alcance (para specs futuras):**

- Texto en HTML sobre o bajo la imagen (título, horario, descripción).
- Enlace, botón o visor ampliado al tocar el banner; el banner es solo informativo.
- Enlace en el menú de navegación o `id` de ancla para el banner.
- Datos editables (fecha, horario) o mostrarlo solo los viernes.
- Optimización de la imagen (850 KB): recorte, WebP/AVIF o versiones por tamaño.
- Cambios en `Gallery`, `LocalBanner`, `Header`, `Hero`, `Contact`, `Footer` o en `site`.
- Animaciones nuevas más allá de `Reveal`.

## Modelo de datos

Esta feature no introduce estructuras de datos nuevas. La ruta `/img/karaoke.jpg` y el texto alternativo viven dentro del componente, igual que la imagen de `LocalBanner`.

Archivos que aparecen o cambian:

| Archivo                            | Cambio                                                |
| ---------------------------------- | ----------------------------------------------------- |
| `src/components/KaraokeBanner.tsx` | Nuevo. Banner con la imagen y su `Reveal`             |
| `src/App.tsx`                      | Monta `KaraokeBanner` entre `Gallery` y `LocalBanner` |
| `src/App.test.tsx`                 | Test de presencia y orden del banner                  |

## Plan de implementación

1. Crear `src/components/KaraokeBanner.tsx` con la `section`, `Reveal`, el contenedor con `rounded-card` y `shadow-card`, y la imagen con la altura de 320 px en móvil y la proporción 1584 / 672 desde 640 px. Verificar: `npm run typecheck`.
2. Montar `<KaraokeBanner />` en `src/App.tsx` entre `<Gallery />` y `<LocalBanner />`. Verificar: `npm run dev`; el banner aparece tras la galería a 375 px y a 1280 px.
3. Añadir el test a `src/App.test.tsx`: la imagen existe con su `alt`, va después de la sección `#galeria` y antes del banner "Aquí te esperamos, en Tepic", y no contiene enlaces ni botones. Verificar: `npm test`.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm test` y `npm run build` terminan sin errores; `format:check` no falla por los archivos tocados.
- [ ] El banner aparece entre la galería y "Aquí te esperamos, en Tepic", y la imagen cargada es `/img/karaoke.jpg`.
- [ ] La imagen tiene un `alt` que menciona "Viernes de Karaoke" y no hay texto HTML visible duplicado en el banner.
- [ ] Tocar o hacer clic en el banner no hace nada: no contiene enlaces ni botones.
- [ ] A 375 px no hay scroll horizontal de la página; el banner mide 320 px de alto y se ven el logo, "KARAOKE" y "Viernes de Karaoke" sin cortarse.
- [ ] Desde 640 px la imagen se ve completa, sin recorte, con la proporción 1584 / 672.
- [ ] El banner usa el mismo ancho máximo, radio y sombra que `LocalBanner`.
- [ ] Con `prefers-reduced-motion: reduce` el banner se ve de inmediato (`Reveal` sin cambios).
- [ ] La imagen carga con `loading="lazy"` y no hay dependencias nuevas en `package.json`; los colores de `@theme` conservan sus valores.

## Decisiones

- **Sí:** solo la imagen, sin texto HTML. La imagen ya trae "Viernes de Karaoke" y su lema; duplicarlo desalinea y se lee dos veces. El mensaje original quedó cortado en "que diga…" y el usuario confirmó este camino.
- **No:** título y horario en HTML. Si el cliente quiere cambiar el texto sin generar otra imagen, va en otra spec.
- **Sí:** entre la galería y `LocalBanner`, como pidió el usuario ("después de la galería"). `LocalBanner` queda después.
- **Sí:** recorte al centro y 320 px de alto en móvil. A 375 px la proporción original da unos 160 px y el texto sería ilegible; se prefiere perder los bordes laterales.
- **No:** imagen completa sin recorte en móvil. Se ve toda la composición pero el texto es diminuto.
- **Sí:** banner solo informativo, sin enlace ni visor. Coincide con el resto de secciones y no añade estado ni código.
- **No:** visor ampliado ni enlace a `#ubicacion`. Se pueden añadir en otra spec si hace falta.
- **Sí:** reutilizar `Photo` y `Reveal` y las clases de `LocalBanner`. Mantiene la consistencia visual y no crea componentes nuevos de apoyo.

## Riesgos

| Riesgo                                                                                | Mitigación                                                                       |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| La imagen pesa 850 KB y retrasa la carga en móvil                                     | `loading="lazy"` (ya lo aplica `Photo`); la optimización queda fuera de alcance. |
| El recorte en móvil corta parte del mensaje                                           | Altura de 320 px y `object-cover` centrado; se revisa a 375 px en el paso 2.     |
| El texto está dentro de la imagen: no se puede editar ni lo leen lectores de pantalla | `alt` descriptivo con el contenido; cambiar el texto requiere una imagen nueva.  |
| El banner queda pegado visualmente a `LocalBanner`                                    | Ambos usan el mismo `padding-top` superior; se revisa el espaciado en el paso 2. |

## Qué **no** entra en esta spec

- Texto o horario en HTML sobre la imagen.
- Enlaces, botones o visor ampliado.
- Enlace en el menú de navegación.
- Optimización o versiones de la imagen.
- Cambios en otras secciones del sitio.
