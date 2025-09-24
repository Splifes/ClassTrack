# Servicio Google Classroom API

## Propósito
Maneja las interacciones con datos de Google Classroom a través del backend Flask (proxy). El frontend NO usa tokens de Google directamente.

## Funcionalidades Principales
- **Cursos**: Obtener lista y detalles de cursos
- **Estudiantes**: Lista de estudiantes por curso
- **Tareas**: CourseWork y entregas de estudiantes
- **Entregas**: StudentSubmissions con estados y calificaciones
- **Datos Completos**: Método para obtener toda la información de un curso

## Estructura de la Clase
```typescript
class ClassroomApiService {
  constructor(private baseUrl: string) {}
}
```

## Métodos Principales
- `getCourses()`: `GET ${VITE_BACKEND_URL}/api/courses`
- `getCourse(courseId)`: `GET ${VITE_BACKEND_URL}/api/courses/:courseId` (si aplica)
- `getCourseStudents(courseId)`: `GET ${VITE_BACKEND_URL}/api/courses/:courseId/students`
- `getCourseWork(courseId)`: `GET ${VITE_BACKEND_URL}/api/courses/:courseId/courseWork`
- `getStudentSubmissions(courseId, courseWorkId)`: `GET ${VITE_BACKEND_URL}/api/courses/:courseId/courseWork/:workId/submissions`
- `getCompleteCourseData(courseId)`: Composición de las llamadas anteriores

### Contratos por método (documental)

- `getCourses()`
  - Endpoint: `GET /api/courses`
  - Params: `pageSize?`, `pageToken?`
  - Status: `200`
  - Respuesta: `{ courses: Course[], nextPageToken?: string }`

- `getCourse(courseId)` (opcional si hay endpoint de detalle)
  - Endpoint: `GET /api/courses/{courseId}`
  - Params: `courseId`
  - Status: `200 | 404`
  - Respuesta: `Course`

- `getCourseStudents(courseId)`
  - Endpoint: `GET /api/courses/{courseId}/students`
  - Params: `courseId`, `pageToken?`
  - Status: `200`
  - Respuesta: `{ students: StudentProfile[], nextPageToken?: string }`

- `getCourseWork(courseId)`
  - Endpoint: `GET /api/courses/{courseId}/courseWork`
  - Params: `courseId`, `pageToken?`
  - Status: `200`
  - Respuesta: `{ courseWork: CourseWork[], nextPageToken?: string }`

- `getStudentSubmissions(courseId, courseWorkId)`
  - Endpoint: `GET /api/courses/{courseId}/courseWork/{courseWorkId}/submissions`
  - Params: `courseId`, `courseWorkId`, `pageToken?`
  - Status: `200`
  - Respuesta: `{ studentSubmissions: Submission[], nextPageToken?: string }`

- `getCompleteCourseData(courseId)`
  - Composición: `getCourse(courseId)` + `getCourseWork(courseId)` + `getCourseStudents(courseId)` + `getStudentSubmissions(...)` por cada work.
  - Salida (documental): `{ course, courseWork, students, submissionsByWorkId }`

## Configuración API (frontend)
- **Base URL frontend**: `${import.meta.env.VITE_BACKEND_URL}`
- **Timeout**: 10 segundos
- **Headers**: Cookies/sesión manejadas por backend (no bearer token de Google en el cliente)

## Scopes Requeridos
- Configurados en el backend Flask al iniciar el flujo OAuth.

## Manejo de Errores
- Respuestas tipadas con `ApiResponse<T>`
- Timeout y errores de red
- Validación de respuestas HTTP

## Patrón Singleton
- Instancia única del servicio
- Inicialización con `baseUrl` (usar `VITE_BACKEND_URL`)
- Reutilización en toda la aplicación

