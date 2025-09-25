# Prompt 10 — Roles y Vistas por Rol

Objetivo: implementar control de acceso básico por roles (student, teacher, coordinator) y vistas adaptadas.

Instrucciones
- `src/types/auth.ts`: definir `UserRole = 'student' | 'teacher' | 'coordinator'` y `User`.
- `src/store/auth.ts`: asegurar que el estado incluya `role: UserRole` (placeholder si el backend aún no lo provee) y acciones `setRole(role)`.
- `src/routes/guards/RoleGuard.tsx`: HOC/componente que reciba `allowed: UserRole[]` y redirija si el usuario no tiene permiso.
- Rutas y páginas:
  - Student: vista con tareas pendientes, progreso y recordatorios.
  - Teacher: vista con clases, entregas por curso y alertas.
  - Coordinator: dashboard con métricas globales y filtros por cohorte/curso/docente.
- Navbar/Sidebar: mostrar entradas según rol.
- Aceptación
  - Si `role='student'` solo se ven páginas de alumno; idem teacher/coordinator.
  - `RoleGuard` probado en al menos 3 rutas.
  - Cambio de rol (temporal) desde un selector en entorno de desarrollo.
- Calidad
  - Tipado estricto, sin `any`.
  - No duplicar páginas; reutilizar componentes y layout.
