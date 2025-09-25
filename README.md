# ClassTrack — Fuente de Verdad (MD-only)

Este repositorio es solo documentación en Markdown. No contiene código ejecutable. La guía canónica del proyecto es `README02.md`.

## Canonical brief
- Ver `README02.md` (consignas y flujo completo del proyecto Option A: Frontend + Backend Flask). Este documento describe el setup y la arquitectura, pero recuerde: en este repo solo se documenta, no se incluye código.

## Navegación rápida
- Prompts por categoría: `prompts/INDEX_BY_CATEGORY.md`
- Todos los prompts: carpeta `prompts/`
- Arquitectura y diseño: `docs/ARCHITECTURE.md`, `docs/API_CONTRACTS.md`, `docs/DATA_MODEL.md`, `docs/wireframes.md`, `docs/user-flows.md`
 - Notas ejecutivas de arquitectura: `ARCHITECTURE_NOTES.md`
 - Guion de demo para jurados: `docs/JURY_BRIEF.md`

## Lineamientos
- Mantener todo en formato `.md`.
- Cuando un documento refiera a comandos o archivos (p. ej. Vite/Flask), se consideran especificaciones para implementación futura, no archivos presentes en este repo.

## Índice útil
- `README02.md`: Fuente de verdad del proyecto.
- `prompts/INDEX_BY_CATEGORY.md`: Ejecutar por partes sin interferencias.
- `docs/README.md`: Índice de documentación funcional y de diseño.
 - `ARCHITECTURE_NOTES.md`: Decisiones clave y enlaces a checklists.
 - `docs/JURY_BRIEF.md`: Pasos de demo y próximos pasos.

## Cómo usar los batches (paso a paso)

1. Abrir el índice de categorías: `prompts/INDEX_BY_CATEGORY.md`.
2. Elegir la categoría que quieras trabajar y abrir el batch correspondiente (por ejemplo `prompts/90_batch_setup.md`).
3. Ejecutar el batch para encolar solo los prompts de esa categoría (no se ejecutan automáticamente).
4. Desde la fila de tareas, correr cada prompt en orden y validar con los checklists de `README02.md`.

Sugerencia de orden inicial: `90_batch_setup.md` → `91_batch_auth_backend.md` → `92/93/94` según foco.