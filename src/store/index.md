# Estado Global - Zustand Store

## Propósito
Arquitectura de estado usando Zustand para manejo eficiente del estado de la aplicación con React Query para datos remotos.

## Estructura de Stores
El estado se divide en 7 stores especializados:

### 1. AuthStore
- **Estado**: Usuario autenticado, loading, errores
- **Acciones**: setUser, logout, setLoading, setError
- **Persistencia**: localStorage para usuario y autenticación

### 2. StudentsStore
- **Estado**: Lista de estudiantes, estudiante seleccionado, filtros
- **Acciones**: setStudents, setSelectedStudent, setFilters
- **Derivadas**: getFilteredStudents, getStudentsAtRisk

### 3. TeachersStore
- **Estado**: Lista de profesores, profesor seleccionado
- **Acciones**: setTeachers, setSelectedTeacher
- **Derivadas**: getTeacherById, getTeachersByCourse

### 4. CoursesStore
- **Estado**: Lista de cursos, curso seleccionado
- **Acciones**: setCourses, setSelectedCourse
- **Derivadas**: getCourseById, getCoursesByTeacher, getCoursesAtRisk

### 5. SubmissionsStore
- **Estado**: Lista de entregas, filtros
- **Acciones**: setSubmissions, setFilters
- **Derivadas**: getFilteredSubmissions, getSubmissionsByState, getLateSubmissions

### 6. CohortsStore
- **Estado**: Lista de cohortes, cohorte seleccionado
- **Acciones**: setCohorts, setSelectedCohort
- **Derivadas**: getCohortById, getCohortsAtRisk

### 7. DashboardStore
- **Estado**: Métricas del dashboard, datos de gráficos
- **Acciones**: setMetrics, setChartData, updateMetrics
- **Derivadas**: Cálculo automático de métricas

### 8. UIStore
- **Estado**: Sidebar, página actual, notificaciones, modales
- **Acciones**: toggleSidebar, setCurrentPage, addNotification
- **Persistencia**: localStorage para preferencias de UI

## Patrones de Diseño
- **DevTools**: Integración con Redux DevTools
- **Persistencia**: Middleware persist para datos importantes
- **Selectores**: Hooks personalizados para acceso fácil
- **Acciones Globales**: useAppActions para acciones comunes

## Integración
- Se conecta con servicios de API
- Maneja estado de loading y errores
- Proporciona datos a componentes React
- Sincronización con Google Classroom API

## Mapa de Integración (documental)

- Dashboard
  - Hooks: `useCourses()`, `useAssignments(courseId)`, `useSubmissions(courseId, assignmentId)`
  - Servicios: `getCourses`, `getCourseWork`, `getStudentSubmissions`
  - Claves de cache: `['courses']`, `['courses', courseId, 'courseWork']`, `['courses', courseId, 'courseWork', workId, 'submissions']`
  - Slices: `DashboardStore` (métricas), `UIStore` (filtros/selección)

- Students
  - Hooks: `useStudents(courseId)`
  - Servicios: `getCourseStudents`
  - Claves de cache: `['courses', courseId, 'students']`
  - Slices: `StudentsStore` (lista/filtros/selección)

- Courses
  - Hooks: `useCourses()`
  - Servicios: `getCourses`
  - Claves de cache: `['courses']`
  - Slices: `CoursesStore` (lista/selección)

Notas:
- React Query gestiona datos remotos y cache. Zustand gestiona UI/filtros/selección.
- Ver contratos en `docs/API_CONTRACTS.md` y prompts `05_state_types_hooks.md`, `21_data_access_frontend.md`.

