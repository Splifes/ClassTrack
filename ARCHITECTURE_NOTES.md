# Architecture Notes — ClassTrack (MD-only)

Este documento resume las decisiones clave y enlaces para navegar la documentación del MVP. El repositorio es 100% Markdown (MD-only); todo es especificación, no código ejecutable.

## Fuente de verdad
- `README02.md` — guía canónica del proyecto (Option A: Frontend + Backend Flask + OAuth server-side)
- `README.md` — entrada rápida y navegación

## Principios
- MD-only: no se incluyen archivos ejecutables; describimos contratos, rutas, flujos y UI.
- Option A: Frontend (Vite + React + TS + Bootstrap 5) y Backend (Flask) como proxy de Google Classroom API.
- Seguridad: OAuth 2.0 Authorization Code en backend; el frontend nunca maneja tokens de Google.

## Rutas y navegación (SPA)
- `/`, `/courses`, `/students` (según rol)
- `/courses/:courseId`, `/courses/:courseId/classes/:classId`
- `/auth/callback` (retorno OAuth → `GET /api/auth/me`)
- Referencias:
  - `prompts/02_app_shell_routing.md`
  - `docs/design/ROLES_VIEWS.md` (matrices Rutas×Roles y Datos×Roles)
  - `docs/config/vite.md` (fallback SPA)

## Roles y vistas
- Roles: `student`, `teacher`, `coordinator`
- Documentación clave:
  - `docs/design/ROLES_VIEWS.md` — qué ve cada rol, flujos y checklists
  - `docs/design/COMPONENT_SPECS.md` — componentes y estructura de páginas (CourseDetail, ClassDetail, Dashboard Coordinator)

## Datos y contratos
- `docs/API_CONTRACTS.md` — endpoints backend (proxy), scopes, auth endpoints
- `docs/DATA_MODEL.md` — entidades, métricas y columnas mínimas para exportes (Teacher/Coordinator)

## Chat en Clase
- Opción recomendada MD-only: widget externo embebido, `roomId = ${courseId}-${classId}`
- Roadmap: WebSocket propio (Flask-SocketIO) o hilos de Classroom (requiere scopes de escritura)
- Referencias: `docs/design/ROLES_VIEWS.md`, `docs/design/COMPONENT_SPECS.md`, `docs/API_CONTRACTS.md`

## Batches y checklists
- Índice por categorías: `prompts/INDEX_BY_CATEGORY.md`
- Batches:
  - 90 (Setup), 91 (Auth/Backend), 92 (Frontend Data), 93 (UI/Páginas), 94 (Features), 95 (Testing/Deploy), 96 (Theming), 97 (DB/Roadmap)
- Cada batch incluye checklist documental para validar consistencia.

## Configuración (documental)
- `docs/config/env.md` — variables `VITE_*` (frontend) y backend; sin secretos
- `docs/config/vite.md` — `@vitejs/plugin-react`, puerto 5173, fallback SPA
- `docs/config/overview.md` — stack Option A y enlaces a prompts

## Riesgos y Roadmap
- Calendar real: requiere scopes; actualmente documentado con mock/stub
- Chat real-time: requiere backend WebSocket y moderación
- Persistencia propia/DB: fuera de alcance inmediato; ver Batch 97

## Cómo validar por partes (demo rápida)
- UI/roles: `prompts/93_batch_ui_pages.md` (incluye checklist por rol)
- Features: `prompts/94_batch_features.md` (notificaciones/asistencia/exportes)
- Testing/Deploy: `prompts/95_batch_testing_deploy.md` (smoke + SPA + env + exportes)

