# Configuraciones Técnicas (Resumen)

Este directorio documenta, sin incluir archivos ejecutables, las configuraciones que se usarían si el MVP se implementara.

- Bundler: Vite
- Lenguaje: TypeScript
- Framework UI: React 18
- Estilos: Bootstrap 5 (Tailwind: legado/opcional, ver Roadmap)
- Estado: Zustand + React Query
- Routing: React Router DOM
- Iconos: Lucide React
- Gráficos: Recharts

Cada archivo describe el contenido esperado de la configuración correspondiente.

## Notas de coherencia (Option A)

- En Option A, el sistema de estilos principal es **Bootstrap 5**. `docs/design/TOKENS.md` puede usarse como referencia conceptual y mapeo a utilidades/clases Bootstrap. `tailwind.md` queda como alternativo/roadmap.
- Solo variables prefijadas con `VITE_` estarán expuestas al cliente. Ver `docs/config/env.md` y `prompts/00_env_variables.md`.

## Referencias

- Prompts de Setup: `prompts/00_env_variables.md`, `prompts/01_scaffold_configs.md`, `prompts/02_app_shell_routing.md`, `prompts/23_frontend_bootstrap_scaffold.md`, `prompts/08_deployment_readme.md`.
- Guía canónica y flujo: `README02.md`.
