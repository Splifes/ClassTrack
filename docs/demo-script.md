# Guion para Video Demo - ClassTrack MVP

## 🎬 Información General

- **Duración**: 1-2 minutos
- **Formato**: Pantalla completa con narración
- **Estilo**: Profesional, dinámico, enfocado en resultados
- **Público**: Jurados de Nerdearla Vibeathon

## ⏱️ Resumen express (1–2 min)

- 0:00–0:05 — Logo + tagline: "Seguimiento claro, decisiones inteligentes".
- 0:05–0:20 — Dashboard: 3 KPIs, filtros (cohorte/profesor/estado), gráficos.
- 0:20–0:35 — Students: lista, estados (entregado/atrasado/faltante/reentrega), alumnos en riesgo.
- 0:35–0:50 — Courses: clases por profesor, métricas resumidas.
- 0:50–1:10 — Login Google (server-side via backend Flask) y seguridad: solo lectura, scopes mínimos.
- 1:10–1:25 — Impacto: -70% tiempo de seguimiento, +85% comunicación, +200% detección de riesgo.
- 1:25–1:35 — Opcionales (si aplica): notificaciones, asistencia, reportes/export.
- 1:35–1:50 — Cierre: nombre del proyecto, QR demo, contacto.

---

## 📝 Guion Detallado

### [0:00 - 0:15] Introducción y Problema

**Visual**: Logo de ClassTrack con animación de entrada**

**Narración**: 
> "¿Te imaginas poder ver el progreso de todos tus estudiantes en tiempo real? ClassTrack conecta directamente con Google Classroom para resolver tres problemas clave: seguimiento, comunicación y métricas."

**Visual**: 
- Transición suave a dashboard principal
- Destacar los 3 KPIs principales con animación
- Mostrar métricas: 1,247 estudiantes, 45 cursos, 87.3% completitud

---

### [0:15 - 0:45] Funcionalidades Principales

**Narración**: 
> "Como coordinador, tienes acceso completo al dashboard con métricas en tiempo real. Puedes filtrar por cohorte, profesor o estado de entrega."

**Visual**: 
- Navegación fluida por el dashboard
- Demostrar filtros en acción
- Mostrar gráficos de progreso
- Transición a vista de estudiantes

**Narración**: 
> "Identifica rápidamente estudiantes en riesgo con nuestro sistema de alertas inteligentes."

**Visual**: 
- Lista de estudiantes con códigos de color
- Destacar estudiantes en riesgo (rojo/amarillo)
- Mostrar métricas individuales

---

### [0:45 - 1:15] Casos de Uso Específicos

**Narración**: 
> "Los profesores pueden ver el progreso de sus cursos específicos y identificar qué estudiantes necesitan atención."

**Visual**: 
- Vista de profesores
- Seleccionar un profesor específico
- Mostrar métricas del profesor
- Vista de estudiantes por curso

**Narración**: 
> "El seguimiento de entregas es súper claro: Entregado, Atrasado, Faltante o Reentrega. Todo con un solo vistazo."

**Visual**: 
- Vista de entregas con filtros
- Mostrar diferentes estados con colores
- Demostrar filtros por estado
- Mostrar resumen de métricas

---

### [1:15 - 1:45] Beneficios y Impacto

**Narración**: 
> "ClassTrack no solo muestra datos, sino que te ayuda a tomar decisiones inteligentes. Reduce el tiempo de seguimiento en un 70% y mejora la comunicación entre coordinadores y profesores."

**Visual**: 
- Gráficos de impacto
- Comparación antes/después
- Métricas de eficiencia
- Testimonios o casos de éxito

**Narración**: 
> "Conecta directamente con Google Classroom usando solo permisos de lectura. Tu información está segura y siempre actualizada."

**Visual**: 
- Mostrar proceso de autenticación
- Destacar seguridad y permisos
- Sincronización en tiempo real

---

### [1:45 - 2:00] Cierre y Call to Action

**Narración**: 
> "ClassTrack: Seguimiento claro, decisiones inteligentes. Desarrollado para la Nerdearla Vibeathon."

**Visual**: 
- Logo final con tagline
- Información de contacto
- QR code para demo en vivo
- Créditos del equipo

---

## 🎥 Especificaciones Técnicas

### Resolución y Formato
- **Resolución**: 1920x1080 (Full HD)
- **Formato**: MP4
- **Frame Rate**: 30 fps
- **Duración**: 1:30 - 2:00 minutos

### Audio
- **Calidad**: 48kHz, 16-bit
- **Formato**: AAC
- **Volumen**: -12dB promedio
- **Narración**: Voz clara y profesional

### Transiciones
- **Duración**: 0.5-1 segundo entre secciones
- **Estilo**: Fade suave o slide horizontal
- **Efectos**: Mínimos, profesionales

---

## 🎨 Elementos Visuales

