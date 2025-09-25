# Prompt 03 — Autenticación Google OAuth 2.0 (Server-side, Flask)

Objetivo: integrar autenticación con Google usando Authorization Code en el backend Flask. El frontend solo inicia el flujo y consume el estado de sesión; no maneja secretos ni tokens de Google.

Instrucciones
- Servicio `src/services/auth.ts` (frontend) con funciones:
  - `login()` → abrir `GET ${VITE_BACKEND_URL}/api/auth/login` (redirige a Google)
  - `logout()` → `POST ${VITE_BACKEND_URL}/api/auth/logout`
  - `me()` → `GET ${VITE_BACKEND_URL}/api/auth/me`
- Ruta `/auth/callback` en frontend que, al volver del backend, llama `me()` y actualiza UI/estado.
- Hook `src/hooks/useAuth.ts` para exponer `user`, `isAuthenticated`, `login`, `logout`, `loading`.
- Store `src/store/auth.ts` (Zustand) para estado mínimo del usuario (email, role placeholder). No guardes tokens de Google en el cliente.

Notas
- Backend implementado según `prompts/25_backend_oauth_google.md`.
- Variables frontend: `VITE_BACKEND_URL` (ver `prompts/00_env_variables.md`).
- Scopes y redirect se configuran en el backend.

Aceptación
- Login abre Google, retorna por `/oauth/callback` en backend y éste redirige a `/auth/callback` (frontend) con sesión válida.
- `me()` devuelve datos básicos (email) y se reflejan en Navbar/UI.
- No se exponen secretos ni tokens en el frontend; `.env` real no se commitea.

Calidad
- Manejo de errores claro, toasts/alerts discretos en UI.
- Logs controlados (sin credenciales en consola).
