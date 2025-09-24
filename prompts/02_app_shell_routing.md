# Prompt 02 — App Shell & Routing

Objetivo: implementar el esqueleto de la app con React Router y layout base.

Instrucciones
- Añade React Router DOM.
- Archivos:
  - `src/routes/index.tsx` con rutas: `/`, `/students`, `/courses`.
  - Incluir ruta de autenticación: `/auth/callback` para consumir `GET ${VITE_BACKEND_URL}/api/auth/me` al retornar del login.
  - Páginas: `src/pages/Dashboard.tsx`, `src/pages/Students.tsx`, `src/pages/Courses.tsx` (placeholders con títulos y secciones vacías).
  - `src/components/layout/Navbar.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/Layout.tsx` con estructura responsive y clases de Bootstrap (navbar, container, grid).
- Aceptación:
  - Navegación entre páginas funciona.
  - Layout consistente en todas las vistas.
  - En `/auth/callback` se actualiza el estado de usuario usando el backend.
- Calidad:
  - Tipado estricto, sin `any`.
  - Accesibilidad básica (roles ARIA en navbar/sidebar, foco visible).
