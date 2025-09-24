# Servicio de Autenticación - AuthService

## Propósito
Maneja la autenticación con Google mediante OAuth 2.0 Authorization Code en el backend Flask. El frontend solo inicia el flujo, consulta el estado de sesión y ejecuta logout. Los tokens de Google nunca se almacenan en el cliente.

## Funcionalidades Principales
- **Inicio de Login**: Redirección a `GET ${VITE_BACKEND_URL}/api/auth/login`
- **Callback (frontend)**: Ruta `/auth/callback` que luego consulta `GET ${VITE_BACKEND_URL}/api/auth/me`
- **Estado de Usuario**: Datos básicos (email) para UI y rol (placeholder)
- **Logout**: `POST ${VITE_BACKEND_URL}/api/auth/logout`
- **Sin manejo de tokens** en el cliente; el backend mantiene sesión segura

## Estructura de la Clase
```typescript
class AuthService {
  private user: User | null
}
```

## Métodos Principales
- `login()`: Abre `GET /api/auth/login` del backend
- `me()`: Consulta `GET /api/auth/me` para estado de sesión
- `logout()`: `POST /api/auth/logout` y limpia estado local
- `isAuthenticated()`: Verifica estado de usuario en memoria

## Configuración OAuth
- Configurado en el backend Flask (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`)
- Frontend solo necesita `VITE_BACKEND_URL`
- Scopes: classroom.courses.readonly, classroom.rosters.readonly, classroom.student-submissions.students.readonly, openid, email, profile

## Roles y Permisos
- **Coordinator**: Acceso completo a todos los datos
- **Teacher**: Solo sus cursos y estudiantes
- **Student**: Solo su propio progreso

## Integración
- Se integra con el store de autenticación (Zustand)
- No maneja tokens de Google en el cliente
- Estado del usuario persistido opcionalmente (sin tokens) según UX

