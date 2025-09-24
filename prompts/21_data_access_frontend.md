# Prompt 21 — Acceso a Datos en Frontend (React Query + Zustand)

Objetivo: estandarizar hooks y cachés para consumir el backend Flask (Option A) que proxyea Google Classroom.

## Patrones
- React Query para fetch, cache y reintentos.
- Claves de cache por entidad: `['courses']`, `['courses', id]`, etc.
- Zustand para UI state (filtros, selección), no para datos remotos.

## Hooks sugeridos
- `useCourses()` — GET `${VITE_BACKEND_URL}/api/courses` (paginado)
- `useCourse(id)` — (si hay endpoint de detalle) o derivado de lista
- `useAssignments(courseId)` — GET `${VITE_BACKEND_URL}/api/courses/${courseId}/courseWork`
- `useSubmissions(courseId, assignmentId)` — GET `${VITE_BACKEND_URL}/api/courses/${courseId}/courseWork/${assignmentId}/submissions`
- `useStudents(courseId)` / `useTeachers(courseId)`

## Tipos (TS)
- Reutilizar contratos de `docs/API_CONTRACTS.md` y `docs/DATA_MODEL.md`.

## Errores y reintentos
- Retries: 2 con backoff.
- Invalidar queries en mutaciones `upsert*`.

## Aceptación
- Hooks cubren vistas del dashboard.
- Claves de cache documentadas.
