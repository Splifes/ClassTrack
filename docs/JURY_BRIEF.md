# JURY BRIEF — Guía rápida para evaluación

## Problema
- **Seguimiento**: No hay vista consolidada del progreso por alumno/curso/profesor.
- **Comunicación**: Notificaciones poco claras → alumnos pierden info clave.
- **Métricas**: Obtener asistencia/participación/entregas es manual y costoso.

## Solución
- **ClassTrack**: Capa complementaria a Google Classroom.
- Conexión directa a Classroom API (email como identidad).
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
1) Login con Google (PKCE) → email del usuario en Navbar.
2) Dashboard: métricas generales; abrir Students.
3) Students: filtros por cohorte/profesor/estado; ver progreso y entregas.
4) Courses: lista de cursos/profesores.
5) (Opcional) Notificaciones/Asistencia/Reportes si hay tiempo.

## Limitaciones (transparentes)
- Sin backend propio en MVP: tokens manejados en frontend con PKCE.
- Persistencia de asistencia/notificaciones simulada si no hay backend.

## Próximos pasos
- Backend proxy seguro para tokens y webhooks.
- Canal de notificaciones real y almacenamiento histórico.
- Mejorar analítica y modelos de riesgo.
