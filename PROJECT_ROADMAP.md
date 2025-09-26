# ClassTrack: Arquitectura y Hoja de Ruta

**Autor:** Cascade
**Fecha:** 2025-09-25
**Versión:** 1.0

## 1. Introducción

Este documento sirve como un análisis de la arquitectura actual de la aplicación `ClassTrack` y una hoja de ruta estratégica para su evolución. El objetivo es evaluar el progreso frente a los requisitos iniciales, identificar fortalezas y debilidades, y proponer un plan de acción claro para futuras mejoras y funcionalidades.

---

## 2. Análisis del Estado Actual vs. Requisitos

A continuación, se detalla el estado de implementación de cada uno de los objetivos planteados.

| Característica | Estado | Comentarios |
| :--- | :--- | :--- |
| **--- Requisitos Core ---** | | |
| Conexión directa a la API de Classroom | ✅ **Completado** | El `GoogleClassroomService` en el backend gestiona toda la comunicación con la API. |
| Identificación de usuarios por email | ✅ **Completado** | El flujo de autenticación OAuth2 asegura la identidad del usuario a través de su cuenta de Google. |
| Capa de visualización y gestión | ✅ **Completado** | La aplicación ofrece dashboards y vistas que agregan y presentan datos de Classroom de forma útil. |
| **--- Funcionalidades Adicionales ---** | | |
| Sistema de Roles (Alumno, Profesor, etc.) | ✅ **Completado** | La arquitectura distingue roles tanto en el frontend (`useAuth`) como en el backend para controlar el acceso. |
| Reportes Gráficos de Avance | ✅ **Completado** | El "Dashboard de Insights" para alumnos cumple con este requisito, mostrando gráficos y tablas de rendimiento. |
| Notificaciones Automáticas (Email, WhatsApp) | 🚧 **En Progreso** | La arquitectura está definida. Se ha implementado la base de datos, el `NotificationService` y el microservicio de WhatsApp. La lógica del worker y la UI de preferencias están pendientes. |
| Módulo de Asistencia (Google Calendar) | ❌ **No Implementado** | No se ha iniciado el desarrollo de esta funcionalidad. |

---

## 3. Evaluación de la Arquitectura Actual

### 3.1. Fortalezas

-   **Separación de Capas (Frontend/Backend):** La división clara entre el backend de Flask y el frontend de React es excelente. Permite un desarrollo y despliegue independientes.
-   **Arquitectura Orientada a Servicios (Backend):** El uso de una clase `GoogleClassroomService` para encapsular la lógica de negocio y la interacción con la API externa es una práctica muy sólida y mantenible.
-   **Uso de Hooks Personalizados (Frontend):** Hooks como `useApi` y `useAuth` simplifican la lógica de los componentes, reducen el código repetido y centralizan la gestión de estado y datos.
-   **Tipado Fuerte (Frontend):** El uso de TypeScript y la definición de interfaces (ej: en `courseService.ts`) aumentan la robustez y reducen errores en tiempo de ejecución.

### 3.2. Áreas de Mejora

-   **Persistencia de Datos:** La base de datos actual (SQLite) es ideal para desarrollo, pero no para producción debido a sus limitaciones con la concurrencia. 
-   **Gestión de la Configuración:** La configuración (ej: `SECRET_KEY`, URLs) está dispersa y depende de fallbacks en el código. Debería estar centralizada y ser más robusta.
-   **Manejo de Errores:** Aunque existe, el manejo de errores podría ser más consistente y centralizado, especialmente en el backend, para devolver mensajes de error estandarizados a la API.
-   **Ausencia de Pruebas Automatizadas:** El proyecto carece de tests unitarios, de integración o E2E. Esto aumenta el riesgo de regresiones a medida que la aplicación crece.

---

## 4. Hoja de Ruta de Mejoras y Nuevas Funcionalidades

Esta hoja de ruta propone un camino evolutivo para la aplicación, dividida en mejoras de la plataforma y nuevas características.

### Fase I: Robustecer la Plataforma

