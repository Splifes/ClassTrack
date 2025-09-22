# Prompt Kit (Generación de Código en el día del concurso)

Esta carpeta contiene prompts listos para copiar/pegar y generar código de forma rápida, consistente y sin desviarnos del alcance.

- No contiene código.
- Cada prompt detalla: alcance, archivos a crear, criterios de aceptación, calidad (SOLID, tipado estricto), y validaciones.
- Orden sugerido: seguir la numeración `01_..`, `02_..`, etc.

## Reglas generales para todos los prompts
- TypeScript estricto (`strict: true`, sin `any` implícitos).
- Arquitectura limpia: separación de capas (UI, hooks, servicios, store, tipos).
- SOLID y composición de componentes.
- Accesibilidad (ARIA), i18n mínima (estructura preparada), y responsive con Tailwind.
- Evitar dependencias innecesarias; usar solo las listadas.
- Seguridad: no exponer secretos; usar variables `VITE_*`.
- Logs y errores claros; no silenciar errores.
- Pequeños commits atómicos (cuando apliques en tu repo privado para pruebas).

## Flujo de uso el día del evento
1. Abre `RUNBOOK.md` y sigue la timeline.
2. Toma el prompt correspondiente a la fase y pégalo en tu asistente de código (Windsurf/Cascade).
3. Revisa el diff/archivos propuestos, itera rápido si algo no cumple los criterios.
4. Pasa a la siguiente fase.
5. Antes de subir, usa la `SUBMISSION_CHECKLIST.md`.
