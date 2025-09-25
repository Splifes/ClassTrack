# Prompt Kit (Generación de Código en el día del concurso)

Esta carpeta contiene prompts listos para copiar/pegar y generar código de forma rápida, consistente y sin desviarnos del alcance.

- No contiene código.
- Cada prompt detalla: alcance, archivos a crear, criterios de aceptación, calidad (SOLID, tipado estricto), y validaciones.
- Orden sugerido: seguir la numeración `01_..`, `02_..`, etc.

## Reglas generales para todos los prompts
- Frontend: React + Vite, UI con Bootstrap 5 (sin Tailwind en esta opción).
- TypeScript estricto (`strict: true`, sin `any` implícitos) en el frontend.
- Arquitectura limpia: separación de capas (UI, hooks, servicios) en frontend y (routes, services) en backend.
- SOLID y composición de componentes.
- Accesibilidad (ARIA), i18n mínima (estructura preparada), y responsive con Bootstrap.
- Evitar dependencias innecesarias; usar solo las listadas.
- Seguridad frontend: no exponer secretos; usar variables `VITE_*` únicamente para el cliente.
- Seguridad backend: `.env` con `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SECRET_KEY` (no commitear).
- Logs y errores claros; no silenciar errores.
- Commits pequeños y atómicos.

## Flujo de uso el día del evento
1. Abre `RUNBOOK.md` y sigue la timeline.
2. Toma el prompt correspondiente a la fase y pégalo en tu asistente de código (Windsurf/Cascade).
3. Revisa el diff/archivos propuestos, itera rápido si algo no cumple los criterios.
4. Pasa a la siguiente fase.
5. Antes de subir, usa la `SUBMISSION_CHECKLIST.md`.

## Rutas sugeridas Opción A
- Frontend (Vite): `http://localhost:5173`
- Backend (Flask): `http://localhost:5001`
- OAuth Redirect: `http://localhost:5001/oauth/callback`

## Prompts relevantes para Opción A
- `23_frontend_bootstrap_scaffold.md`: crear shell de app con Bootstrap 5.
- `24_backend_flask_setup.md`: crear backend Flask (estructura, configuración, CORS).
- `25_backend_oauth_google.md`: implementar OAuth 2.0 Authorization Code (server-side).
- `26_backend_api_endpoints.md`: endpoints REST para cursos, alumnos, tareas, entregas.
- `27_backend_env_template.md`: plantilla de variables de entorno del backend.
