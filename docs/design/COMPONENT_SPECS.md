# Especificaciones de Componentes (Sin código)

Este documento define el comportamiento y props esperadas de los componentes clave sin implementar código. Sirve como contrato para la generación durante el evento.

## Button
- Variantes: primary | secondary | ghost | outline | destructive
- Tamaños: sm | md | lg
- Props:
  - `children` (contenido)
  - `variant` (default: primary)
  - `size` (default: md)
  - `disabled`, `loading`
  - `leftIcon`, `rightIcon` (opcional)
  - `aria-label` cuando no hay texto visible
- Estados visuales: default, hover, focus-visible, active, disabled, loading
- Accesibilidad: foco visible, `aria-busy` cuando `loading`

## Input
- Props: `id`, `label`, `placeholder`, `value`, `onChange`, `error`, `helpText`, `required`
- Accesibilidad: `label` asociado por `for/id`, `aria-invalid` cuando `error`, `aria-describedby` a help/error

## Select
- Props: `id`, `label`, `options: {value,label}[]`, `value`, `onChange`, `placeholder`, `error`
- Estados: abierto/cerrado, item activo/seleccionado
- Accesibilidad: navegable por teclado, roles ARIA de listbox/options

## Card
- Slots: `header` (título + acción), `content`, `footer`
- Variantes: default, elevated, outlined

## Table
- Props: `columns`, `data`, `loading`, `emptyState`
- Comportamiento: cabecera sticky, filas hover, columnas responsivas
- Accesibilidad: `table` semántica, `scope="col"`, captions opcionales

## Badge
- Variantes: success | warning | error | info | neutral
- Uso: estados/etiquetas pequeñas con color semántico

## Spinner
- Props: `size`, `aria-label` (p.ej. "Cargando")

## ChatMessageList (documental)
- Props:
  - `roomId: string` (convención: `${courseId}-${classId}`)
  - `messages: { id: string; author: string; text: string; timestamp: string }[]`
  - `currentUserEmail?: string`
- Comportamiento:
  - Lista scrollable, agrupación por autor/tiempo opcional
  - Estados: loading, empty, error (documentales)
  - Accesibilidad: roles ARIA adecuados para listas de mensajes

## ChatComposer (documental)
- Props:
  - `roomId: string`
  - `onSend: (text: string) => void` (documental)
  - `placeholder?: string`
  - `disabled?: boolean`
- Comportamiento:
  - Enviar con Enter, nueva línea con Shift+Enter (documental)
  - Estados: disabled cuando no hay sesión o rol no permitido

## Layout (Navbar/Sidebar/Layout)
- Navbar: marca, navegación principal, usuario (email/rol)
- Sidebar: navegación por secciones; colapsable en móvil
- Layout: contenedor central, breadcrumbs opcionales, slots para acciones

## Vistas por Rol y Mapa de Páginas (documental)

Ver detalle en `docs/design/ROLES_VIEWS.md`. Resumen:

- Rutas principales: `/` (Dashboard), `/students`, `/courses`, `/auth/callback`.
- student
  - Dashboard: tarjetas de próximas entregas, tabla de entregas recientes.
  - Courses: lista de cursos personales.
  - Navbar/Sidebar: entradas limitadas a su ámbito.
- teacher
  - Dashboard: métricas y alertas por cursos asignados.
  - Students: lista de estudiantes de sus cursos.
  - Courses: cursos del docente.
- coordinator
  - Dashboard: KPIs globales y filtros por cohorte/curso/docente.
  - Students: vista global con filtros.
  - Courses: visión global con métricas.

Componentes por vista (comunes): `Card`, `Table`, `Badge`, `Spinner`, `Input/Select` para filtros; layout con Navbar/Sidebar.

## Estructura de páginas (documental)

### CourseDetail (`/courses/:courseId`)
- Secciones:
  - Header: título del curso, sección, docentes (si aplica)
  - Clases/Sesiones (CourseWork): tabla con `title`, `dueDate`, `state`, acción “Ver clase”
  - Filtros/búsqueda: por estado y rango de fechas
- Componentes: `Card`, `Table`, `Badge`, `Input`, `Select`, `Spinner`
- Estados: loading, empty (sin clases), error
- Accesibilidad: tabla semántica con `scope="col"`, foco visible

### ClassDetail (`/courses/:courseId/classes/:classId`)
- Secciones:
  - Header: título, fecha/hora, estado de la entrega personal
  - Materiales/Descripción (documental)
  - Estado de entrega: “Entregado / Pendiente / Atrasado”, fecha límite
  - Chat de clase: `ChatMessageList` + `ChatComposer` (widget externo; `roomId = ${courseId}-${classId}`)
- Componentes: `Card`, `Badge`, `Table` (si se listan submissions personales), `ChatMessageList`, `ChatComposer`, `Spinner`
- Estados: loading, empty (sin mensajes), error; indicador de conexión del chat (documental)
- Accesibilidad: ARIA para listas de mensajes y formularios

