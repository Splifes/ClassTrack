# Configuración de Google Cloud (OAuth 2.0 — Opción A server-side)

Documento operativo para crear credenciales el día del evento (sin secretos). Opción A usa Authorization Code en el backend Flask (no PKCE en frontend).

## 1) Crear proyecto en Google Cloud
- Ir a https://console.cloud.google.com/
- Crear proyecto (o seleccionar uno existente de prueba para el hackathon).

## 2) Habilitar APIs
- API de Google Classroom
- (Opcional) API de Google Calendar

## 3) OAuth consent screen
- Tipo: External
- App name: ClassTrack (Hackathon)
- User support email: tu email
- Scopes: agregar los de `docs/API_CONTRACTS.md` (solo read-only necesarios)
- Test users: agregar los emails que van a autenticar durante la demo

## 4) Crear credenciales OAuth 2.0 (Client ID)
- Application type: Web application
- Authorized redirect URIs:
  - Desarrollo local (backend): `http://localhost:5001/oauth/callback`
  - Producción (si deploy, backend): `https://<backend-domain>/oauth/callback`
- Al finalizar, guardar: Client ID y Client Secret (no subir al repo) y el Redirect URI.

## 5) Variables de entorno (no comprometer secretos)
- Backend (.env) — ver `prompts/27_backend_env_template.md`:
```
FLASK_ENV=development
PORT=5001
BASE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173
SECRET_KEY=change-this
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5001/oauth/callback
```
- Frontend (`.env.local`):
```
VITE_BACKEND_URL=http://localhost:5001
```

## 6) Consideraciones de seguridad
- No usar client secret en el frontend.
- El backend maneja el intercambio de código por tokens y mantiene la sesión.
- Limitar scopes a los mínimos necesarios.

## 7) Prueba rápida
- Arrancar backend (`flask run -p 5001`) y frontend (`pnpm dev`).
- Click en "Login con Google" (frontend) → redirige a backend `/api/auth/login` → Google → backend `/oauth/callback` → frontend `/auth/callback`.
- Ver email del usuario con `GET /api/auth/me` reflejado en la UI.
