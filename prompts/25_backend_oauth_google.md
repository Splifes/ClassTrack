# Prompt 25 — OAuth 2.0 con Google (Flask, Authorization Code)

Objetivo: implementar el flujo completo de OAuth 2.0 Authorization Code en el backend Flask, incluyendo `login`, `callback`, obtención de tokens y almacenamiento de sesión segura.

## Endpoints a crear
- `GET /api/auth/login` → redirige a Google OAuth con parámetros (`client_id`, `redirect_uri`, `scope`, `state`, `access_type=offline`)
- `GET /oauth/callback` → recibe `code` y `state`, intercambia por `access_token` (y `refresh_token` si aplica), guarda sesión y redirige al frontend
- `POST /api/auth/logout` → limpia sesión/credenciales
- `GET /api/auth/me` → retorna información básica del usuario autenticado

## Requisitos
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SECRET_KEY`, `BASE_URL=http://localhost:5001`, `FRONTEND_URL=http://localhost:5173`
- Scopes mínimos:
  - `https://www.googleapis.com/auth/classroom.courses.readonly`
  - `https://www.googleapis.com/auth/classroom.rosters.readonly`
  - `https://www.googleapis.com/auth/classroom.student-submissions.students.readonly`
  - `openid`, `email`, `profile` (para identidad básica)

## Flujo
1) Frontend llama `GET /api/auth/login` → redirección a Google
2) Usuario consiente → Google redirige a `/oauth/callback?code=...&state=...`
3) Backend intercambia `code` por `access_token` (+ opcional `refresh_token`)
4) Backend almacena tokens en sesión/DB y redirige al frontend (`/auth/callback`)
5) Frontend consulta `GET /api/auth/me` para mostrar usuario/auth state

## Criterios de aceptación
- Redirección a Google correctamente con scopes configurados
- `callback` maneja errores (access_denied, invalid_grant) con mensajes claros
- Sesión segura (cookies HttpOnly/SameSite=Lax) o almacenamiento server-side
- Logs mínimos en backend (sin exponer tokens en logs)
