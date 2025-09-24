# Vistas por Rol (Documental)

Este documento define qué rutas, vistas, componentes de navegación y datos están habilitados para cada rol: `student`, `teacher`, `coordinator`. Complementa `prompts/10_roles_views.md` y mantiene coherencia con `docs/API_CONTRACTS.md` y `README02.md`.

## Roles
- `student`
- `teacher`
- `coordinator`

## Matriz Rutas × Roles (resumen)

| Ruta                                      | student | teacher | coordinator |
|-------------------------------------------|:-------:|:-------:|:-----------:|
| `/` (Dashboard)                           |   ✔️    |   ✔️    |     ✔️      |
| `/courses`                                |   ✔️    |   ✔️    |     ✔️      |
| `/courses/:courseId`                      |   ✔️    |   ✔️    |     ✔️      |
| `/courses/:courseId/classes/:classId`     |   ✔️    |   ✔️    |     ✔️      |
| `/students` (global)                      |   ✖️    |   ✖️    |     ✔️      |
| `/auth/callback`                          |   ✔️    |   ✔️    |     ✔️      |

Notas:
- Para `teacher`, `/students` es accesible filtrado por curso (p. ej. `/students?courseId=XYZ`).
- Aplicar `RoleGuard({ allowed })` en rutas sensibles.

## Matriz Datos × Roles (resumen)

| Dato                                    | student                 | teacher                              | coordinator                      |
|-----------------------------------------|-------------------------|--------------------------------------|----------------------------------|
| Identidad (`/api/auth/me`)              | ✔️ email, name?, pic?   | ✔️ email, name?, pic?                | ✔️ email, name?, pic?            |
| Cursos (`/api/courses`)                 | ✔️ solo propios         | ✔️ solo asignados                    | ✔️ global                        |
| Clases (`courseWork`)                   | ✔️ por curso propio     | ✔️ por curso asignado                | ✔️ por curso                     |
| Submissions por clase                   | ✔️ solo suya            | ✔️ de alumnos de sus cursos          | ✔️ agregados/visiones globales   |
| Estudiantes por curso (`/students`)     | ✖️                       | ✔️ alumnos de sus cursos             | ✔️ global con filtros            |
| KPIs globales                           | ✖️                       | ✖️                                    | ✔️                                |
| Chat en clase (widget externo)          | ✔️ (roomId curso-clase) | ✔️ (moderación/documental)           | ✔️ (solo lectura opcional)       |

## Matriz de Rutas Permitidas (SPA)

- `/` (Dashboard)
  - student: Resumen personal (tareas pendientes, progreso)
  - teacher: Resumen por cursos asignados
  - coordinator: KPIs globales (cohortes, cursos, alertas)
- `/students`
  - student: No visible (o acceso limitado a su perfil si aplica)
  - teacher: Lista de estudiantes por cursos del docente
  - coordinator: Lista global con filtros por cohorte/curso/docente
- `/courses`
  - student: Cursos del alumno (lectura)
  - teacher: Cursos del docente (gestión de entregas y alertas)
  - coordinator: Todos los cursos (métricas y filtros agregados)
- `/auth/callback`
  - Todos los roles: ruta técnica del flujo OAuth (Option A)

## Navbar/Sidebar por Rol

- student
  - Navbar: Marca, perfil (email), Logout
  - Sidebar: Dashboard, Courses (personales)
- teacher
  - Navbar: Marca, perfil (email/rol), Logout
  - Sidebar: Dashboard, Courses (propios), Students (de sus cursos)
- coordinator
  - Navbar: Marca, perfil (email/rol), Logout
  - Sidebar: Dashboard, Courses (global), Students (global con filtros)

## KPIs y Secciones por Rol

- student
  - KPIs: tareas pendientes, entregas atrasadas, progreso semanal
  - Secciones: Próximas entregas, Últimas calificaciones
- teacher
  - KPIs: atrasos por curso, tasa de entrega, alumnos en riesgo
  - Secciones: Entregas por curso, Alertas, Filtros rápidos
- coordinator
  - KPIs: tasa general de completitud, cursos con más atrasos, cohortes en riesgo
  - Secciones: Filtros por cohorte/curso/docente, Exportes/Reportes

## Flujo Alumno → Curso → Clase (con Chat)

1) Cursos del alumno
   - Ruta: `/courses`
   - Datos: `GET /api/courses` (backend filtra cursos del alumno)
   - Vista: tabla de cursos propios

