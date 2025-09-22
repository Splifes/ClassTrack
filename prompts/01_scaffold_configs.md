# Prompt 01 — Scaffold & Configs (Vite, TS, Tailwind, Env)

Objetivo: crear la base del proyecto 100% funcional con Vite + React + TypeScript + Tailwind sin lógica de negocio.

Instrucciones para el asistente (copiar/pegar el día del evento)
- Crea un proyecto Vite React + TypeScript (sin tests). Si ya existe el repo, agrega solo los archivos faltantes.
- Archivos a crear o completar:
  - `package.json` con scripts: dev, build, preview, lint, type-check.
  - `index.html` básico con `<div id="root"></div>`.
  - `src/main.tsx` con React 18 y `createRoot`.
  - `src/App.tsx` con layout mínimo y Tailwind funcionando.
  - `tsconfig.json`, `tsconfig.node.json` (estrictos).
  - `postcss.config.js`, `tailwind.config.js`.
  - `src/index.css` con `@tailwind base; @tailwind components; @tailwind utilities;`.
  - `.env.example` solo con claves VITE_ (sin valores reales).
- Dependencias:
  - prod: `react`, `react-dom`.
  - dev: `typescript`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`.
- Criterios de aceptación:
  - `pnpm install && pnpm dev` levanta la app y muestra un Hello con estilos Tailwind.
  - TypeScript estricto sin `any` implícitos.
  - Estructura de carpetas lista para crecer.
- Calidad:
  - Arquitectura limpia (src organizado), comentarios mínimos y claros.
  - Sin warnings de TypeScript al compilar.
