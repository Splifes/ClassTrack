# Prompt 05 — Estado Global, Tipos y Hooks

Objetivo: definir el contrato de datos y estado global, y hooks de dominio.

Instrucciones
- `src/types/`: contratos para Course, Student, Teacher, CourseWork, Submission y enums de estado.
- `src/store/`: slices para filtros (cohorte, profesor, estado entrega), auth (mínimo), ui (sidebar, tema).
- Hooks de dominio (`src/hooks/`): `useFilters()`, `useProgressMetrics()` (calcula % entregas a tiempo por cohorte), `useRiskFlags()` (reglas simples: faltas + atrasos).
- Aceptación:
  - Tipado sin `any`.
  - Store con acciones puras y predecibles.
  - Hooks con entradas/salidas claras y tests de ejemplo opcionales.
