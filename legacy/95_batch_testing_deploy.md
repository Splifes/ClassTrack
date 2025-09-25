# Batch 95 — Encolar Testing y Deploy

Objetivo: encolar los prompts de pruebas y despliegue, sin ejecutarlos automáticamente.

## Instrucciones para el asistente (Windsurf)
- Recorre la lista de archivos indicada abajo.
- Para cada archivo, crear una tarea con:
  - `title`: nombre del archivo sin la extensión.
  - `description`: "Ejecutar el prompt <NOMBRE_ARCHIVO>.md siguiendo sus instrucciones."
  - `path`: ruta absoluta del archivo correspondiente.
  - `priority` y `labels` según la lista.
- No ejecutar la tarea automáticamente; solo encolarla.

## Lista de archivos a encolar (prompts/)
- 13_testing_smoke.md | prioridad: media | labels: [prompt, option-a]
- 14_deploy.md | prioridad: media | labels: [prompt, option-a]
- 22_deployment_devops.md | prioridad: baja | labels: [prompt, option-a, roadmap]

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

- Smoke testing (ver `prompts/13_testing_smoke.md`)
  - Rutas accesibles: `/`, `/courses`, `/students` (según rol), `/auth/callback`.
  - Enlaces de navegación entre `Courses` → `CourseDetail` → `ClassDetail` (documental).
  - Estados vacíos y de error presentes en tablas/comp.

- Deploy (ver `prompts/14_deploy.md` y `prompts/22_deployment_devops.md`)
  - MD-only: guía de despliegue como especificación, sin ejecutar.
  - SPA fallback configurado en hosting (ver `docs/config/vite.md`).
  - Variables `VITE_*` y URIs de backend documentadas (sin secretos).

- Exportes
  - Columnas mínimas para CSV y respeto de filtros activos (ver `docs/DATA_MODEL.md`).
  - Encoding y formato de fecha definidos.
