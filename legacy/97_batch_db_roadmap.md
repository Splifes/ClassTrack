# Batch 97 — Encolar Base de Datos y Roadmap

Objetivo: encolar los prompts de base de datos y roadmap, sin ejecutarlos automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 16_db_schema_supabase.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 17_supabase_setup.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 18_rls_policies.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 19_migrations_seed.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 20_sync_classroom_plan.md | prioridad: baja | labels: [prompt, option-a, roadmap]

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