2) Detalle de curso
   - Ruta: `/courses/:courseId`
   - Datos: `GET /api/courses/:courseId/courseWork` (lista de clases/sesiones)
   - Vista: lista de clases (mapea `courseWorkId` a `classId`)

3) Detalle de clase
   - Ruta: `/courses/:courseId/classes/:classId` (classId ≈ courseWorkId)
   - Datos: `GET /api/courses/:courseId/courseWork/:courseWorkId` (si aplica, o derivado), `GET /api/courses/:courseId/courseWork/:courseWorkId/submissions` (estado personal)
   - Vista: materiales/fechas/estado + Panel de Chat
   - Chat (Opción recomendada MD-only): Widget externo embebido con `roomId = ${courseId}-${classId}`
     - Alternativas (Roadmap): WebSocket propio (Flask-SocketIO) o hilos/remarks de Classroom (requiere scopes de escritura)

## Componentes Clave por Vista (referencia a `COMPONENT_SPECS.md`)

- Dashboard
  - Common: `Card`, `Table`, `Badge`, `Spinner`
  - student: `Card(Próximas entregas)`, `Table(Entregas recientes)`
  - teacher: `Table(Entregas por curso)`, `Badge(Alerta atrasos)`
  - coordinator: `Card(KPIs globales)`, `Table(Resumen por cohorte)`
- Students
  - teacher: `Table(Estudiantes del curso)`, `Input(Filtros)`
  - coordinator: `Table(Estudiantes global)`, `Select(Cohorte/Curso/Docente)`
- Courses
  - Todos: `Table(Cursos)`, `Badge(Estado)`

## Mejoras recomendadas — Student (documental)

- Agenda/Calendario de próximas entregas con `dueDate`/`dueTime` y enlaces a clases.
- Centro de notificaciones (recordatorios, atrasos, feedback nuevo) con prioridades y estados vacíos.
- Estados claros por vista: sin cursos, sin clases, sin entregas, errores de red (ver `COMPONENT_SPECS.md`).
- Accesibilidad reforzada en chat y tablas (roles ARIA, foco, teclado).
- Privacidad/moderación del chat (reglas de convivencia y opción futura de “Report message”).
- Búsqueda y filtros por curso/clase/estado de entrega.
- Preferencias: idioma/tema y silenciar chat por clase (futuro).
- Exportar "mi progreso" (CSV) como futuro.
- Indicador de conexión del chat (conectado/reconectando) y timestamp del último mensaje.

## Mejoras recomendadas — Teacher (documental)

- Dashboard con alertas por curso (atrasos, alumnos en riesgo) y filtros rápidos.
- Vista de estudiantes por curso con búsqueda, filtros por estado de entrega y período.
- Exportes por curso (CSV) para reportes/seguimiento.
- Comunicación contextual: anotaciones/avisos por curso (documental; no requiere scopes extra si es nota interna) y moderación en chat de clase.
- Herramientas de priorización: ordenar por mayor atraso/riesgo.
- Estados vacíos/errores definidos (sin alumnos, sin entregas, error de red).
- Accesibilidad en tablas y navegación por teclado.

## Datos y Contratos (Option A)

- Endpoints base (backend, ver `docs/API_CONTRACTS.md`)
  - Cursos: `GET /api/courses`
  - Estudiantes por curso: `GET /api/courses/{courseId}/students`
  - CourseWork: `GET /api/courses/{courseId}/courseWork`
  - Submissions: `GET /api/courses/{courseId}/courseWork/{courseWorkId}/submissions`
  - Auth: `GET /api/auth/login`, `GET /oauth/callback`, `GET /api/auth/me`
- Autorización documental
  - El backend valida el rol real; en esta doc, el `role` en el store se considera un placeholder para maquetado/guards.

## RoleGuard (documental)

- Componente/HOC: `RoleGuard({ allowed: UserRole[], children })`
- Comportamiento: si el rol actual no está en `allowed`, redirigir a `/` (o mostrar acceso denegado documental)
- Integración: usar en rutas críticas (Students global, Dashboard coordinador)

## Aceptación (documental)

- Si `role='student'`, no se muestran entradas de coordinator/teacher en navbar/sidebar.
- `RoleGuard` aplicado en al menos 3 rutas con permisos distintos.
- El contenido de cada vista corresponde a los KPIs/Componentes definidos para su rol.
