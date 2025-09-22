# Meta-Prompt — Cómo pedir código de forma eficiente

Usa este meta-prompt como prefacio para cada prompt específico. Asegura calidad, consistencia y velocidad.

Contexto del proyecto
- App: ClassTrack — capa complementaria a Google Classroom.
- Stack: React 18 + TypeScript + Vite + Tailwind + React Query + Zustand + React Router.
- Calidad: SOLID, tipado estricto, accesibilidad básica, DX sencilla.
- Restricción: No usar secretos en el repo; variables `VITE_*`.

Instrucciones al asistente
- Responde generando solo los archivos solicitados y su contenido, listando rutas y snippets.
- Todo TypeScript con `strict: true` (sin `any` implícitos).
- Componentes y hooks con props y retornos tipados.
- Manejo de errores explícito y mensajes claros.
- Tailwind para estilos, util `cn()` con `clsx` + `tailwind-merge` cuando corresponda.
- Estructura limpia: `src/components`, `src/pages`, `src/routes`, `src/services`, `src/hooks`, `src/store`, `src/types`, `src/lib`.
- No agregar dependencias fuera de las listadas salvo que se justifique brevemente.
- Pequeños pasos: si un cambio excede 250–300 líneas, dividir en múltiples pasos.
- Incluye notas de verificación rápida (cómo probar lo generado).

Formato de respuesta esperado
- Encabezado con objetivo
- Lista de archivos creados/actualizados con rutas
- Código en bloques por archivo
- Post-steps: comandos a correr (si aplica) y pruebas manuales rápidas