### Paleta de Colores
- **Primario**: Azul corporativo (#0ea5e9)
- **Secundario**: Grises profesionales
- **Éxito**: Verde (#22c55e)
- **Advertencia**: Amarillo (#f59e0b)
- **Error**: Rojo (#ef4444)

### Tipografía
- **Títulos**: Inter Bold, 24-32px
- **Subtítulos**: Inter Semibold, 18-24px
- **Cuerpo**: Inter Regular, 14-16px
- **Métricas**: Inter Bold, 36-48px

### Iconografía
- **Estilo**: Lucide React (consistente)
- **Tamaño**: 20-24px para navegación
- **Colores**: Siguen la paleta definida

---

## 📱 Secuencia de Pantallas

### 1. Pantalla de Inicio (0:00-0:05)
```
┌─────────────────────────────────────┐
│           ClassTrack Logo           │
│        "Seguimiento claro,          │
│       decisiones inteligentes"       │
│                                     │
│    [Animación de entrada]           │
└─────────────────────────────────────┘
```

### 2. Dashboard Principal (0:05-0:20)
```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Dashboard                                                │
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│ │  1,247  │ │   45   │ │  87.3%  │ │   23    │            │
│ │Estudiant│ │ Cursos │ │Completit│ │En Riesgo│            │
│ │   es    │ │        │ │   ud    │ │         │            │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘            │
│                                                             │
│ [Gráfico de progreso general]                              │
│ [Gráfico de estados de entrega]                             │
└─────────────────────────────────────────────────────────────┘
```

### 3. Vista de Estudiantes (0:20-0:35)
```
┌─────────────────────────────────────────────────────────────┐
│ 👥 Estudiantes                    [Filtros activos]         │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Nombre        │ Cohorte │ Progreso │ Estado │ Acciones │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Juan Pérez    │ 2024-1  │ ████░░ 80% │ ✅    │ [Ver]   │ │
│ │ María García  │ 2024-1  │ ███░░░ 60% │ ⚠️    │ [Ver]   │ │
│ │ Carlos López  │ 2024-2  │ ██████ 95% │ ✅    │ [Ver]   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 4. Vista de Profesores (0:35-0:50)
```
┌─────────────────────────────────────────────────────────────┐
│ 👨‍🏫 Profesores                      [Dr. Ana Silva seleccionado] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📸 [Foto] Dr. Ana Silva                                 │ │
│ │           Profesora de React Avanzado                   │ │
│ │           📧 ana.silva@semillero.com                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │     1       │ │     25      │ │     12      │ │  85.2%  │ │
│ │   Curso     │ │ Estudiantes │ │  Tareas     │ │ Promedio│ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 5. Vista de Entregas (0:50-1:05)
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Entregas                        [Filtro: Todos los estados] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Estado │ Estudiante    │ Tarea              │ Fecha │ Calif │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ ✅     │ Juan Pérez    │ Proyecto Final     │ 15/09 │ 9.5   │ │
│ │ ⚠️     │ María García  │ Ejercicios JS      │ 12/09 │ -     │ │
│ │ ❌     │ Carlos López  │ API REST           │ 10/09 │ -     │ │
│ │ 🔄     │ Ana Martínez  │ Reentrega Final    │ 08/09 │ 7.2   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📊 Resumen: ✅ 45 (67%) ⚠️ 12 (18%) ❌ 8 (12%) 🔄 2 (3%) │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 6. Métricas e Impacto (1:05-1:20)
```
┌─────────────────────────────────────────────────────────────┐
│ 📈 Impacto de ClassTrack                                    │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⏱️ Tiempo de seguimiento: -70%                         │ │
│ │ 📞 Comunicación mejorada: +85%                         │ │
│ │ 🎯 Estudiantes en riesgo identificados: +200%           │ │
│ │ 📊 Decisiones basadas en datos: +150%                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Gráfico de tendencias temporales]                         │
└─────────────────────────────────────────────────────────────┘
```

### 7. Seguridad y Conectividad (1:20-1:35)
```
┌─────────────────────────────────────────────────────────────┐
│ 🔐 Seguridad y Conectividad                                │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✅ Solo permisos de lectura                             │ │
│ │ ✅ Autenticación OAuth 2.0 (server-side, backend Flask) │ │
│ │ ✅ Datos encriptados en tránsito                        │ │
│ │ ✅ Sincronización en tiempo real                        │ │
│ │ ✅ Cumplimiento GDPR                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [Animación de conexión segura]                             │
└─────────────────────────────────────────────────────────────┘
```

### 8. Cierre (1:35-1:50)
```
┌─────────────────────────────────────────────────────────────┐
│           ClassTrack                                        │
│        "Seguimiento claro, decisiones inteligentes"         │
│                                                             │
│    Desarrollado para Nerdearla Vibeathon                    │
│                                                             │
│    [QR Code para demo en vivo]                             │
│    [Información de contacto]                               │
│                                                             │
│    [Créditos del equipo]                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Puntos Clave a Destacar

### Problema Resuelto
- Seguimiento manual ineficiente
- Falta de visibilidad del progreso
- Comunicación fragmentada
- Decisiones sin datos

### Solución Propuesta
- Dashboard centralizado
- Métricas en tiempo real
- Alertas inteligentes
- Filtros avanzados

### Beneficios Cuantificables
- 70% reducción en tiempo de seguimiento
- 85% mejora en comunicación
- 200% más estudiantes en riesgo identificados
- 150% más decisiones basadas en datos

### Diferenciadores
- Conexión directa con Google Classroom
- Solo permisos de lectura (seguro)
- Interfaz intuitiva y profesional
- Escalable para múltiples cohortes

---

## 🎬 Checklist de Producción

### Pre-producción
- [ ] Script finalizado y aprobado
- [ ] Datos mock preparados
- [ ] Pantallas diseñadas y funcionales
- [ ] Narración grabada y editada
- [ ] Música de fondo seleccionada

### Producción
- [ ] Grabación de pantalla en HD
- [ ] Sincronización de audio
- [ ] Transiciones suaves
- [ ] Efectos visuales mínimos
- [ ] Duración dentro del rango objetivo

### Post-producción
- [ ] Edición de video completa
- [ ] Optimización de audio
- [ ] Compresión para web
- [ ] Versiones en diferentes formatos
- [ ] Subtítulos opcionales

### Entrega
- [ ] Video final en MP4
- [ ] Versión optimizada para web
- [ ] Thumbnail atractivo
- [ ] Descripción del video
- [ ] Tags relevantes



