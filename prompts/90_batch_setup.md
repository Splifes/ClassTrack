# Batch 90 — Encolar Setup base (Frontend + Entorno)

Objetivo: encolar únicamente los prompts de Setup base, sin ejecutarlos automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 00_env_variables.md | prioridad: alta | labels: [prompt, option-a]
- 01_scaffold_configs.md | prioridad: alta | labels: [prompt, option-a]
- 02_app_shell_routing.md | prioridad: alta | labels: [prompt, option-a]
- 23_frontend_bootstrap_scaffold.md | prioridad: alta | labels: [prompt, option-a]
- 08_deployment_readme.md | prioridad: alta | labels: [prompt, option-a]

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
