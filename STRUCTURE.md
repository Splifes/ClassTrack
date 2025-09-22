# Estructura del Proyecto (Guía sin código)

Este repositorio está diseñado para una competencia donde NO se permite incluir código ejecutable. Aquí encontrarás únicamente documentación y una guía clara de qué iría en cada carpeta/archivo si se implementara el MVP.

- Objetivo: explicar la arquitectura, flujos y contratos sin código.
- Cumplimiento: no contiene `*.ts`, `*.tsx`, `*.js`, `package.json` válido, ni configuraciones ejecutables.

## Vista general de carpetas

- `docs/`: Documentación funcional, de diseño y cronograma. Agregamos `docs/config/` para detallar configuraciones planeadas (Vite, TS, Tailwind, etc.).
- `src/`: Esqueleto de la aplicación (solo documentación). Describe componentes, hooks, servicios, estado global, tipos y datos simulados (todo como `.md`).

## Cumplimiento “No-Code”

- No hay archivos de configuración ejecutables ni código fuente.
- Toda configuración se documenta en `docs/config/` en lugar de archivos reales como `package.json`, `vite.config.ts`, etc.
- Cualquier archivo que parezca código será removido (con tu confirmación) o reemplazado por documentación.

## Mapa de implementación (referencia)

- Entradas del frontend: `index.html`, `src/main.tsx`, `src/App.tsx` (no presentes; solo descritos en docs).
- Enrutamiento: `react-router-dom` con páginas `Dashboard`, `Students`, `Courses` (solo descritas).
- Estado: Zustand + React Query (solo descritos, sin código).
- Estilos: Tailwind CSS (documentado, no configurado).

## Próximos pasos sugeridos

1) Mantener solo documentación.  
2) Mover toda “configuración” a `docs/config/`.  
3) Eliminar archivos que aparenten ser código o configuración ejecutable.  
4) Entregar este repositorio como especificación del MVP.
