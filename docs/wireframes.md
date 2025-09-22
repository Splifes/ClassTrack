# Wireframes y Diseño de Pantallas - ClassTrack MVP

## 🎨 Principios de Diseño

- **Estilo**: Corporativo, profesional, moderno y escalable
- **Paleta de colores**: Grises profesionales con acentos azules
- **Tipografía**: Inter (sistema) para legibilidad y profesionalismo
- **Espaciado**: Sistema de 8px para consistencia
- **Componentes**: Reutilizables y modulares

---

## 📱 Estructura de Pantallas

### 1. Página de Login

```
┌─────────────────────────────────────┐
│           ClassTrack Logo            │
│        "Seguimiento claro,          │
│       decisiones inteligentes"       │
│                                     │
│    ┌─────────────────────────────┐  │
│    │  Iniciar sesión con Google   │  │
│    │        [G] Continuar         │  │
│    └─────────────────────────────┘  │
│                                     │
│    ℹ️ Conecta con Google Classroom  │
│       para acceder a tus datos      │
│                                     │
│    📋 Requisitos:                   │
│    • Cuenta de Google válida        │
│    • Acceso a Google Classroom      │
│    • Permisos de lectura            │
└─────────────────────────────────────┘
```

### 2. Dashboard Principal (Coordinador)

```
┌─────────────────────────────────────────────────────────────┐
│ ClassTrack    [🔍 Buscar]    [👤 Usuario] [⚙️ Config] [🚪] │
├─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard                                                │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │  1,247  │ │   45   │ │  87.3%  │ │   23    │            │
│ │Estudiant│ │ Cursos │ │Completit│ │En Riesgo│            │
│ │   es    │ │        │ │   ud    │ │         │            │
│ └─────────┘ └─────────┘ ┌─────────┘ └─────────┘            │
│                         │   📈 Progreso General             │
│ ┌─────────────────────┐ │   [Gráfico de líneas]            │
│ │     📋 Filtros      │ │                                 │
│ │                     │ │   📊 Estados de Entrega         │
│ │ Cohorte: [Todos ▼] │ │   [Gráfico de barras]           │
│ │ Profesor: [Todos ▼] │ │                                 │
│ │ Tiempo: [Mes ▼]     │ │   🚨 Alertas Recientes          │
│ │ [Aplicar] [Limpiar] │ │   • Juan Pérez - React Avanzado │
│ └─────────────────────┘ │   • María García - JavaScript   │
│                         │   • Carlos López - Node.js      │
│ ┌─────────────────────┐ │                                 │
│ │    🎯 Acciones      │ │   📋 Cursos Destacados          │
│ │                     │ │   • React Avanzado (95%)        │
│ │ [Ver Estudiantes]   │ │   • JavaScript (87%)            │
│ │ [Ver Profesores]    │ │   • Node.js (82%)               │
│ │ [Generar Reporte]   │ │                                 │
│ │ [Exportar Datos]    │ │                                 │
│ └─────────────────────┘ │                                 │
└─────────────────────────────────────────────────────────────┘
```

### 3. Lista de Estudiantes

```
┌─────────────────────────────────────────────────────────────┐
│ ClassTrack    [🔍 Buscar]    [👤 Usuario] [⚙️ Config] [🚪] │
├─────────────────────────────────────────────────────────────┤
│ 👥 Estudiantes                    [➕ Nuevo] [📊 Vista] [📤] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 Filtros Avanzados                                   │ │
│ │                                                         │ │
│ │ Cohorte: [Todos ▼] Profesor: [Todos ▼] Estado: [Todos ▼] │ │
│ │ Curso: [Todos ▼] Fecha: [Último mes ▼] [Aplicar] [Limpiar] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Nombre        │ Email           │ Cohorte │ Progreso │ Estado │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Juan Pérez    │ juan@email.com  │ 2024-1  │ ████░░ 80% │ ✅    │ │
│ │ María García  │ maria@email.com │ 2024-1  │ ███░░░ 60% │ ⚠️    │ │
│ │ Carlos López  │ carlos@email.com │ 2024-2  │ ██████ 95% │ ✅    │ │
│ │ Ana Martínez  │ ana@email.com   │ 2024-2  │ ██░░░░ 40% │ ❌    │ │
│ │ Luis Rodríguez│ luis@email.com  │ 2024-1  │ █████░ 85% │ ✅    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [◀️ Anterior] Página 1 de 5 [Siguiente ▶️]                  │
└─────────────────────────────────────────────────────────────┘
```

