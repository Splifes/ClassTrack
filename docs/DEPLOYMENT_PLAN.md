# Deployment Plan — ClassTrack (MD-only)

Este documento consolida los pasos para preparar y ejecutar el despliegue del MVP según la Opción A (Frontend Vite + React + TS + Bootstrap 5 y Backend Flask). El repositorio actual es MD-only (documentación). Este plan sirve como guía operativa para cuando se implemente el código.

## Alcance

- Frontend: Vite + React + TS
- Backend: Flask (OAuth server-side + proxy Google Classroom)
- Hosting sugerido:
  - Frontend: Netlify o Vercel
  - Backend: Render.com (alternativas: Railway, Fly.io)

## Variables de entorno

- Frontend (archivo `.env` del frontend basado en `.env.example` en raíz del repo):
  - `VITE_BACKEND_URL` (p. ej. `http://localhost:5001` en desarrollo, `https://<backend-domain>` en producción)
  - `VITE_APP_ENV` (opcional)
  - `VITE_SENTRY_DSN` (opcional)
  - `VITE_FEATURE_NOTIFICATIONS` (opcional)

- Backend (ver `prompts/27_backend_env_template.md` para `.env.example` del backend):
  - `FLASK_ENV`, `PORT`, `BASE_URL`, `FRONTEND_URL`, `SECRET_KEY`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
  - Opcionales: `LOG_LEVEL`, `SUPABASE_*`

Referencias: `prompts/00_env_variables.md`, `prompts/27_backend_env_template.md`.

## Preparación del proyecto

- Frontend:
  - Estructura y scripts conforme a `prompts/01_scaffold_configs.md` y `prompts/23_frontend_bootstrap_scaffold.md`.
  - Rutas según `prompts/02_app_shell_routing.md` (`/`, `/students`, `/courses`, `/auth/callback`, `/courses/:courseId`, `/courses/:courseId/classes/:classId`).
  - Fallback SPA configurado en hosting (ver `docs/config/vite.md`).

- Backend:
  - Estructura y endpoints mínimos según `prompts/24_backend_flask_setup.md` y `README02.md`.
  - OAuth Google: Authorization Code server-side. Redirecciones exactas.
  - Healthcheck `GET /health`.

## Flujo OAuth esperado

1) Frontend invoca `GET ${VITE_BACKEND_URL}/api/auth/login`.
2) Backend redirige a Google (scopes documentados en `README02.md`).
3) Google retorna a `https://<backend-domain>/oauth/callback` (o `http://localhost:5001/oauth/callback` en dev).
4) Backend establece sesión y redirige a frontend `/auth/callback`.
5) Frontend consulta `GET ${VITE_BACKEND_URL}/api/auth/me` para pintar usuario.

## Deploy — Backend (Render.com sugerido)

- Requisitos: Python 3.10+, `gunicorn` como server WSGI.
- Pasos:
  1. Crear servicio Web en Render (tipo Python/Flask).
  2. Start command (ejemplo): `gunicorn app:app --workers 2 --bind 0.0.0.0:10000` (ajustar a tu `app.py`).
  3. Configurar variables de entorno del backend (ver sección anterior).
  4. Deploy y verificar `GET /health`.
- Consideraciones:
  - `BASE_URL=https://<backend-domain>`
  - `FRONTEND_URL=https://<frontend-domain>` (para CORS y redirección post-login)
  - `GOOGLE_REDIRECT_URI=https://<backend-domain>/oauth/callback` (debe coincidir EXACTO en Google Cloud Console)

Referencias: `prompts/14_deploy.md`.

## Deploy — Frontend (Netlify)

- Configuración Netlify:
  - Build command: `pnpm build`
  - Publish directory: `dist`
  - Environment variables (UI):
    - `VITE_BACKEND_URL=https://<backend-domain>`
- Pasos:
  1. Conectar el repositorio.
  2. Configurar variables de entorno.
  3. Deploy.
  4. Probar login y navegación end-to-end.
- SPA Fallback: habilitar redirección a `index.html` (configuración de Netlify de Single Page App).

## Deploy — Frontend (Vercel)

- Configuración Vercel:
  - Framework preset: Vite
  - Build command: `pnpm build`
  - Output dir: `dist`
  - Environment Variables: `VITE_BACKEND_URL`
- Pasos:
  1. Importar el repo en Vercel.
  2. Configurar variables de entorno.
  3. Deploy.
  4. Probar login y navegación.
- SPA Fallback: Vercel maneja rutas de SPA si el build es de Vite; verificar rutas en producción.

## Ambientes y CI (opcional pero recomendado)

- Ambientes: `development`, `preview` (PRs), `production`.
- Pipeline mínimo (GitHub Actions): lint + type-check + build. Preview en PRs (Vercel/Netlify).
- Variables inyectadas por ambiente en el proveedor.

Referencias: `prompts/22_deployment_devops.md`.

## Smoke Testing previo y posterior al deploy

- Ver `prompts/13_testing_smoke.md` y `prompts/95_batch_testing_deploy.md`:
  - App levanta sin errores en consola.
  - Navegación entre `/`, `/students`, `/courses`.
  - Flujo OAuth completo (login y retorno a `/auth/callback`).
  - Listado de cursos, alumnos, tareas (cuando backend y permisos estén implementados).
  - Estados `loading`/`error` visibles. Accesibilidad básica.

## Checklist de verificación de producción

- Frontend público accesible.
- Backend público accesible (`/health` OK).
- OAuth configurado con URIs exactas.
- CORS permite el dominio del frontend.
- Rutas SPA funcionan (sin 404 del servidor en refresh).
- Variables `VITE_*` configuradas en el proveedor.

## Problemas comunes

- 403 / redirect mismatch: revisar `GOOGLE_REDIRECT_URI` exacto y dominios.
- CORS bloqueando: revisar `FRONTEND_URL` en backend.
- SPA 404: falta fallback a `index.html` en hosting.

## Próximos pasos

- Crear `.env` locales (frontend y backend) a partir de los templates.
- Implementar el código conforme a los prompts (`23_frontend_bootstrap_scaffold.md`, `24_backend_flask_setup.md`).
- Configurar CI para previews.
- Ejecutar checklist de `95_batch_testing_deploy.md`.
