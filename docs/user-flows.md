# Flujos de Usuario - ClassTrack MVP

## 🎯 Objetivos de UX

- **Simplicidad**: Interfaz intuitiva y fácil de navegar
- **Eficiencia**: Acceso rápido a información crítica
- **Claridad**: Visualización clara del progreso y estados
- **Escalabilidad**: Diseño que soporte crecimiento futuro

---

## 👥 Personas y Roles

### 1. Coordinador de Semillero Digital
- **Necesidades**: Vista general de todos los cursos, métricas agregadas, identificación de estudiantes en riesgo
- **Permisos**: Acceso completo a todos los datos, filtros avanzados, exportación de reportes

### 2. Profesor
- **Necesidades**: Vista de sus cursos específicos, progreso de estudiantes, identificación de tareas pendientes
- **Permisos**: Acceso a sus cursos asignados, vista de estudiantes, métricas de curso

### 3. Estudiante
- **Necesidades**: Vista de su progreso personal, estado de entregas, fechas importantes
- **Permisos**: Acceso limitado a su información personal

---

## 🔄 Flujos Principales

### Flujo 1: Autenticación y Onboarding

```
1. Usuario accede a ClassTrack
2. Sistema detecta si está autenticado
3. Si NO está autenticado:
   - Redirige a página de login
   - Muestra botón "Iniciar sesión con Google"
   - Usuario autoriza permisos de Google Classroom
   - Sistema obtiene tokens y información del usuario
   - Determina rol basado en email/dominio
   - Redirige a dashboard correspondiente
4. Si SÍ está autenticado:
   - Verifica validez del token
   - Si expirado, intenta refrescar
   - Si válido, carga dashboard
```

### Flujo 2: Dashboard Principal (Coordinador)

```
1. Usuario accede al dashboard
2. Sistema carga métricas generales:
   - Total de estudiantes activos
   - Total de cursos
   - Promedio de completitud
   - Estudiantes en riesgo
3. Usuario puede:
   - Ver gráficos de progreso general
   - Filtrar por cohorte/profesor/tiempo
   - Acceder a vista detallada de cursos
   - Exportar reportes
4. Navegación rápida a:
   - Lista de estudiantes
   - Vista de profesores
   - Análisis por cohorte
```

### Flujo 3: Vista de Progreso por Estudiante

```
1. Usuario selecciona estudiante desde lista o búsqueda
2. Sistema carga información del estudiante:
   - Datos personales
   - Cursos inscritos
   - Métricas de progreso
   - Historial de entregas
3. Vista detallada incluye:
   - Gráfico de progreso por curso
   - Lista de entregas con estados
   - Calificaciones promedio
   - Alertas de riesgo
4. Acciones disponibles:
   - Filtrar por curso/estado/tiempo
   - Ver detalles de entrega específica
   - Exportar reporte individual
```

### Flujo 4: Vista de Clases por Profesor

```
1. Usuario selecciona profesor desde lista
2. Sistema carga información del profesor:
   - Cursos asignados
   - Estudiantes por curso
   - Métricas de enseñanza
3. Vista incluye:
   - Dashboard del profesor
   - Lista de cursos con métricas
   - Estudiantes por curso
   - Análisis de rendimiento
4. Acciones disponibles:
   - Ver detalles de curso específico
   - Analizar progreso de estudiantes
   - Identificar estudiantes en riesgo
```

### Flujo 5: Seguimiento de Entregas

```
1. Usuario accede a vista de entregas
2. Sistema muestra lista filtrable de entregas:
   - Por estado (Entregado, Atrasado, Faltante, Reentrega)
   - Por curso/profesor/estudiante
   - Por fecha
3. Cada entrega muestra:
   - Información del estudiante
   - Título de la tarea
   - Fecha de entrega/vencimiento
   - Estado actual
   - Calificación (si aplica)
4. Acciones disponibles:
   - Filtrar por múltiples criterios
   - Ver detalles completos
   - Exportar lista filtrada
```

