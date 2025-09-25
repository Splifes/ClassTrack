# Batch 94 — Encolar Funcionalidades de Producto

Objetivo: encolar los prompts de notificaciones, asistencia y reportes, sin ejecutarlos automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 09_notifications.md | prioridad: media | labels: [prompt, option-a]
- 11_attendance_calendar.md | prioridad: media | labels: [prompt, option-a]
- 12_reports_exports.md | prioridad: media | labels: [prompt, option-a]

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

- Notificaciones (ver `prompts/09_notifications.md`)
  - Triggers definidos (entregas próximas/atrasadas, feedback nuevo).
  - Prioridad/visibilidad en UI: `Alert`/`Badge` documentados en `docs/design/COMPONENT_SPECS.md`.
  - MD-only: sin servicios externos; especificación de contenido y lugares de aparición.

- Asistencia/Calendario (ver `prompts/11_attendance_calendar.md`)
  - Estados de día: presente/ausente/tarde (documental) y leyenda.
  - Navegación de meses y selección de rango; estados vacíos/errores.
  - Accesibilidad: navegación por teclado y foco visible.

- Reportes/Exportes (ver `prompts/12_reports_exports.md` y `docs/DATA_MODEL.md`)
  - Columnas mínimas para CSV:
    - Teacher (por curso) y Coordinator (global) según `docs/DATA_MODEL.md`.
  - Respetar filtros activos (cohorte/curso/docente/período) en la exportación.
  - Formato de fecha ISO 8601; separador consistente; encoding UTF-8.

- Roles
  - Student: no exportes globales; solo vistas personales.
  - Teacher: exporte por curso propio.
  - Coordinator: exporte global con filtros.
