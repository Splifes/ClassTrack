# Prompt 15 — Theme & Tokens → Tailwind Config

Objetivo: transformar los design tokens en un tema de Tailwind y utilidades, sin salir del stack definido.

Instrucciones
- Usa `docs/design/TOKENS.md` para mapear colores, tipografía, radios, sombras y breakpoints en `tailwind.config.js`.
- Crea `src/styles/tokens.css` solo con comentarios de referencia (si se usa), y asegura `@tailwind base; @tailwind components; @tailwind utilities;` en `src/index.css`.
- Extiende el tema: `colors`, `fontFamily`, `fontSize`, `borderRadius`, `boxShadow`, `screens`, `transitionDuration`, `transitionTimingFunction`.
- No añadir dependencias extra; solo Tailwind y PostCSS.

Criterios de aceptación
- Clases generadas reflejan los tokens (ej.: `bg-primary-500`, `text-neutral-900`).
- Tipografías y tamaños definidos coherentemente con la guía.
- Radios y sombras aplicables en `Card`, `Button`.
