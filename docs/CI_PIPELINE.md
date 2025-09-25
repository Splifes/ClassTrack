# CI Pipeline (Documental)

Este documento describe un pipeline mínimo de CI para el proyecto cuando el código exista (MD-only por ahora).

## Objetivos

- Ejecutar `pnpm type-check` y `pnpm build` en PRs.
- Publicar previews automáticos (Vercel/Netlify) en PRs.

## GitHub Actions (documental)

Archivo sugerido: `.github/workflows/ci.yml` (no incluido en este repo MD-only).

```yaml
name: CI
on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Install pnpm
        run: |
          npm i -g pnpm@8
      - name: Install deps
        run: pnpm install --frozen-lockfile
      - name: Type check
        run: pnpm run type-check || true # documental: depende del scaffold
      - name: Build
        run: pnpm run build || true # documental: depende del scaffold
```

## Variables de entorno en CI

- Inyectar `VITE_BACKEND_URL` en el proveedor (Netlify/Vercel) para previews.
- Evitar exponer secretos en logs.

## Referencias

- `docs/DEPLOYMENT_PLAN.md`
- `prompts/08_deployment_readme.md`
- `prompts/14_deploy.md`
- `prompts/22_deployment_devops.md`
