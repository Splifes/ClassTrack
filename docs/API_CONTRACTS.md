# API Contracts — Google Classroom Integration (Documento, sin código)

Este documento define los contratos esperados al integrar la API de Google Classroom. Sirve para tipar en el frontend y acordar expectativas de datos.

## Autenticación
- Protocolo: OAuth 2.0 Authorization Code en backend Flask (server-side).
- Identidad: email de la cuenta de Google.
- Tokens: Access/Refresh gestionados por el backend. El frontend no maneja tokens de Google.

## Scopes mínimos sugeridos
- Alinear con `README02.md` y `docs/ENV_SETUP.md` (Option A):
- `https://www.googleapis.com/auth/classroom.courses.readonly`
- `https://www.googleapis.com/auth/classroom.rosters.readonly`
- `https://www.googleapis.com/auth/classroom.student-submissions.students.readonly`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`
- `openid`

## Endpoints (resumen)

### Backend (consumidos por frontend)

#### Autenticación (flujo OAuth server-side)

- Iniciar login
  - GET `${VITE_BACKEND_URL}/api/auth/login`
  - Comportamiento: responde `302 Found` y redirige a Google OAuth.
  - Errores: `500` si falta configuración.

- Callback OAuth (backend)
  - GET `${VITE_BACKEND_URL}/oauth/callback`
  - Comportamiento: procesa el `code`, establece sesión/credenciales seguras, y redirige al frontend (p. ej. `/auth/callback`).
  - Respuestas: `302 Found` (redirect). Errores `400/401/500` según el caso.

- Sesión actual (me)
  - GET `${VITE_BACKEND_URL}/api/auth/me`
  - Respuesta `200`: `{ email: string, name?: string, picture?: string }`
  - `401` si no autenticado.

- Listar cursos
  - GET `${VITE_BACKEND_URL}/api/courses`
  - Query: `pageSize`, `pageToken`
  - Respuesta: `{ courses: Course[], nextPageToken?: string }`

- Miembros (estudiantes) de un curso
  - GET `${VITE_BACKEND_URL}/api/courses/{courseId}/students`
  - Respuesta: `{ students: StudentProfile[], nextPageToken?: string }`

- Profesores de un curso
  - GET `${VITE_BACKEND_URL}/api/courses/{courseId}/teachers`
  - Respuesta: `{ teachers: TeacherProfile[], nextPageToken?: string }`

- Tareas (courseWork) de un curso
  - GET `${VITE_BACKEND_URL}/api/courses/{courseId}/courseWork`
  - Respuesta: `{ courseWork: CourseWork[], nextPageToken?: string }`

- Entregas (submissions) por tarea
  - GET `${VITE_BACKEND_URL}/api/courses/{courseId}/courseWork/{courseWorkId}/submissions`
  - Respuesta: `{ studentSubmissions: Submission[], nextPageToken?: string }`

### Referencia Google (usadas por el backend)

- Listar cursos
  - GET `https://classroom.googleapis.com/v1/courses`
  - Query: `pageSize`, `pageToken`
  - Respuesta: `{ courses: Course[], nextPageToken?: string }`

- Miembros (estudiantes) de un curso
  - GET `https://classroom.googleapis.com/v1/courses/{courseId}/students`
  - Respuesta: `{ students: StudentProfile[], nextPageToken?: string }`

- Profesores de un curso
  - GET `https://classroom.googleapis.com/v1/courses/{courseId}/teachers`
  - Respuesta: `{ teachers: TeacherProfile[], nextPageToken?: string }`

- Tareas (courseWork) de un curso
  - GET `https://classroom.googleapis.com/v1/courses/{courseId}/courseWork`
  - Respuesta: `{ courseWork: CourseWork[], nextPageToken?: string }`

- Entregas (submissions) por tarea
  - GET `https://classroom.googleapis.com/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions`
  - Respuesta: `{ studentSubmissions: Submission[], nextPageToken?: string }`

## Modelos de datos (frontend)

- Course
  - `id: string`
  - `name: string`
  - `section?: string`
  - `teacherGroupEmail?: string`
  - `room?: string`
  - `creationTime?: string`

- StudentProfile
  - `userId: string`
  - `emailAddress?: string`
  - `name?: { fullName?: string }`

- TeacherProfile
  - `userId: string`
  - `emailAddress?: string`
  - `name?: { fullName?: string }`

- CourseWork
  - `id: string`
  - `courseId: string`
  - `title: string`
  - `dueDate?: { year: number; month: number; day: number }`
  - `dueTime?: { hours?: number; minutes?: number }`
  - `state?: 'PUBLISHED' | 'DRAFT' | 'DELETED'`

- Submission
  - `id: string`
  - `courseId: string`
  - `courseWorkId: string`
  - `userId: string`
  - `state: 'CREATED' | 'TURNED_IN' | 'RETURNED' | 'RECLAIMED_BY_STUDENT'`
  - `late?: boolean`
  - `assignedGrade?: number`
  - `updateTime?: string`

## Normalización y mapeos
- Estados de entrega (frontend): `entregado`, `atrasado`, `faltante`, `reentrega` mapean según `state` y `late`.
- Cohortes: derivar por convención de `section` o metadatos externos.

## Errores
- 401/403: sesión no válida o scopes insuficientes → relogin.
- 429: rate limiting → backoff exponencial.
- 5xx: reintentos con jitter.

## Paginación
- Usar `pageToken` y acumular resultados hasta completar.

## Seguridad
- Nunca registrar tokens en logs (backend).
- El frontend NO envía `Authorization: Bearer` a Google; consume el backend, que inyecta credenciales al llamar a Google.

## Chat (documental y roadmap)

En Option A (MD-only) se recomienda un widget de chat externo embebido en la vista de Clase. Convención documental de sala: `roomId = ${courseId}-${classId}`.

### Opción recomendada (MD-only)
- Widget externo (p. ej., Tawk.to / Sendbird UIKit Web / similar). No requiere endpoints propios ni cambios de scopes.
- Datos pasados al widget (documental): `roomId`, `displayName`, `email`.

### Roadmap A+: WebSocket propio
- Canal: `/ws/chat/${roomId}` con Flask-SocketIO.
- Mensaje (documental): `{ id, roomId, author, text, timestamp }`.
- Seguridad: autorización por rol; rate limiting.

### Roadmap B: Hilos/Comentarios de Classroom
- Implica scopes de escritura y latencia distinta a chat en vivo.
- Usar recursos de `courses.courseWork` y `studentSubmissions` para comentarios si se habilita.
