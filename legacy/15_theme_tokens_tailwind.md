# Prompt 15 — Theme & Tokens → Bootstrap + CSS Variables

Objetivo: mapear design tokens a variables CSS y clases utilitarias compatibles con Bootstrap 5 sin introducir Tailwind.

Instrucciones
- Usa `docs/design/TOKENS.md` para definir variables en `src/styles/theme.css` (ej.: `--color-primary`, `--radius-md`, `--shadow-sm`).
- Overridea variables de Bootstrap cuando aplique en `:root` (ej.: `--bs-primary`, `--bs-body-font-family`, `--bs-border-radius`).
- Crea utilidades mínimas en `theme.css` para gaps/spacing o helpers no cubiertos por Bootstrap (opcional).
- Importa `theme.css` en `src/main.tsx` o `src/index.css` después del CSS de Bootstrap.

Criterios de aceptación
- Colores, tipografía, radios y sombras del diseño aplican a componentes Bootstrap (`btn`, `card`, etc.).
- No hay dependencias adicionales; solo Bootstrap + CSS propio.
- Documentación breve de qué tokens se mapean a qué variables Bootstrap.
