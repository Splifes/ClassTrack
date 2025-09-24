# vite.config.ts (Documentación)

Descripción de la configuración prevista de Vite:

- Plugin: `@vitejs/plugin-react`
- Server: puerto 5173, HMR habilitado
- Build: `outDir` = `dist`, `sourcemap` en dev, minificación en prod
- Variables `VITE_*` expuestas desde `.env` (solo listado documental). No exponer secretos.
- Sin integración de Tailwind/PostCSS en Opción A (se usa Bootstrap 5)

Nota: No se incluye el archivo real; solo documentación.

## Routing SPA (React Router)

- Asegurar fallback a `index.html` para rutas del cliente (SPA). En dev lo maneja Vite; en producción, configurarlo en el hosting/servidor.
- Enlaces con React Router: rutas esperadas en `prompts/02_app_shell_routing.md`.

## Referencias

- `prompts/01_scaffold_configs.md`
- `prompts/02_app_shell_routing.md`
- `README02.md`