### 4. Vista Detallada de Estudiante

```
┌─────────────────────────────────────────────────────────────┐
│ ClassTrack    [🔍 Buscar]    [👤 Usuario] [⚙️ Config] [🚪] │
├─────────────────────────────────────────────────────────────┤
│ 👤 Juan Pérez - Estudiante                    [✏️ Editar]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📸 [Foto]  Juan Pérez          📧 juan@email.com      │ │
│ │           Estudiante           📱 +54 9 11 1234-5678   │ │
│ │           Cohorte 2024-1       🏠 Buenos Aires, AR    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │     12      │ │     8       │ │     2       │ │  85.5   │ │
│ │  Tareas     │ │Completadas  │ │  Atrasadas  │ │ Promedio│ │
│ │  Totales    │ │             │ │             │ │         │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📊 Progreso por Curso                                  │ │
│ │                                                         │ │
│ │ React Avanzado    ████████░░ 80%  [Ver detalles]      │ │
│ │ JavaScript        ██████░░░░ 60%  [Ver detalles]      │ │
│ │ Node.js           █████████░ 90%  [Ver detalles]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 Entregas Recientes                                  │ │
│ │                                                         │ │
│ │ Tarea                    │ Estado │ Fecha    │ Calificación │ │
│ │ Proyecto Final React     │ ✅     │ 15/09    │ 9.5          │ │
│ │ Ejercicios JavaScript   │ ⚠️     │ 12/09    │ -            │ │
│ │ API REST Node.js        │ ✅     │ 10/09    │ 8.8          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5. Vista de Profesores

```
┌─────────────────────────────────────────────────────────────┐
│ ClassTrack    [🔍 Buscar]    [👤 Usuario] [⚙️ Config] [🚪] │
├─────────────────────────────────────────────────────────────┤
│ 👨‍🏫 Profesores                      [➕ Nuevo] [📊 Vista] [📤] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 Filtros                                            │ │
│ │                                                         │ │
│ │ Curso: [Todos ▼] Estudiantes: [Todos ▼] [Aplicar] [Limpiar] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Profesor        │ Cursos │ Estudiantes │ Promedio │ Estado │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Dr. Ana Silva   │   3    │     45      │   87.3%  │ ✅    │ │
│ │ Ing. Carlos Ruiz│   2    │     32      │   92.1%  │ ✅    │ │
│ │ Lic. María López│   4    │     58      │   78.9%  │ ⚠️    │ │
│ │ Prof. Luis Vega │   1    │     25      │   95.2%  │ ✅    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📊 Métricas Generales                                  │ │
│ │                                                         │ │
│ │ Total Profesores: 4    │ Promedio General: 88.4%      │ │
│ │ Cursos Activos: 10     │ Estudiantes en Riesgo: 12     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6. Vista de Entregas

