# Batch 91 — Encolar Autenticación y Backend (núcleo opción A)

Objetivo: encolar únicamente los prompts de Autenticación y Backend, sin ejecutarlos automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 03_auth_oauth_pkce.md | prioridad: alta | labels: [prompt, option-a]
- 04_classroom_api.md | prioridad: alta | labels: [prompt, option-a]
- 24_backend_flask_setup.md | prioridad: alta | labels: [prompt, option-a]
- 25_backend_oauth_google.md | prioridad: alta | labels: [prompt, option-a]
- 26_backend_api_endpoints.md | prioridad: alta | labels: [prompt, option-a]
- 27_backend_env_template.md | prioridad: alta | labels: [prompt, option-a]

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
