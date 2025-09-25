# Batch 92 — Encolar Estado, Datos en Frontend y Tipado

Objetivo: encolar los prompts de estado, tipos y acceso a datos del frontend, sin ejecutarlos automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 05_state_types_hooks.md | prioridad: media | labels: [prompt, option-a]
- 21_data_access_frontend.md | prioridad: media | labels: [prompt, option-a]

## Formato para crear cada tarea
```
create_task({
  title: "<NOMBRE_SIN_EXTENSION>",
  description: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones.",
  path: "${WORKSPACE_ROOT}/prompts/<NOMBRE_ARCHIVO>.md",
  priority: "<alta|media|baja>",
  labels: ["prompt", "option-a", ...labelsExtra]
})
```

## Checklist de verificación (documental)

- Claves de cache React Query documentadas por entidad:
  - `['courses']`, `['courses', id]`, `['courses', courseId, 'courseWork']`, `['courses', courseId, 'courseWork', workId, 'submissions']`.
- Hooks definidos y mapeados a endpoints del backend (Option A):
  - `useCourses()`, `useAssignments(courseId)`, `useSubmissions(courseId, assignmentId)`, `useStudents(courseId)`, `useTeachers(courseId)`.
- `src/services/googleClassroomApi.md` especifica por método: endpoint, params, status y respuesta mínima, alineado con `docs/API_CONTRACTS.md`.
- `src/store/index.md` incluye un “Mapa de Integración” indicando vistas → hooks → services → slices → claves de cache.
- Tipos de datos referencian `docs/API_CONTRACTS.md` y `docs/DATA_MODEL.md` (sin `any`).
