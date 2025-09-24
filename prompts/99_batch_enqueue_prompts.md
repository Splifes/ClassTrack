# Prompt 99 — Encolar todos los Prompts en la Fila de Tareas (No ejecutar aún)

Objetivo: cuando este prompt se ejecute en Windsurf, encolar cada archivo dentro de la carpeta `prompts/` como una tarea independiente en la fila de tareas, sin ejecutarlas automáticamente.

Nota: Este archivo es solo para preparar la operación. No ejecutar todavía.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo (ordenada).
- Para cada archivo:
  - Crear una tarea en la fila con los siguientes campos:
    - `title`: nombre del archivo sin la extensión.
    - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
    - `path`: ruta absoluta del archivo correspondiente.
    - `priority`: alta para 00–08 y 23–27; media para 09–14 y 21; baja para 15–22 y META/README.
    - `labels`: ["prompt", "option-a"]. Si el archivo es Roadmap, incluir además "roadmap".
  - No ejecutar la tarea automáticamente; solo encolarla.
- No modificar el contenido de los prompts.

## Mapeo y prioridades
- Alta: núcleo Opción A (setup/env, scaffold, auth server-side, API via backend, README/deploy, frontend bootstrap + backend flask + oauth + endpoints + env template)
- Media: notificaciones, roles/vistas, asistencia, reportes, testing, deploy
- Baja: theming/tokens, DB/Supabase, RLS, migraciones, plan de sync, DevOps extendido, meta y README de prompts

## Lista de archivos a encolar (prompts/)

- 00_env_variables.md | prioridad: alta | labels: [prompt, option-a]
- 01_scaffold_configs.md | prioridad: alta | labels: [prompt, option-a]
- 02_app_shell_routing.md | prioridad: alta | labels: [prompt, option-a]
- 03_auth_oauth_pkce.md | prioridad: alta | labels: [prompt, option-a]
- 04_classroom_api.md | prioridad: alta | labels: [prompt, option-a]
- 05_state_types_hooks.md | prioridad: media | labels: [prompt, option-a]
- 06_ui_components.md | prioridad: media | labels: [prompt, option-a]
- 07_dashboard_pages.md | prioridad: media | labels: [prompt, option-a]
- 08_deployment_readme.md | prioridad: alta | labels: [prompt, option-a]
- 09_notifications.md | prioridad: media | labels: [prompt, option-a]
- 10_roles_views.md | prioridad: media | labels: [prompt, option-a]
- 11_attendance_calendar.md | prioridad: media | labels: [prompt, option-a]
- 12_reports_exports.md | prioridad: media | labels: [prompt, option-a]
- 13_testing_smoke.md | prioridad: media | labels: [prompt, option-a]
- 14_deploy.md | prioridad: media | labels: [prompt, option-a]
- 15_theme_tokens_tailwind.md | prioridad: baja | labels: [prompt, option-a]
- 16_db_schema_supabase.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 17_supabase_setup.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 18_rls_policies.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 19_migrations_seed.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 20_sync_classroom_plan.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 21_data_access_frontend.md | prioridad: media | labels: [prompt, option-a]
- 22_deployment_devops.md | prioridad: baja | labels: [prompt, option-a, roadmap]
- 23_frontend_bootstrap_scaffold.md | prioridad: alta | labels: [prompt, option-a]
- 24_backend_flask_setup.md | prioridad: alta | labels: [prompt, option-a]
- 25_backend_oauth_google.md | prioridad: alta | labels: [prompt, option-a]
- 26_backend_api_endpoints.md | prioridad: alta | labels: [prompt, option-a]
- 27_backend_env_template.md | prioridad: alta | labels: [prompt, option-a]
- META_PROMPT.md | prioridad: baja | labels: [prompt, option-a]
- README.md | prioridad: baja | labels: [prompt, option-a]

## Formato para crear cada tarea

Usar la siguiente plantilla por cada archivo:

```
create_task({
  title: "<NOMBRE_SIN_EXTENSION>",
  description: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones.",
  path: "<RUTA_ABSOLUTA_DEL_ARCHIVO>",
  priority: "<alta|media|baja>",
  labels: ["prompt", "option-a", ...labelsExtra]
})
```

Ejemplo:

```
create_task({
  title: "00_env_variables",
  description: "Ejecutar el prompt 00_env_variables.md siguiendo sus instrucciones.",
  path: "${WORKSPACE_ROOT}/prompts/00_env_variables.md",
  priority: "alta",
  labels: ["prompt", "option-a"]
})
```

## Notas
- Confirmar que el workspace apunte a `ClassTrack/`.
- Si algún archivo no existe, omitirlo y continuar con el resto.
- No iniciar ninguna ejecución automática tras encolar.
