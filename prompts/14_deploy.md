# Prompt 14 — Deploy (Netlify/Vercel + Backend)

Objetivo: publicar el MVP para que el jurado pueda verlo online (frontend + backend).

Instrucciones
- Requisitos previos: frontend compila (`pnpm build`), backend corre localmente (`flask run -p 5001`), y `.env` configurado en ambos entornos.

## Backend (Flask)
- Proveedores sugeridos: Render.com, Railway, Fly.io (o cualquier PaaS Python 3.10+)
- Variables de entorno (copiar desde `prompts/27_backend_env_template.md`):
  - `BASE_URL=https://<backend-domain>`
  - `FRONTEND_URL=https://<frontend-domain>`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI=https://<backend-domain>/oauth/callback`
  - `SECRET_KEY`
- Pasos generales (Render como ejemplo):
  1) Crear servicio Web (Python/Flask)
  2) Configurar Start command: `gunicorn app:app --workers 2 --bind 0.0.0.0:10000` (ajustar con tu `app.py`)
  3) Setear variables de entorno
  4) Deploy y probar `GET /health`

## Frontend — Netlify
- Configuración
  - Build command: `pnpm build`
  - Publish directory: `dist`
  - Environment variables (UI):
    - `VITE_BACKEND_URL=https://<backend-domain>`
- Steps
  1) Conectar repo en Netlify
  2) Setear env vars
  3) Deploy
  4) Probar login y navegación (flujo: Netlify → backend `/api/auth/login` → Google → backend `/oauth/callback` → frontend `/auth/callback`)

## Frontend — Vercel
- Configuración
  - Framework preset: Vite
  - Build command: `pnpm build`
  - Output dir: `dist`
  - Environment Variables:
    - `VITE_BACKEND_URL=https://<backend-domain>`
- Steps
  1) Importar repo en Vercel
  2) Setear env vars
  3) Deploy
  4) Probar login y navegación

Criterios de aceptación
- La app carga en la URL pública del proveedor elegido.
- Login con Google retorna correctamente y mantiene sesión entre frontend/backend.
- Rutas principales y filtros funcionan.

Notas
- Verificar que `GOOGLE_REDIRECT_URI` en Google Cloud Console coincida EXACTAMENTE con `https://<backend-domain>/oauth/callback`.
- CORS: el backend debe permitir el dominio del frontend (`FRONTEND_URL`).
- Si hay errores 403/redirect mismatch, revisar dominios y variables.
