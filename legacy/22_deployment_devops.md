# Prompt 22 — Despliegue y DevOps — Roadmap (Opcional)

Nota: Bajo Opción A, el deploy mínimo está cubierto en `prompts/14_deploy.md` (frontend + backend Flask). Este prompt es una guía extendida opcional (pipelines, ambientes, seguridad) si se requiere mayor madurez de DevOps. Ver `ClassTrack/README02.md`.

Objetivo: definir ambientes y pipeline mínimo para frontend y Supabase.

## Ambientes
- `development` (local)
- `preview` (PRs)
- `production`

## Frontend
- Hosting: Vercel/Netlify.
- Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_GOOGLE_CLIENT_ID`, `VITE_GOOGLE_REDIRECT_URI`.
- CI: build, type-check, lint, preview deploy.

## Supabase
- Projecto gestionado en cloud.
- Migraciones aplicadas vía Supabase CLI o dashboard SQL.
- Backups automáticos (diario) y retención.

## Seguridad
- Rotación de keys, reglas RLS, mínimo privilegio.
- Monitoreo de errores (Sentry opcional).

## Aceptación
- Cada PR genera preview URL.
- Variables inyectadas por ambiente.