---

## 📱 Estructura de Navegación

### Menú Principal
```
ClassTrack Logo
├── Dashboard (Home)
├── Estudiantes
│   ├── Lista General
│   ├── Por Cohorte
│   └── En Riesgo
├── Profesores
│   ├── Lista General
│   └── Por Curso
├── Cursos
│   ├── Lista General
│   ├── Por Profesor
│   └── Métricas
├── Entregas
│   ├── Todas las Entregas
│   ├── Por Estado
│   └── Por Fecha
└── Reportes
    ├── Generales
    ├── Por Cohorte
    └── Exportar
```

### Breadcrumbs
```
Dashboard > Estudiantes > Juan Pérez > Curso: React Avanzado
```

---

## 🎨 Estados de la Interfaz

### Estados de Carga
- **Carga inicial**: Skeleton screens para dashboard
- **Carga de datos**: Spinners en componentes específicos
- **Carga de filtros**: Estados de carga en listas filtradas

### Estados de Error
- **Error de autenticación**: Mensaje claro con botón de reintento
- **Error de API**: Mensaje de error con opción de refrescar
- **Sin datos**: Estados vacíos con mensajes informativos

### Estados de Éxito
- **Datos cargados**: Transiciones suaves entre estados
- **Filtros aplicados**: Feedback visual de filtros activos
- **Acciones completadas**: Notificaciones de éxito

---

## 🔍 Funcionalidades de Búsqueda y Filtrado

### Búsqueda Global
- Campo de búsqueda en header
- Búsqueda por nombre, email, curso
- Sugerencias en tiempo real
- Historial de búsquedas

### Filtros Avanzados
- **Por tiempo**: Última semana, mes, trimestre, año
- **Por estado**: Todos los estados de entrega
- **Por cohorte**: Filtro por grupo de estudiantes
- **Por profesor**: Filtro por instructor
- **Por curso**: Filtro por materia específica

### Filtros Combinados
- Múltiples filtros simultáneos
- Guardado de filtros favoritos
- Exportación de resultados filtrados
- Compartir enlaces con filtros aplicados

---

## 📊 Visualizaciones de Datos

### Gráficos Principales
- **Gráfico de progreso**: Barras de progreso por estudiante/curso
- **Gráfico de completitud**: Pie chart de estados de entrega
- **Gráfico temporal**: Línea de tiempo de entregas
- **Gráfico de rendimiento**: Comparación entre estudiantes/cursos

### Métricas Clave
- **KPIs principales**: Números destacados en cards
- **Tendencias**: Indicadores de mejora/empeoramiento
- **Alertas**: Notificaciones de estudiantes en riesgo
- **Comparaciones**: Métricas relativas entre períodos

---

## 🚀 Flujos de Acceso Rápido

### Shortcuts de Teclado
- `Ctrl + K`: Búsqueda global
- `Ctrl + F`: Filtros rápidos
- `Ctrl + E`: Exportar datos actuales
- `Ctrl + R`: Refrescar datos

### Acciones Rápidas
- Botones de acción flotantes
- Menús contextuales en elementos
- Drag & drop para reorganizar
- Click derecho para opciones adicionales

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones por Dispositivo
- **Mobile**: Navegación por tabs, cards apiladas
- **Tablet**: Sidebar colapsable, grid adaptativo
- **Desktop**: Sidebar fijo, múltiples columnas

---

## ♿ Accesibilidad

### Estándares WCAG 2.1 AA
- Contraste mínimo 4.5:1
- Navegación por teclado completa
- Etiquetas ARIA apropiadas
- Texto alternativo en imágenes
- Indicadores de estado claros

### Funcionalidades de Accesibilidad
- Modo de alto contraste
- Tamaño de fuente ajustable
- Navegación por voz
- Lectores de pantalla compatibles

