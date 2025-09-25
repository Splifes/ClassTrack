# Batch 96 — Encolar Theming y Diseño

Objetivo: encolar el prompt de theming/diseño, sin ejecutarlo automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 15_theme_tokens_tailwind.md | prioridad: baja | labels: [prompt, option-a]

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
