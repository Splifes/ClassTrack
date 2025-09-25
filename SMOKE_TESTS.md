# ClassTrack - Smoke Tests Manual

## Pre-requisitos
- Backend corriendo en `http://localhost:5001`
- Frontend corriendo en `http://localhost:5173`
- Variables de entorno configuradas (ver `OAUTH_SETUP.md`)

## Tests de Funcionalidad Básica

### 1. ✅ Arranque de Aplicación
- [ ] App carga en `http://localhost:5173` sin errores en consola
- [ ] Página de login se muestra correctamente
- [ ] No hay errores de TypeScript: `pnpm type-check`
- [ ] Build funciona: `pnpm build`

### 2. ✅ Navegación
- [ ] Navegación funciona entre rutas principales
- [ ] Navbar responsive funciona en mobile
- [ ] Links activos se destacan correctamente
- [ ] Breadcrumbs o navegación contextual visible

### 3. ✅ Autenticación OAuth
- [ ] Botón "Login with Google" redirige a Google OAuth
- [ ] Callback de Google funciona: `/oauth/callback` → `/auth/callback`
- [ ] Usuario autenticado ve su nombre y foto en navbar
- [ ] Logout funciona correctamente
- [ ] Estados de loading durante autenticación

### 4. ✅ Datos de Google Classroom
- [ ] Lista de cursos carga correctamente
- [ ] Lista de estudiantes carga por curso
- [ ] Detalles de curso muestran información completa
- [ ] Estados de loading visibles durante carga
- [ ] Manejo de errores visible si falla API

### 5. ✅ Sistema de Roles
- [ ] Student ve dashboard de estudiante
- [ ] Teacher ve dashboard de profesor con métricas
- [ ] Coordinator ve dashboard completo con reportes
- [ ] Navegación condicional por rol funciona
- [ ] RoleGuard bloquea rutas no autorizadas

### 6. ✅ Filtros y Búsqueda
- [ ] SearchBox funciona con debounce
- [ ] MultiSelect permite selección múltiple
- [ ] Filtros se aplican en tiempo real
- [ ] Botón "Clear Filters" funciona
- [ ] Contador de resultados actualiza

### 7. ✅ Notificaciones
- [ ] NotificationBell muestra contador
- [ ] Dropdown de notificaciones funciona
- [ ] Notificaciones se marcan como leídas
- [ ] Triggers automáticos funcionan tras login

### 8. ✅ Reportes y Gráficos
- [ ] Página de Reports carga (solo Coordinator)
- [ ] Gráficos de Recharts renderizan correctamente
- [ ] Tabs de reportes funcionan
- [ ] Exportación CSV descarga archivo
- [ ] Datos de métricas son precisos

### 9. ✅ UI/UX y Accesibilidad
- [ ] Botones muestran estado loading cuando corresponde
- [ ] Focus visible en elementos interactivos
- [ ] Labels asociados a inputs correctamente
- [ ] Navegación por teclado funciona
- [ ] Colores y contraste adecuados
- [ ] Responsive design en mobile

### 10. ✅ Performance
- [ ] Carga inicial < 3 segundos
- [ ] Navegación entre páginas fluida
- [ ] No memory leaks evidentes
- [ ] Imágenes optimizadas
- [ ] Bundle size razonable

## Checklist de Deploy

### Frontend
- [ ] Build sin errores: `pnpm build`
- [ ] Preview funciona: `pnpm preview`
- [ ] Variables de entorno configuradas para producción
- [ ] Netlify/Vercel config presente

### Backend
- [ ] Servidor Flask arranca sin errores
- [ ] Healthcheck responde: `GET /health`
- [ ] OAuth configurado con URLs de producción
- [ ] Variables de entorno de producción configuradas

## Issues Conocidos

### TypeScript Errors
- Algunos imports de rutas fallan (archivos existen pero TS no los encuentra)
- Tipos de Recharts requieren index signatures
- **Status**: En progreso - no bloquea funcionalidad

### OAuth Setup
- Requiere configuración manual de Google Cloud Console
- URLs de redirect deben coincidir exactamente
- **Status**: Documentado en `OAUTH_SETUP.md`

## Comandos de Verificación

```bash
# Frontend
cd frontend
pnpm type-check
pnpm build
pnpm preview

# Backend
cd backend
.venv\Scripts\python.exe app.py

# Health checks
curl http://localhost:5001/health
curl http://localhost:5173
```

## Criterios de Éxito
- ✅ Sin errores críticos en consola
- ✅ Flujo de autenticación completo
- ✅ Datos de Classroom cargan correctamente  
- ✅ Navegación y filtros funcionales
- ✅ Estados de loading/error visibles
- ✅ Accesibilidad básica implementada
