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

