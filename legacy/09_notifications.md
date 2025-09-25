# Prompt 09 — Notificaciones (Email/WhatsApp/Telegram)

Objetivo: enviar notificaciones automáticas ante nuevas tareas o cambios relevantes.

Nota MD-only: este repositorio documenta especificaciones. No implementar código ni integrar proveedores reales. Usar `src/services/notification.md` como documentación del servicio y adaptadores.

Instrucciones
- Proveer una interfaz `NotificationService` en `src/services/notification.md` (documental) con métodos:
  - `notifyAssignmentCreated(courseId, courseWorkId)`
  - `notifyAssignmentUpdated(courseId, courseWorkId)`
  - `notifyReminder(courseId, courseWorkId, when)`
- Empezar con proveedor dummy (console/log documental) y dejar adaptadores plug-in para Email/WhatsApp/Telegram como especificación.
- Agregar configuraciones en `.env.example` documental para providers (sin valores reales).
- Suscribirse a eventos desde el flujo de Classroom (polling o webhook si hubiera backend), inicialmente polling simple con React Query + intervals.

Aceptación
- Interfaz y adaptadores tipados.
- Simulación de envío (logs) con estructura lista para proveedor real.
- Config fácil de activar/desactivar por tipo de notificación.
