# Prompt 04 — Integración Google Classroom API

Objetivo: consumir endpoints de Classroom para cursos, estudiantes, profesores y tareas.

Instrucciones
- Servicio `src/services/classroom.ts` con funciones:
  - `listCourses`, `listStudents(courseId)`, `listTeachers(courseId)`, `listCourseWork(courseId)`, `listSubmissions(courseId, courseWorkId)`.
  - Usar `fetch`/`axios` con token del usuario.
  - Paginación, manejo de errores, tipado con `src/types/classroom.ts`.
- React Query:
  - Hooks `useCourses`, `useStudents`, `useTeachers`, `useCourseWork`, `useSubmissions`.
- Aceptación:
  - Capaz de obtener y renderizar listas (en páginas) con estados loading/error.
  - Filtrar por cohorte/profesor/estado de entrega (placeholder inicial con filtros locales).
- Calidad:
  - Tipos TS sólidos y normalización básica de datos.
  - No bloquear UI: usar `suspense` opcional o loaders.
