# netlify.toml (Documental)

Este archivo documenta la configuración recomendada para desplegar el frontend (Vite + React + TS) en Netlify con fallback de SPA.

```toml
# build
[build]
  command = "pnpm build"
  publish = "dist"

# redirect SPA: cualquier ruta del cliente redirige a index.html
# evita 404 del servidor en refresh de rutas como /courses/123
[[redirects]]
  from = "/**"
  to = "/index.html"
  status = 200
```

## Variables de entorno en Netlify

Configurar en la UI de Netlify (Site settings → Environment variables):

- `VITE_BACKEND_URL=https://<backend-domain>`
- (Opcionales) `VITE_APP_ENV`, `VITE_SENTRY_DSN`, `VITE_FEATURE_NOTIFICATIONS`

## Notas

- Asegúrate que el backend permita CORS para el dominio del frontend (`FRONTEND_URL`).
- Ver `docs/DEPLOYMENT_PLAN.md` y `prompts/14_deploy.md` para detalles end-to-end.
