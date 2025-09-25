# JURY BRIEF — Guía rápida para evaluación

## Problema
- **Seguimiento**: No hay vista consolidada del progreso por alumno/curso/profesor.
- **Comunicación**: Notificaciones poco claras → alumnos pierden info clave.
- **Métricas**: Obtener asistencia/participación/entregas es manual y costoso.

## Solución
- **ClassTrack**: Capa complementaria a Google Classroom.
- Conexión a Classroom API a través de backend Flask (proxy) y OAuth 2.0 server-side (email como identidad).
- Dashboard y vistas por rol con filtros por cohorte/profesor/estado.

## Por qué ahora
- Escala de cohortes en crecimiento, necesidad de reporting y foco en retención.
- Datos ya existen en Classroom; falta visualización y acciones.

## MVP (criterios del hackathon)
- Integración real con Google Classroom API.
- Filtros por cohorte, profesor y estado de entrega.
- Dashboard con:
  - Lista de alumnos y progreso.
  - Lista de profesores y sus clases.
  - Estado de entregas (entregado, atrasado, faltante, reentrega).

## Impacto
- Coordinadores toman decisiones con datos (riesgo, atrasos, asistencia).
- Profesores priorizan alumnos en riesgo.
- Alumnos reciben recordatorios oportunos.

## Usabilidad
- UI clara, responsive y accesible.
- Navegación por rutas simples y filtros comprensibles.

## Escalabilidad
- Arquitectura modular (servicios, hooks, store, tipos).
- Code splitting por rutas y caching con React Query.

## Innovación (opcionales)
- Notificaciones multi-canal (Email/WhatsApp/Telegram).
- Asistencia vinculada a Calendar.
- Reportes avanzados y exportables.

## Demo (1–2 minutos)
1) Roles y navegación (MD-only)
   - Abrir `docs/design/ROLES_VIEWS.md` → tablas Rutas×Roles y Datos×Roles (student/teacher/coordinator).
2) Flujo Student (Courses → CourseDetail → ClassDetail)
   - `prompts/02_app_shell_routing.md` confirma rutas `/courses/:courseId` y `/courses/:courseId/classes/:classId`.
   - En `ClassDetail`, mostrar panel de chat (widget externo) y convención `roomId = ${courseId}-${classId}`.
3) Teacher: exporte por curso
   - `docs/DATA_MODEL.md` → columnas mínimas CSV (Teacher). `prompts/94_batch_features.md` checklist de exportes.
4) Coordinator: KPIs y filtros
   - `docs/design/COMPONENT_SPECS.md` → “Dashboard Coordinator” (KPIs, filtros avanzados y tablas comparativas).
5) Testing/Deploy (documental)
   - `prompts/95_batch_testing_deploy.md` → smoke routing, SPA fallback (`docs/config/vite.md`), variables `VITE_*` (`docs/config/env.md`).

## Limitaciones (transparentes)
- Backend mínimo (Flask) sin persistencia propia; la app opera en modo lectura con Google Classroom.
- Persistencia de asistencia/notificaciones simulada si no se adopta una DB (Roadmap).

## Próximos pasos
- Persistencia (DB) y webhooks/notificaciones.
- Canal de notificaciones real y almacenamiento histórico.
- Mejorar analítica y modelos de riesgo.
 - Calendar real (scopes) y chat tiempo real (Flask-SocketIO) como roadmap.
