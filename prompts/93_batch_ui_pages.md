# Batch 93 — Encolar UI y Páginas

Objetivo: encolar los prompts de componentes UI y páginas, sin ejecutarlos automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 06_ui_components.md | prioridad: media | labels: [prompt, option-a]
- 07_dashboard_pages.md | prioridad: media | labels: [prompt, option-a]
- 10_roles_views.md | prioridad: media | labels: [prompt, option-a]

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

- Componentes base especificados con props mínimas y estados visuales en `docs/design/COMPONENT_SPECS.md`.
- Accesibilidad definida (roles ARIA, foco visible) para Button/Input/Select/Table/Layout.
- Mapa de navegación y componentes por página documentado (Dashboard, Students, Courses) en `docs/design/COMPONENT_SPECS.md`.
- Rutas esperadas alineadas con `prompts/02_app_shell_routing.md`.
- Roles/vistas (`10_roles_views.md`) describen qué se muestra/oculta por rol a nivel de navegación y componentes sensibles.
