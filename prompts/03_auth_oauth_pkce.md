# Prompt 03 — Autenticación Google OAuth 2.0 PKCE

Objetivo: implementar flujo OAuth 2.0 PKCE con Google para identificar usuarios por email (alumnos/profesores/coordinadores).

Instrucciones
- Crear servicio `src/services/auth.ts` con:
  - Generación/verificación PKCE (code verifier/challenge).
  - Redirección a Google (scopes de Classroom necesarios).
  - Intercambio de código por tokens en backend proxy o, si solo frontend, usar Authorization Code with PKCE y endpoints públicos de Google (sin exponer secretos, usar `VITE_GOOGLE_CLIENT_ID` y `VITE_GOOGLE_REDIRECT_URI`).
  - Manejo de tokens, refresh si aplica, logout seguro.
- Crear hook `src/hooks/useAuth.ts`.
- Agregar `src/store/auth.ts` (Zustand) para estado mínimo del usuario (email, role placeholder, tokens en memoria segura).
- Aceptación:
  - Login redirige a Google y vuelve a la app autenticado.
  - Email del usuario disponible en el estado y UI (Navbar).
  - No se exponen secretos ni se commitea `.env` real.
- Calidad:
  - Manejo de errores claro, logs controlados, sin credenciales en consola.
