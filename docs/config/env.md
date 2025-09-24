# Variables de Entorno (Documentación)

Este repositorio es MD-only. No incluir `.env` reales ni secretos. Esta guía documenta las variables que se usarían en Option A.

## Frontend (`.env.example` documental)

- `VITE_BACKEND_URL` (p. ej. `http://localhost:5001`)
- `VITE_APP_ENV` (p. ej. `development`)
- `VITE_SENTRY_DSN` (opcional)
- `VITE_FEATURE_NOTIFICATIONS` (p. ej. `true`)

Notas:
- Solo las variables prefijadas con `VITE_` se exponen al cliente.
- Mantener el listado acotado a lo estrictamente necesario.

Referencias: `prompts/00_env_variables.md`.

## Backend (`.env` documental)

- `FLASK_ENV=development`
- `PORT=5001`
- `BASE_URL=http://localhost:5001`
- `FRONTEND_URL=http://localhost:5173`
- `SECRET_KEY=change-this-in-production`
- `GOOGLE_CLIENT_ID=...`
- `GOOGLE_CLIENT_SECRET=...`
- `GOOGLE_REDIRECT_URI=http://localhost:5001/oauth/callback`

Referencias: `prompts/27_backend_env_template.md`, `README02.md`.

## Buenas prácticas

- No commitear secretos. Usar `.env.example` solo como documentación.
- Validar que URIs y puertos coincidan con los de `README02.md`.