*Objetivo: Fortalecer la base técnica de la aplicación para prepararla para producción y crecimiento futuro.*

1.  **[Backend] Migrar a PostgreSQL:**
    -   **Por qué:** PostgreSQL es una base de datos de nivel de producción, robusta y escalable.
    -   **Acción:** Cambiar la `SQLALCHEMY_DATABASE_URI` en producción, instalar el driver `psycopg2-binary` y ajustar la configuración de despliegue (Docker Compose).

2.  **[Backend] Centralizar la Configuración:**
    -   **Por qué:** Evitar hardcodeo y facilitar la gestión de diferentes entornos (desarrollo, producción).
    -   **Acción:** Crear un objeto de configuración en Flask (ej: `config.py`) que cargue variables según el entorno (`FLASK_ENV`).

3.  **[Backend] Implementar un Framework de Testing:**
    -   **Por qué:** Para garantizar la calidad y evitar regresiones.
    -   **Acción:** Introducir `pytest`. Empezar con tests unitarios para los servicios (ej: `NotificationService`) y luego añadir tests de integración para los endpoints de la API.

4.  **[Frontend] Centralizar el Manejo de Estado Global:**
    -   **Por qué:** A medida que la app crece, pasar props se vuelve complejo. Un estado global simplifica el acceso a datos compartidos (como el perfil del usuario).
    -   **Acción:** Integrar una librería de manejo de estado como **Zustand** o **Redux Toolkit**. Es más simple y moderna que Redux clásico.

### Fase II: Implementación de Nuevas Funcionalidades

*Objetivo: Desarrollar las características pendientes y expandir la propuesta de valor de la aplicación.*

1.  **[Core] Finalizar el Sistema de Notificaciones:**
    -   **Por qué:** Es una funcionalidad de alto impacto que ya está a medio camino.
    -   **Acción:** Completar los pasos de la **Fase 3 y 4** del plan de notificaciones: implementar los endpoints de preferencias, la UI en el frontend y la lógica del worker en el backend.

2.  **[Feature] Módulo de Asistencia con Google Calendar:**
    -   **Por qué:** Cumple con uno de los requisitos opcionales y añade un valor práctico inmenso para profesores.
    -   **Acción:**
        1.  **Backend:** Añadir los scopes de Google Calendar al flujo de OAuth. Crear un `GoogleCalendarService`.
        2.  **Backend:** Crear endpoints para `GET /api/courses/{id}/events`.
        3.  **Frontend:** Crear una nueva pestaña "Asistencia" en la vista del profesor, que liste los eventos del calendario y permita marcar la asistencia.

3.  **[Feature] Dashboard de Coordinador:**
    -   **Por qué:** El rol de coordinador existe pero no tiene una vista dedicada.
    -   **Acción:** Crear una nueva ruta `/dashboard/coordinator` que muestre estadísticas agregadas de múltiples cursos: promedio de notas por cohorte, tasa de entregas, etc.

### Fase III: Mejoras de Calidad de Vida y UX

*Objetivo: Pulir la aplicación y hacerla más atractiva y fácil de usar.*

1.  **[Frontend] Crear una Librería de Componentes de UI:**
    -   **Por qué:** Para asegurar una consistencia visual y acelerar el desarrollo.
    -   **Acción:** Crear un directorio `frontend/src/components/common` para componentes genéricos y reutilizables (botones, modales, spinners, etc.).

2.  **[Feature] Gamificación y Logros:**
    -   **Por qué:** Para aumentar la motivación y el engagement de los alumnos.
    -   **Acción:** Crear un sistema simple donde los alumnos ganen insignias por hitos: "Racha de 5 entregas a tiempo", "Primera nota sobresaliente", "Colaborador Activo" (basado en el chat), etc.

3.  **[Infraestructura] Configurar un Pipeline de CI/CD:**
    -   **Por qué:** Para automatizar las pruebas y el despliegue.
    -   **Acción:** Usar GitHub Actions para crear un workflow que, en cada push a la rama principal, ejecute los tests y, si pasan, despliegue automáticamente los servicios (backend y microservicio de WhatsApp).