```
┌─────────────────────────────────────────────────────────────┐
│ ClassTrack    [🔍 Buscar]    [👤 Usuario] [⚙️ Config] [🚪] │
├─────────────────────────────────────────────────────────────┤
│ 📋 Entregas                        [➕ Nueva] [📊 Vista] [📤] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 Filtros Avanzados                                   │ │
│ │                                                         │ │
│ │ Estado: [Todos ▼] Curso: [Todos ▼] Estudiante: [Todos ▼] │ │
│ │ Fecha: [Último mes ▼] Profesor: [Todos ▼] [Aplicar] [Limpiar] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Estado │ Estudiante    │ Tarea              │ Fecha │ Calif │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ✅     │ Juan Pérez    │ Proyecto Final     │ 15/09 │ 9.5   │ │
│ │ ⚠️     │ María García  │ Ejercicios JS      │ 12/09 │ -     │ │
│ │ ❌     │ Carlos López  │ API REST           │ 10/09 │ -     │ │
│ │ 🔄     │ Ana Martínez  │ Reentrega Final    │ 08/09 │ 7.2   │ │
│ │ ✅     │ Luis Rodríguez│ Proyecto Node.js  │ 05/09 │ 8.8   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📊 Resumen por Estado                                   │ │
│ │                                                         │ │
│ │ ✅ Entregado: 45 (67%)  │ ⚠️ Atrasado: 12 (18%)        │ │
│ │ ❌ Faltante: 8 (12%)    │ 🔄 Reentrega: 2 (3%)         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 7. Vista de Cursos

```
┌─────────────────────────────────────────────────────────────┐
│ ClassTrack    [🔍 Buscar]    [👤 Usuario] [⚙️ Config] [🚪] │
├─────────────────────────────────────────────────────────────┤
│ 📚 Cursos                          [➕ Nuevo] [📊 Vista] [📤] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📋 Filtros                                            │ │
│ │                                                         │ │
│ │ Profesor: [Todos ▼] Cohorte: [Todos ▼] Estado: [Todos ▼] │ │
│ │ [Aplicar] [Limpiar]                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Curso              │ Profesor      │ Estudiantes │ Progreso │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ React Avanzado     │ Dr. Ana Silva │     25      │ ████░░ 80% │ │
│ │ JavaScript Moderno │ Ing. Carlos   │     32      │ ███░░░ 60% │ │
│ │ Node.js Backend    │ Lic. María    │     28      │ █████░ 85% │ │
│ │ TypeScript         │ Prof. Luis    │     20      │ ██████ 90% │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📊 Métricas por Curso                                  │ │
│ │                                                         │ │
│ │ Total Cursos: 4        │ Promedio Completitud: 78.8%  │ │
│ │ Estudiantes Totales: 105│ Cursos en Riesgo: 1          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Sistema de Componentes

### Cards de Métricas
```
┌─────────────────┐
│       1,247     │
│   Estudiantes   │
│   📈 +12% vs    │
│   mes anterior  │
└─────────────────┘
```

### Barras de Progreso
```
React Avanzado    ████████░░ 80%
JavaScript        ███░░░░░░ 30%
Node.js           █████████░ 90%
```

### Estados de Entrega
```
✅ Entregado    ⚠️ Atrasado    ❌ Faltante    🔄 Reentrega
```

### Botones de Acción
```
[🔍 Buscar] [📊 Vista] [📤 Exportar] [➕ Nuevo] [✏️ Editar]
```

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Navegación por tabs en la parte inferior
- Cards apiladas verticalmente
- Filtros en modal deslizable
- Botones de acción en FAB (Floating Action Button)

### Tablet (768px - 1024px)
- Sidebar colapsable
- Grid de 2 columnas para métricas
- Filtros en sidebar lateral
- Navegación híbrida (tabs + sidebar)

### Desktop (> 1024px)
- Sidebar fijo siempre visible
- Grid de 4 columnas para métricas
- Filtros en barra superior
- Navegación completa en sidebar

---

## 🎯 Estados de Interacción

### Hover States
- Cards con elevación sutil
- Botones con cambio de color
- Enlaces con subrayado
- Imágenes con overlay sutil

### Active States
- Botones con estado presionado
- Filtros con indicador activo
- Navegación con elemento seleccionado
- Formularios con campos enfocados

### Loading States
- Skeleton screens para contenido
- Spinners para acciones
- Progress bars para carga
- Placeholders para imágenes

### Error States
- Mensajes de error claros
- Botones de reintento
- Estados vacíos informativos
- Validación en tiempo real



