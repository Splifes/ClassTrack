# Prompt 02 — App Shell & Routing

Objetivo: implementar el esqueleto de la app con React Router y layout base (documental, MD-only).

Instrucciones
- Añade React Router DOM (documentado).
- Rutas base esperadas (SPA):
  - `/` (Dashboard)
  - `/students`
  - `/courses`
  - `/auth/callback` (retorno OAuth; luego consultar `GET ${VITE_BACKEND_URL}/api/auth/me`)

- Rutas de detalle (Curso y Clase):
  - `/courses/:courseId` → Detalle de Curso (lista de clases/sesiones del curso, mapea a CourseWork)
  - `/courses/:courseId/classes/:classId` → Detalle de Clase (materiales/fechas/estado + panel de chat documental)

- Páginas (placeholders/documentales):
  - `Dashboard`, `Students`, `Courses`, `CourseDetail`, `ClassDetail`
  - Layout: `Navbar`, `Sidebar`, `Layout` con estructura responsive (Bootstrap 5)
- Aceptación (documental):
  - Rutas declaradas y consistentes con `docs/design/ROLES_VIEWS.md`.
  - Layout consistente en todas las vistas.
  - En `/auth/callback` se consulta `GET /api/auth/me` (documentado) para estado de usuario.
  - Rutas de Curso/Clase enlazadas desde `Courses` → `CourseDetail` → `ClassDetail`.
- Calidad (documental):
  - Tipado estricto, sin `any` (cuando se implemente).
  - Accesibilidad básica (roles ARIA en navbar/sidebar, foco visible).
  - Guards por rol (documental): `RoleGuard({ allowed })` en rutas sensibles (p. ej. `/students` global → solo `coordinator`).
