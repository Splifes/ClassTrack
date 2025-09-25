# Batch 95 — Tareas Encoladas (Documental)

Este documento encola las tareas de Testing y Deploy según `prompts/95_batch_testing_deploy.md`. No se ejecutan automáticamente.

## Tareas

- create_task({
  title: "13_testing_smoke",
  description: "Ejecutar el prompt 13_testing_smoke.md siguiendo sus instrucciones.",
  path: "${WORKSPACE_ROOT}/prompts/13_testing_smoke.md",
  priority: "media",
  labels: ["prompt", "option-a"]
})

- create_task({
  title: "14_deploy",
  description: "Ejecutar el prompt 14_deploy.md siguiendo sus instrucciones.",
  path: "${WORKSPACE_ROOT}/prompts/14_deploy.md",
  priority: "media",
  labels: ["prompt", "option-a"]
})

- create_task({
  title: "22_deployment_devops",
  description: "Ejecutar el prompt 22_deployment_devops.md siguiendo sus instrucciones.",
  path: "${WORKSPACE_ROOT}/prompts/22_deployment_devops.md",
  priority: "baja",
  labels: ["prompt", "option-a", "roadmap"]
})

## Checklist de verificación (documental)

- Rutas accesibles y navegación documental entre vistas clave.
- SPA fallback configurado en hosting.
- Variables `VITE_*` y URIs del backend documentadas sin secretos.
