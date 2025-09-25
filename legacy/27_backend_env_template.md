# Prompt 27 — Plantilla .env Backend (Flask)

Objetivo: definir las variables de entorno requeridas por el backend Flask (OAuth Google y CORS).

## `.env.example`
```
# Server
FLASK_ENV=development
PORT=5001
BASE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173
SECRET_KEY=change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# Debe coincidir con BASE_URL + /oauth/callback
GOOGLE_REDIRECT_URI=http://localhost:5001/oauth/callback

# Opcionales
LOG_LEVEL=INFO
# Si usas Supabase u otra DB desde el backend, agrega aquí
SUPABASE_DB_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Criterios de aceptación
- El backend inicia leyendo estas variables sin errores.
- `GOOGLE_REDIRECT_URI` coincide exactamente con lo configurado en Google Cloud Console.
- `FRONTEND_URL` se usa para CORS y redirecciones post-login.
