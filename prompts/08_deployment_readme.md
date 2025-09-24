# Prompt 08 — README y Deploy

Objetivo: dejar el repo listo para evaluación y despliegue.

Instrucciones
- Generar `README.md` final con:
  - Descripción, arquitectura Opción A (Frontend Vite + Bootstrap, Backend Flask en :5001).
  - Requisitos: Node 18+/pnpm 8+ (frontend), Python 3.10+ (backend).
  - Variables de entorno:
    - Frontend: `VITE_BACKEND_URL`.
    - Backend: ver `prompts/27_backend_env_template.md` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `SECRET_KEY`, etc.).
  - Pasos para correr local:
    - Backend: `python -m flask run -p 5001` y `GET /health`.
    - Frontend: `pnpm install && pnpm dev` en `http://localhost:5173`.
  - Instrucciones de OAuth (crear credenciales, scopes y redirect `http://localhost:5001/oauth/callback`).
  - Limitaciones conocidas y roadmap.
- Agregar sección de deploy:
  - Backend: despliegue en Render/Fly/railway (ejemplos), configurar variables de entorno y dominio público.
  - Frontend: Netlify/Vercel, configurar `VITE_BACKEND_URL` con el dominio del backend.

Aceptación:
- README claro y reproducible por el jurado.
- Deploy accesible (si aplica) o instrucciones locales impecables.
