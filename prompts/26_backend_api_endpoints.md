# Prompt 26 — Endpoints REST (Flask) para Classroom y Datos

Objetivo: definir endpoints REST del backend para servir datos al frontend y/o proxyear llamadas a Google Classroom con el token del usuario autenticado.

## Endpoints
- `GET /api/health` → `{ status: 'ok' }`
- `GET /api/auth/me` → datos básicos del usuario autenticado
- `GET /api/courses` → lista cursos (proxy a Google Classroom `v1/courses`)
- `GET /api/courses/:courseId/students` → lista estudiantes del curso
- `GET /api/courses/:courseId/teachers` → lista docentes del curso
- `GET /api/courses/:courseId/courseWork` → lista tareas del curso
- `GET /api/courses/:courseId/courseWork/:workId/submissions` → entregas por tarea

## Reglas
- Usar token del usuario desde la sesión/DB. Si no hay token, 401.
- Manejo de paginación con `pageSize` y `pageToken`.
- Manejo de rate limits: si Google devuelve 429/5xx, aplicar backoff y retornar error claro al frontend.
- Sanitizar respuestas y mapear a contratos en `docs/API_CONTRACTS.md`.

## Criterios de aceptación
- Respuestas tipadas y consistentes con el frontend.
- Errores con código y mensaje (`{ error: { code, message } }`).
- Tests rápidos manuales con curl o Postman.
