# Prompt 13 — QA / Smoke Tests rápidos

Objetivo: validar lo mínimo viable en cada fase para evitar sorpresas.

Instrucciones
- Añadir script `pnpm type-check` (TS) y `pnpm lint` si se configuró ESLint.
- Pruebas manuales guiadas (sin framework, por tiempo):
  1) App arranca en `http://localhost:5173` sin errores en consola.
  2) Navegación funciona entre `/`, `/students`, `/courses`.
  3) Login OAuth server-side (backend Flask): `GET /api/auth/login` redirige a Google; retorna por `/oauth/callback` (backend) y luego `/auth/callback` (frontend) mostrando email en UI.
  4) Classroom API: listar cursos, alumnos, profesores, tareas. Manejo de `loading`/`error` visible.
  5) Filtros: cohorte/profesor/estado aplican sobre las tablas.
  6) UI: botones deshabilitados muestran estado `loading`, focus visible en elementos interactivos.
- Opcional (si hay tiempo):
  - Añadir `vitest` y crear 3 tests unitarios sencillos (utilidades y hooks puros).

Criterios de aceptación
- Sin errores de TS al compilar.
- Flujo principal completo sin errores en consola.
- Estados de `loading`/`error` visibles.
- Accesibilidad básica: navegación por teclado en navbar/sidebar y labels en formularios.
