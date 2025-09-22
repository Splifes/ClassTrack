# Servicio de Autenticación - AuthService

## Propósito
Maneja la autenticación OAuth 2.0 PKCE con Google para acceder a la API de Google Classroom.

## Funcionalidades Principales
- **OAuth 2.0 PKCE**: Flujo de autenticación seguro con Google
- **Gestión de Tokens**: Access token y refresh token
- **Información de Usuario**: Perfil y permisos basados en rol
- **Persistencia**: Almacenamiento en localStorage
- **Renovación Automática**: Refresh de tokens expirados

## Estructura de la Clase
```typescript
class AuthService {
  private accessToken: string | null
  private refreshToken: string | null
  private user: User | null
}
```

## Métodos Principales
- `initiateAuth()`: Inicia el flujo OAuth
- `handleCallback(code)`: Procesa el callback de Google
- `refreshAccessToken()`: Renueva tokens expirados
- `isAuthenticated()`: Verifica estado de autenticación
- `logout()`: Cierra sesión y limpia datos

## Configuración OAuth
- **Client ID**: Variable de entorno `VITE_GOOGLE_CLIENT_ID`
- **Redirect URI**: `VITE_GOOGLE_REDIRECT_URI`
- **Scopes**: classroom.courses.readonly, classroom.rosters.readonly, etc.

## Roles y Permisos
- **Coordinator**: Acceso completo a todos los datos
- **Teacher**: Solo sus cursos y estudiantes
- **Student**: Solo su propio progreso

## Integración
- Se integra con el store de autenticación (Zustand)
- Maneja tokens para Google Classroom API
- Persiste estado en localStorage

