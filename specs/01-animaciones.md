# SPEC 01 — Animaciones de la página

> **Estado:** Aprobado
> **Depende de:** ninguna
> **Fecha:** 2026-11-09
> **Objetivo:** Añadir animaciones sutiles con la librería `motion` (reveal al scroll, entrada del Hero, hover y header al scroll) respetando `prefers-reduced-motion`.

## Alcance

**Dentro:**

- Dependencia nueva `motion` (import desde `motion/react`).
- Componente `src/components/Reveal.tsx`: wrapper con fade + translateY de 24 px, 600 ms, una sola vez (`whileInView`, `viewport={{ once: true }}`).
- Reveal en los encabezados de sección (`Menu`, `About`, `Gallery`, `Contact`), en las tarjetas del menú (con stagger corto) y en las celdas de la galería.
- Entrada del `Hero` al cargar: etiqueta, `h1`, párrafo y botones en cascada.
- Micro-interacciones hover/tap: botones CTA (escala leve), tarjetas del menú (migrar el `hover:-translate-y` actual a `motion`), imágenes de la galería (zoom leve de la foto).
- Header: fondo y sombra más marcados al pasar de `scrollY > 8`.
- `prefers-reduced-motion`: con la preferencia activa el contenido se muestra directo, sin transform ni retraso (`MotionConfig reducedMotion="user"` en `src/main.tsx`).
- Mock de `IntersectionObserver` en `src/test/setup.ts` para que los tests sigan pasando en jsdom.

**Fuera de alcance (para specs futuras):**

- Animación del menú móvil del Header (abrir/cerrar).
- Transición al cambiar de categoría en el menú (las tarjetas nuevas se montan con el reveal normal, sin `AnimatePresence`).
- Animación de `PapelPicado` (banderitas) del Hero.
- Parallax, scroll-linked animations, animaciones de página/ruta.
- Animar los links del header.

## Modelo de datos

Esta feature no introduce estructuras de datos nuevas. Solo un componente con props:

```ts
type RevealProps = {
  children: ReactNode;
  delay?: number; // segundos, para stagger
  className?: string;
};
```

Convenciones:

- Duración 0.6 s, easing `easeOut`, desplazamiento inicial `y: 24`.
- Stagger de tarjetas: `delay = (index % 3) * 0.08`, para que no crezca con listas largas.

## Plan de implementación

1. Instalar `motion` (`npm i motion`) y añadir mock de `IntersectionObserver` en `src/test/setup.ts`. Verificar: `npm test` pasa.
2. Envolver `<App />` en `<MotionConfig reducedMotion="user">` en `src/main.tsx`. Verificar: `npm run dev` carga igual que antes.
3. Crear `src/components/Reveal.tsx`. Verificar: `npm run typecheck`.
4. Aplicar `Reveal` a los encabezados de sección en `Menu.tsx`, `Gallery.tsx`, `About.tsx` y `Contact.tsx`. Verificar: al hacer scroll aparecen con fade-up.
5. Aplicar `Reveal` con stagger a las tarjetas de `Menu.tsx` y a las celdas de `Gallery.tsx`.
6. Entrada del `Hero.tsx`: `motion.div`/`motion.h1`/`motion.p` con `initial`/`animate` en cascada. Verificar: recargar y ver la secuencia.
7. Hover/tap: `whileHover`/`whileTap` en los CTA de `Hero.tsx`, tarjetas de `Menu.tsx` (retirar `hover:-translate-y-[3px]` de Tailwind) y zoom de foto en `Gallery.tsx`.
8. Header al scroll: en `Header.tsx`, estado `scrolled` con `useMotionValueEvent(scrollY, ...)` y clases condicionales de fondo/sombra.
9. Ajustar tests en `src/App.test.tsx` solo si alguno falla por las animaciones.

## Criterios de aceptación

- [ ] `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm test` pasan sin errores.
- [ ] `npm run build` termina sin errores.
- [ ] `motion` aparece en `dependencies` de `package.json` y no se añadió ninguna otra librería de animación.
- [ ] Al cargar la página, el `h1` del Hero entra con fade + desplazamiento en menos de 1.5 s en total.
- [ ] Cada encabezado de sección y cada tarjeta del menú está oculto fuera del viewport y se revela al entrar en él.
- [ ] Una vez revelado, un elemento no vuelve a ocultarse al hacer scroll hacia arriba.
- [ ] Pasar el cursor sobre una tarjeta del menú la eleva y sobre una foto de la galería aplica zoom.
- [ ] Con `scrollY > 8` el header cambia de fondo/sombra; en `scrollY = 0` vuelve al estado original.
- [ ] Con `prefers-reduced-motion: reduce` activado en el sistema/DevTools, todo el contenido se ve de inmediato y sin desplazamiento.
- [ ] Los enlaces `#menu`, `#galeria`, etc. siguen llevando a su sección y los CTA siguen abriendo WhatsApp.
- [ ] Cambiar de categoría en el menú sigue mostrando solo las tarjetas de esa categoría, todas visibles tras el reveal.

## Decisiones

- **Sí:** `motion` (decisión del usuario). Da `whileInView`, `MotionConfig` y control del stagger sin código propio.
- **No:** CSS + `IntersectionObserver` propio. Más ligero, pero el usuario eligió `motion`.
- **Sí:** `MotionConfig reducedMotion="user"` global. Un único punto cubre toda la app.
- **Sí:** reveal sutil y de una sola vez. Evita que la página se sienta recargada al hacer scroll arriba y abajo.
- **Sí:** stagger acotado con `index % 3`. Con muchos platos, un retraso lineal haría esperar demasiado.
- **No:** `AnimatePresence` para el filtro de categorías. Añade complejidad de layout; va en otra spec si se quiere.
- **Sí:** mock de `IntersectionObserver` en el setup de tests, porque jsdom no lo implementa y `whileInView` lo necesita.

## Riesgos

| Riesgo                                                          | Mitigación                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Contenido invisible si falla JS o el observer                   | `Reveal` solo oculta tras montarse; con reduced-motion se muestra directo.                 |
| Peso extra del bundle por `motion`                              | Importar solo desde `motion/react`; revisar el tamaño en `npm run build`.                  |
| `position: sticky` del header afectado por transforms ancestros | No aplicar `Reveal` ni transforms a contenedores del header; solo cambiar clases.          |
| Tests que buscan texto fallan por estado inicial `opacity: 0`   | `getByText` no depende de opacidad; si algo falla, ajustar el test en el paso 9.           |

## Qué **no** entra en esta spec

- Animación del menú móvil del Header.
- Transiciones al filtrar categorías del menú.
- Animación de las banderitas del Hero.
- Parallax y animaciones ligadas al scroll.
- Animaciones de rutas (el sitio es de una sola página).
