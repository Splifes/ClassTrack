# vercel.json (Documental)

Este archivo documenta la configuración recomendada para desplegar el frontend (Vite + React + TS) en Vercel con fallback de SPA.

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Variables de entorno en Vercel

Configurar en Project Settings → Environment Variables:

- `VITE_BACKEND_URL=https://<backend-domain>`
- (Opcionales) `VITE_APP_ENV`, `VITE_SENTRY_DSN`, `VITE_FEATURE_NOTIFICATIONS`

## Notas

- Vercel suele manejar automáticamente rutas SPA para proyectos Vite, pero si observas 404 en rutas internas, utiliza la regla de `rewrites` anterior.
- Ver `docs/DEPLOYMENT_PLAN.md` y `prompts/14_deploy.md` para detalles end-to-end.
