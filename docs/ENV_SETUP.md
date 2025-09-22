# Configuración de Google Cloud (OAuth 2.0 PKCE)

Documento operativo para crear credenciales el día del evento (sin secretos).

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
  - Desarrollo local: `http://localhost:5173/auth/callback`
  - Producción (si deploy): `https://<tu-dominio>/auth/callback`
- Al finalizar, guardar: Client ID (sin subir al repo) y el Redirect URI.

## 5) Variables de entorno (no comprometer secretos)
- Crear `.env.local` (no commit) en el repo de IMPLEMENTACIÓN el día del evento:
```
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=
VITE_GOOGLE_CLASSROOM_API_URL=https://classroom.googleapis.com
```

## 6) Consideraciones de seguridad
- No usar client secret en el frontend.
- Usar Authorization Code with PKCE (sin secreto) en frontend.
- Limitar scopes a los mínimos necesarios.

## 7) Prueba rápida
- Arrancar la app.
- Click en "Login con Google" → autorizar → volver a `/auth/callback`.
- Ver email del usuario en el Navbar.
