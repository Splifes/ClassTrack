# Prompt 14 — Deploy (Netlify/Vercel)

Objetivo: publicar el MVP para que el jurado pueda verlo online.

Instrucciones
- Requisitos previos: proyecto compila localmente (`pnpm build`) y `.env` configurado en el proveedor de deploy.

## Opción A — Netlify
- Configuración
  - Build command: `pnpm build`
  - Publish directory: `dist`
  - Environment variables (UI):
    - `VITE_GOOGLE_CLIENT_ID`
    - `VITE_GOOGLE_REDIRECT_URI` → `https://<site>.netlify.app/auth/callback`
    - `VITE_API_BASE_URL` (opcional)
    - `VITE_GOOGLE_CLASSROOM_API_URL` = `https://classroom.googleapis.com`
- Steps
  1) Conectar repo en Netlify.
  2) Setear env vars.
  3) Deploy.
  4) Probar login y navegación.

## Opción B — Vercel
- Configuración
  - Framework preset: Vite
  - Build command: `pnpm build`
  - Output dir: `dist`
  - Environment Variables:
    - `VITE_GOOGLE_CLIENT_ID`
    - `VITE_GOOGLE_REDIRECT_URI` → `https://<project>.vercel.app/auth/callback`
    - `VITE_API_BASE_URL` (opcional)
    - `VITE_GOOGLE_CLASSROOM_API_URL` = `https://classroom.googleapis.com`
- Steps
  1) Importar repo en Vercel.
  2) Setear env vars.
  3) Deploy.
  4) Probar login y navegación.

Criterios de aceptación
- La app carga en la URL pública del proveedor elegido.
- Login con Google retorna correctamente al callback.
- Rutas principales y filtros funcionan.

Notas
- Si OAuth falla en producción, confirmar redirect URI exacto y dominios autorizados en Google Cloud.
- Si hay CORS con APIs propias (si existieran), usar proxy o headers adecuados.
