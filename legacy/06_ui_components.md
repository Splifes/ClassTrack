# Prompt 06 — UI Components (Button, Card, Table, Filters)

Objetivo: componer UI reutilizable y accesible.

Instrucciones
- `src/components/ui/`:
  - `Button`, `Card`, `Badge`, `Input`, `Select` (con `label` accesible), `Table` (simple), `Spinner`.
  - Estilo: Bootstrap 5 (usar clases `btn`, `card`, `form-control`, `table`, etc.).
  - Utilidad opcional `cn()` solo con `clsx` (sin `tailwind-merge`).
- Aceptación:
  - Props tipadas, variantes alineadas a Bootstrap (`primary`, `secondary`, `outline`, `link`).
  - Estados `loading`, `disabled`.
  - Accesibilidad: ARIA y focus states.
