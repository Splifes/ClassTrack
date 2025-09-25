# Prompt 11 — Asistencia integrada con Google Calendar

Objetivo: vincular asistencia a eventos de clase en Google Calendar y reflejar presencia/ausencia.

Nota MD-only: este repositorio documenta especificaciones. Si no hay backend y/o scopes de Calendar habilitados, usar mock/stub para `calendar` y `attendance` y documentar el comportamiento esperado.

Instrucciones
- Premisas:
  - Cada curso tiene eventos en Calendar (título o descripción referencian `courseId`).
  - Se registrará asistencia por evento (fecha/hora) y por estudiante.
- Archivos/Capas:
  - `src/services/calendar.ts`: funciones para listar eventos por curso y fecha (`listCourseEvents(courseId, from, to)`).
  - `src/services/attendance.ts`: API del dominio asistencia: `getAttendance(courseId, eventId)`, `markAttendance(courseId, eventId, studentId, status)`.
  - `src/types/attendance.ts`: `AttendanceStatus = 'present' | 'absent' | 'late'` y contratos.
  - `src/hooks/useAttendance.ts`: hooks de lectura/escritura con React Query (optimistic updates).
  - UI: `src/pages/Attendance.tsx` con selector de curso/fecha y tabla de alumnos para marcar estado.
- Integraciones
  - Calendar: Lectura (Google Calendar API). Si no hubiera backend o scopes, se simula con mock/stub y se documenta.
  - Classroom: Mapeo alumnos del curso para mostrar lista.
- Aceptación
  - Visualizar eventos de clase por rango de fechas.
  - Marcar asistencia y ver estado agregado por alumno.
  - Persistencia:
    - Opción A (con backend): POST/PUT hacia endpoint propio.
    - Opción B (sin backend): persistencia local (temporal) y explicación en README.
- Calidad
  - Tipos estrictos, errores claros, UI accesible.
  - No bloquear UI; optimistic updates + invalidaciones.

Scopes (Roadmap)
- Si se habilita Google Calendar real, documentar los scopes necesarios en `README02.md` y `docs/ENV_SETUP.md` y ajustar este prompt en consecuencia.
