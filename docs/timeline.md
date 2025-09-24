# Cronograma de Trabajo - Nerdearla Vibeathon

## 📅 Información General

- **Evento**: Nerdearla Vibeathon
- **Fechas**: 24 y 25 de septiembre
- **Duración**: 2 días intensivos
- **Objetivo**: Desarrollar MVP completo de ClassTrack
- **Equipo**: 2-4 desarrolladores

---

## 🎯 Objetivos por Día

### Día 1 (24 de septiembre)
- **Objetivo**: Base funcional y autenticación
- **Meta**: App funcionando con datos mock
- **Entregables**: Login, dashboard básico, navegación

### Día 2 (25 de septiembre)
- **Objetivo**: Funcionalidades completas y demo
- **Meta**: App completa con integración real
- **Entregables**: Todas las vistas, filtros, métricas, video demo

---

## 📋 Cronograma Detallado

### Día 1 - Lunes 24 de Septiembre

#### 🌅 Mañana (9:00 - 12:00)

**9:00 - 9:30 | Setup y Planificación**
- [ ] Revisión del cronograma
- [ ] Setup del entorno de desarrollo
- [ ] Configuración de Git y repositorio
- [ ] Instalación de dependencias

**9:30 - 10:30 | Estructura Base**
- [ ] Crear estructura de carpetas
- [ ] Configurar Vite + React + TypeScript
- [ ] Añadir Bootstrap 5 (npm o CDN)
- [ ] Configurar ESLint y Prettier
- [ ] Crear componentes base (Button, Card, Input)

**10:30 - 11:00 | Break**

**11:00 - 12:00 | Backend Setup**
- [ ] Crear backend Flask base
- [ ] Healthcheck `/health`
- [ ] CORS para `http://localhost:5173`

**12:00 - 12:30 | Autenticación (server-side)**
- [ ] Endpoint `GET /api/auth/login`
- [ ] Callback `GET /oauth/callback`
- [ ] `GET /api/auth/me` y `POST /api/auth/logout`
- [ ] Ruta frontend `/auth/callback`

#### 🍽️ Almuerzo (12:00 - 13:00)

#### 🌞 Tarde (13:00 - 18:00)

**13:00 - 14:00 | Estado Global**
- [ ] Configurar Zustand stores
- [ ] Implementar stores básicos
- [ ] Crear hooks personalizados
- [ ] Configurar React Query

**14:00 - 15:00 | Dashboard Base**
- [ ] Crear layout principal
- [ ] Implementar sidebar y header
- [ ] Crear página de dashboard
- [ ] Integrar datos mock

**15:00 - 15:30 | Break**

**15:30 - 16:30 | Componentes UI**
- [ ] Crear MetricCard
- [ ] Implementar DataTable
- [ ] Crear ProgressBar
- [ ] Implementar StatusBadge
- [ ] Crear Avatar

**16:30 - 17:30 | Navegación**
- [ ] Implementar React Router
- [ ] Crear páginas principales
- [ ] Implementar breadcrumbs
- [ ] Crear navegación responsive

**17:30 - 18:00 | Testing y Debug**
- [ ] Probar funcionalidades básicas
- [ ] Corregir errores
- [ ] Optimizar rendimiento
- [ ] Commit y push

#### 🌙 Noche (18:00 - 20:00)

**18:00 - 19:00 | Cena**

**19:00 - 20:00 | Preparación Día 2**
- [ ] Revisar progreso del día
- [ ] Planificar tareas del día siguiente
- [ ] Documentar problemas encontrados
- [ ] Preparar materiales para demo

---

### Día 2 - Martes 25 de Septiembre

#### 🌅 Mañana (9:00 - 12:00)

**9:00 - 9:30 | Revisión y Continuación**
- [ ] Revisar progreso del día anterior
- [ ] Resolver problemas pendientes
- [ ] Actualizar dependencias si es necesario

**9:30 - 10:30 | Google Classroom API**
- [ ] Implementar GoogleClassroomService
- [ ] Crear hooks para API calls
- [ ] Implementar manejo de errores
- [ ] Crear transformadores de datos

**10:30 - 11:00 | Break**

**11:00 - 12:00 | Vista de Estudiantes**
- [ ] Crear página de estudiantes
- [ ] Implementar filtros avanzados
- [ ] Crear vista detallada de estudiante
- [ ] Implementar búsqueda

#### 🍽️ Almuerzo (12:00 - 13:00)

#### 🌞 Tarde (13:00 - 18:00)

**13:00 - 14:00 | Vista de Profesores**
- [ ] Crear página de profesores
- [ ] Implementar métricas por profesor
- [ ] Crear vista detallada de profesor
- [ ] Integrar con datos de cursos

**14:00 - 15:00 | Vista de Entregas**
- [ ] Crear página de entregas
- [ ] Implementar filtros por estado
- [ ] Crear resumen de métricas
- [ ] Implementar exportación de datos

**15:00 - 15:30 | Break**

**15:30 - 16:30 | Gráficos y Visualizaciones**
- [ ] Integrar Recharts
- [ ] Crear gráficos de progreso
- [ ] Implementar gráficos de estados
- [ ] Crear gráficos temporales

**16:30 - 17:30 | Optimizaciones Finales**
- [ ] Optimizar rendimiento
- [ ] Implementar loading states
- [ ] Crear estados de error
- [ ] Mejorar responsive design

**17:30 - 18:00 | Testing Final**
- [ ] Probar todas las funcionalidades
- [ ] Corregir bugs críticos
- [ ] Optimizar para producción
- [ ] Preparar para demo

#### 🌙 Noche (18:00 - 20:00)

