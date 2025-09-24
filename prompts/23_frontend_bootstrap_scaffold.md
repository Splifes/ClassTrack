# Prompt 23 — Frontend Scaffold con Bootstrap 5 (Vite + React + TS)

Objetivo: crear el shell del frontend usando Bootstrap 5, con rutas básicas y layout responsivo.

## Archivos a crear/actualizar
- `package.json` (scripts: dev, build, preview, lint, type-check)
- `index.html` (`<div id="root"></div>`, CDN de Bootstrap 5 o instalado por npm)
- `src/main.tsx` (React 18, `createRoot`)
- `src/App.tsx` (Navbar, Sidebar opcional, Container, rutas)
- `src/routes/*.tsx` (Home, Dashboard, Auth Callback)
- `tsconfig.json`, `tsconfig.node.json`

## Dependencias
- prod: `react`, `react-dom`, `bootstrap`
- dev: `typescript`, `vite`, `@vitejs/plugin-react`

## Criterios de aceptación
- `pnpm install && pnpm dev` levanta en `http://localhost:5173/`
- Navbar y container con clases de Bootstrap
- Ruta `/auth/callback` que recibe `code`/`state` y llama al backend

## Indicaciones clave
- No exponer secretos en el frontend
- Delegar OAuth al backend (`/api/auth/login` y `/oauth/callback`)
- El frontend consume API del backend en `http://localhost:5001`
