# Prompt 09 — Notificaciones (Email/WhatsApp/Telegram)

Objetivo: enviar notificaciones automáticas ante nuevas tareas o cambios relevantes.

Instrucciones
- Proveer una interfaz `NotificationService` en `src/services/notification.ts` con métodos:
  - `notifyAssignmentCreated(courseId, courseWorkId)`
  - `notifyAssignmentUpdated(courseId, courseWorkId)`
  - `notifyReminder(courseId, courseWorkId, when)`
- Empezar con proveedor dummy (console/log) y dejar adaptadores plug-in para Email/WhatsApp/Telegram.
- Agregar configuraciones en `.env.example` para providers (sin valores reales).
- Suscribirse a eventos desde el flujo de Classroom (polling o webhook si hubiera backend), inicialmente polling simple con React Query + intervals.

Aceptación
- Interfaz y adaptadores tipados.
- Simulación de envío (logs) con estructura lista para proveedor real.
- Config fácil de activar/desactivar por tipo de notificación.