**18:00 - 19:00 | Cena**

**19:00 - 20:00 | Demo y Presentación**
- [ ] Grabar video demo
- [ ] Preparar presentación
- [ ] Revisar guion
- [ ] Preparar Q&A

---

## 🚀 Prompts de Desarrollo

### Setup Inicial
```bash
# Crear proyecto
pnpm create vite classtrack-mvp --template react-ts
cd classtrack-mvp

# Instalar dependencias
pnpm install @tanstack/react-query zustand lucide-react recharts clsx bootstrap
pnpm install -D @types/node

# Backend Flask (estructura mínima)
python -m venv .venv && source .venv/bin/activate  # (Windows: .venv\Scripts\activate)
pip install flask flask-cors python-dotenv requests
```

### Estructura de Carpetas
```
src/
├── components/
│   ├── ui/           # Componentes base
│   ├── charts/       # Gráficos
│   └── layout/       # Layout components
├── pages/            # Páginas principales
├── hooks/            # Custom hooks
├── services/         # Servicios de API
├── store/            # Estado global
├── types/            # Tipos TypeScript
├── utils/            # Utilidades
├── constants/        # Constantes
└── data/             # Datos mock
```

### Componentes Base
```tsx
// Button.tsx
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

// Card.tsx
export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// MetricCard.tsx
export interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}
```

### Hooks Personalizados
```tsx
// useClassroom.ts (consumiendo backend)
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get(`${import.meta.env.VITE_BACKEND_URL}/api/courses`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });
};

// useAuth.ts
export const useAuth = () => {
  const { user, isAuthenticated } = useAuthStore();
  return { user, isAuthenticated };
};
```

### Stores Zustand
```tsx
// store/index.ts
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
      }),
      { name: 'auth-storage' }
    )
  )
);
```

---

## 📊 Métricas de Progreso

### Día 1 - Objetivos
- [ ] **Setup completo**: 100%
- [ ] **Autenticación**: 100%
- [ ] **Dashboard base**: 80%
- [ ] **Navegación**: 90%
- [ ] **Componentes UI**: 70%

### Día 2 - Objetivos
- [ ] **API Integration**: 100%
- [ ] **Vistas completas**: 100%
- [ ] **Filtros avanzados**: 100%
- [ ] **Gráficos**: 90%
- [ ] **Demo video**: 100%

---

## 🎯 Criterios de Éxito

### Funcionalidades Mínimas Viables
- [ ] Autenticación con Google
- [ ] Dashboard con métricas básicas
- [ ] Vista de estudiantes con filtros
- [ ] Vista de profesores
- [ ] Vista de entregas por estado
- [ ] Gráficos de progreso
- [ ] Responsive design

### Calidad de Código
- [ ] TypeScript sin errores
- [ ] Componentes reutilizables
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Optimización de rendimiento

### Experiencia de Usuario
- [ ] Navegación intuitiva
- [ ] Feedback visual claro
- [ ] Estados de carga
- [ ] Mensajes de error útiles
- [ ] Diseño responsive

---

## 🚨 Plan de Contingencias

### Problemas Técnicos
- **API de Google no disponible**: Usar datos mock completos
- **Problemas de autenticación**: Implementar modo demo
- **Errores de compilación**: Revertir a versión estable
- **Problemas de rendimiento**: Optimizar queries y componentes

### Problemas de Tiempo
- **Retraso en funcionalidades**: Priorizar MVP core
- **Problemas de integración**: Usar datos mock
- **Bugs críticos**: Implementar workarounds
- **Demo no lista**: Usar screenshots y prototipos

### Recursos Adicionales
- **Documentación**: README completo
- **Videos**: Tutoriales de setup
- **Comunidad**: Discord de Nerdearla
- **Mentores**: Disponibles durante el evento

---

## 📝 Checklist Final

### Pre-Vibeathon
- [ ] Repositorio configurado
- [ ] Documentación completa
- [ ] Datos mock preparados
- [ ] Guion de demo listo
- [ ] Equipo coordinado

### Durante Vibeathon
- [ ] Commits regulares
- [ ] Testing continuo
- [ ] Documentación actualizada
- [ ] Demo funcionando
- [ ] Presentación preparada

### Post-Vibeathon
- [ ] Código limpio y documentado
- [ ] README actualizado
- [ ] Demo video publicado
- [ ] Feedback recopilado
- [ ] Próximos pasos definidos

---

## 🎬 Preparación para Demo

### Materiales Necesarios
- [ ] Laptop con setup completo
- [ ] Conexión a internet estable
- [ ] Cuenta de Google para testing
- [ ] Datos de prueba preparados
- [ ] Presentación en PowerPoint/Keynote

### Plan de Demo
1. **Introducción** (2 min): Problema y solución
2. **Funcionalidades** (5 min): Recorrido por la app
3. **Tecnologías** (2 min): Stack y arquitectura
4. **Q&A** (3 min): Preguntas del jurado

### Puntos Clave a Destacar
- Conexión directa con Google Classroom
- Solo permisos de lectura (seguro)
- Interfaz intuitiva y profesional
- Escalable para múltiples cohortes
- Desarrollado en 2 días

---

## 📞 Contacto y Soporte

### Durante el Evento
- **Discord**: Canal #classtrack-mvp
- **Slack**: Equipo de desarrollo
- **Email**: classtrack@nerdearla.com

### Recursos Adicionales
- **Documentación**: `/docs/` en el repositorio
- **Video Tutorial**: Setup en 10 minutos
- **Comunidad**: Nerdearla Discord
- **Mentores**: Disponibles 24/7 durante el evento



