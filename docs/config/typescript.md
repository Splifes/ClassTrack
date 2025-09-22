# tsconfig.json (Documentación)

Opciones previstas del compilador TypeScript:

- target: ES2020
- module: ESNext
- moduleResolution: bundler
- strict: true, noEmit: true, isolatedModules: true
- resolveJsonModule: true, allowSyntheticDefaultImports: true
- baseUrl: `.` y paths: `@/*` -> `src/*`
- types: `vite/client`
- skipLibCheck: true, forceConsistentCasingInFileNames: true

No se distribuye el archivo `.json` real, solo esta referencia.
