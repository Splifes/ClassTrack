# Prompt 00 — Variables de Entorno (.env)

Objetivo: definir las variables de entorno necesarias para correr el frontend y coordinar con el backend Flask (OAuth server-side).

## Reglas
- Solo variables prefijadas con `VITE_` estarán disponibles en el frontend (Vite).
- No colocar valores reales en repositorio público. Usar `.env.example` como plantilla.

## Plantilla `.env.example`

```
# Frontend — Backend base URL
VITE_BACKEND_URL=http://localhost:5001

# Opcionales Frontend
VITE_APP_ENV=development
VITE_SENTRY_DSN=
VITE_FEATURE_NOTIFICATIONS=true
```

## Criterios de aceptación
- `.env.example` contiene todas las claves requeridas por prompts y README.
- `VITE_*` limitado a lo estrictamente necesario (evitar secretos).
- El backend usa su propio `.env` (ver `prompts/27_backend_env_template.md`).
