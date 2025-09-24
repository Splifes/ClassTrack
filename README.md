# ClassTrack MVP - Documentación de Diseño

> Aviso: Este repositorio no contiene código ejecutable. Es un entregable de competencia con especificaciones y documentación. Todas las configuraciones técnicas están documentadas en `docs/config/` y la guía de estructura está en `STRUCTURE.md`.

## Descripción del Proyecto
ClassTrack es una aplicación web para el seguimiento y análisis del progreso de estudiantes en Google Classroom, desarrollada para el Semillero de Desarrollo.

## Arquitectura del Sistema

### Frontend
- **Framework**: React 18 con TypeScript
- **Bundler**: Vite
- **Styling**: Bootstrap 5
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend (Opción A)
- **Framework**: Flask (Python)
- **Función**: OAuth 2.0 Authorization Code (server-side) y proxy a Google Classroom
- **CORS**: Permite `http://localhost:5173`
- **Persistencia**: Opcional (Roadmap) si se adopta DB

### Integración
- **Google Classroom API**: Sincronización de datos
- **OAuth 2.0**: Autenticación segura
- **Real-time Updates**: Notificaciones en tiempo real

## Estructura del Proyecto

### `/src/services/`
- **authService.md**: Servicio de autenticación OAuth
- **googleClassroomApi.md**: Integración con backend (proxy de Google Classroom)

### `/src/store/`
- **index.md**: Estado global con Zustand

### `/src/types/`
- **index.md**: Definiciones de tipos TypeScript

### `/src/components/ui/`
- **Button.md**: Componente de botón reutilizable
- **Card.md**: Componente de tarjeta
- **index.md**: Índice de componentes UI

### `/src/hooks/`
- **useGoogleClassroom.md**: Hook para consumir endpoints del backend

### `/src/data/`
- **mockData.md**: Datos de prueba para desarrollo

## Funcionalidades Principales

### Dashboard
- Métricas generales del sistema
- Gráficos de progreso de estudiantes
- Notificaciones y alertas
- Filtros por cohorte, profesor, curso

### Gestión de Estudiantes
- Lista de estudiantes con métricas
- Detalles individuales de progreso
- Identificación de estudiantes en riesgo
- Filtros y búsquedas avanzadas

### Gestión de Cursos
- Lista de cursos y profesores
- Métricas de rendimiento por curso
- Análisis de completación de tareas
- Comparativas entre cursos

### Gestión de Entregas
- Estado de entregas de estudiantes
- Calificaciones y retroalimentación
- Entregas tardías y faltantes
- Historial de entregas

### Gestión de Cohortes
- Agrupación de estudiantes por cohorte
- Métricas de rendimiento grupal
- Comparativas entre cohortes
- Identificación de cohortes en riesgo

## Configuración de Desarrollo

### Prerrequisitos
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Instalación
```bash
pnpm install
```

### Variables de Entorno
Copiar `env.example` a `.env.local` y configurar:
- `VITE_BACKEND_URL` (por ejemplo `http://localhost:5001`)

### Scripts
- `pnpm dev`: Servidor de desarrollo
- `pnpm build`: Construcción para producción
- `pnpm lint`: Verificación de código
- `pnpm type-check`: Verificación de tipos

## Diseño de Base de Datos

### Entidades Principales
- **Users**: Usuarios del sistema
- **Students**: Estudiantes
- **Teachers**: Profesores
- **Courses**: Cursos
- **Submissions**: Entregas de estudiantes
- **Cohorts**: Grupos de estudiantes

### Relaciones
- Un estudiante puede estar en múltiples cursos
- Un curso tiene un profesor y múltiples estudiantes
- Una entrega pertenece a un estudiante y una tarea
- Una cohorte agrupa múltiples estudiantes

## Patrones de Diseño

### Frontend
- **Component Composition**: Composición de componentes
- **Custom Hooks**: Lógica reutilizable
- **State Management**: Zustand para estado global
- **Type Safety**: TypeScript para tipado estático

### Backend (Futuro)
- **Repository Pattern**: Acceso a datos
- **Service Layer**: Lógica de negocio
- **DTO Pattern**: Transferencia de datos
- **Middleware Pattern**: Funcionalidad transversal

## Seguridad

### Autenticación
- OAuth 2.0 Authorization Code (server-side) con Google
- Intercambio de tokens y sesión gestionados en el backend (Flask)
- Logout seguro (invalidación de sesión en backend)

### Autorización
- Roles: coordinator, teacher, student
- Permisos basados en rol
- Acceso restringido a datos
- Validación en frontend y backend

## Escalabilidad

### Frontend
- Code splitting por rutas
- Lazy loading de componentes
- Caching de datos con React Query
- Optimización de bundle

### Backend (Futuro)
 - Persistencia opcional (Supabase/PostgreSQL) si se requiere almacenamiento propio
 - API REST adicional (si aplica)
 - Caching con Redis (opcional)
 - CDN para assets estáticos (opcional)

## Monitoreo y Analytics

### Métricas de Rendimiento
- Tiempo de carga de páginas
- Tiempo de respuesta de API
- Uso de memoria y CPU
- Errores y excepciones

### Métricas de Negocio
- Progreso de estudiantes
- Tasa de completación de tareas
- Estudiantes en riesgo
- Efectividad de profesores

## Roadmap

### Fase 1 (MVP)
- [x] Diseño de arquitectura
- [x] Integración con Google Classroom
- [x] Dashboard básico
- [x] Gestión de estudiantes

### Fase 2
- [ ] Base de datos real (Supabase)
- [ ] API REST
- [ ] Notificaciones en tiempo real
- [ ] Reportes avanzados

### Fase 3
- [ ] Mobile app
- [ ] Integración con más LMS
- [ ] Machine Learning para predicciones
- [ ] Analytics avanzados