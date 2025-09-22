# Servicio Google Classroom API

## Propósito
Maneja todas las interacciones con la API de Google Classroom para obtener datos de cursos, estudiantes y entregas.

## Funcionalidades Principales
- **Cursos**: Obtener lista y detalles de cursos
- **Estudiantes**: Lista de estudiantes por curso
- **Tareas**: CourseWork y entregas de estudiantes
- **Entregas**: StudentSubmissions con estados y calificaciones
- **Datos Completos**: Método para obtener toda la información de un curso

## Estructura de la Clase
```typescript
class GoogleClassroomService {
  private accessToken: string
  constructor(accessToken: string)
}
```

## Métodos Principales
- `getCourses()`: Lista de cursos del usuario
- `getCourse(courseId)`: Detalles de un curso específico
- `getCourseStudents(courseId)`: Estudiantes de un curso
- `getCourseWork(courseId)`: Tareas de un curso
- `getStudentSubmissions(courseId, courseWorkId)`: Entregas de una tarea
- `getCompleteCourseData(courseId)`: Datos completos del curso

## Configuración API
- **Base URL**: `https://classroom.googleapis.com/v1`
- **Timeout**: 10 segundos
- **Headers**: Authorization Bearer token

## Scopes Requeridos
- `classroom.courses.readonly`
- `classroom.rosters.readonly`
- `classroom.coursework.me.readonly`
- `classroom.student-submissions.students.readonly`

## Manejo de Errores
- Respuestas tipadas con `ApiResponse<T>`
- Timeout y errores de red
- Validación de respuestas HTTP

## Patrón Singleton
- Instancia única del servicio
- Inicialización con token de acceso
- Reutilización en toda la aplicación

