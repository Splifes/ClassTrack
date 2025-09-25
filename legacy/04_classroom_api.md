# Prompt 04 — Integración con Backend (proxy a Google Classroom)

Objetivo: consumir la API del backend Flask para cursos, estudiantes, profesores y tareas (el backend proxyea Google Classroom con el token del usuario autenticado).

Instrucciones
- Servicio `src/services/classroom.ts` con funciones:
  - `listCourses()` → `GET ${VITE_BACKEND_URL}/api/courses`
  - `listStudents(courseId)` → `GET ${VITE_BACKEND_URL}/api/courses/${courseId}/students`
  - `listTeachers(courseId)` → `GET ${VITE_BACKEND_URL}/api/courses/${courseId}/teachers`
  - `listCourseWork(courseId)` → `GET ${VITE_BACKEND_URL}/api/courses/${courseId}/courseWork`
  - `listSubmissions(courseId, workId)` → `GET ${VITE_BACKEND_URL}/api/courses/${courseId}/courseWork/${workId}/submissions`
- No manejar tokens de Google en el frontend; el backend usa la sesión del usuario.
- Paginación con `pageSize` y `pageToken` via query params.
- Tipado con `src/types/classroom.ts` según `docs/API_CONTRACTS.md`.

React Query
- Hooks `useCourses`, `useStudents`, `useTeachers`, `useCourseWork`, `useSubmissions` con claves de caché estandarizadas.
- Manejo de loading/error y reintentos mínimos.

Aceptación
- Las páginas renderizan listas con estados `loading/error/empty`.
- Funciona la paginación con `nextPageToken`.
- No se filtra ningún secreto al cliente.

Calidad
- Tipos TS sólidos y normalización básica de datos.
- No bloquear UI: usar loaders/placeholder adecuados.
