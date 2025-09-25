# Google OAuth Setup Guide

Para que ClassTrack funcione completamente, necesitas configurar OAuth con Google Cloud Console.

## Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el Project ID

## Paso 2: Habilitar APIs

1. Ve a **APIs & Services** → **Library**
2. Busca y habilita estas APIs:
   - **Google Classroom API** ⚠️ **CRÍTICO**
   - **Google People API** (para perfiles de usuario)

## Paso 3: Configurar OAuth Consent Screen

1. Ve a **APIs & Services** → **OAuth consent screen**
2. Selecciona **"External"** (a menos que tengas Google Workspace)
3. Completa la información de la app:
   - **App name**: `ClassTrack`
   - **User support email**: Tu email
   - **Developer contact**: Tu email

4. **Agregar Scopes** (Click "Add or Remove Scopes"):
   ```
   https://www.googleapis.com/auth/classroom.courses.readonly
   https://www.googleapis.com/auth/classroom.rosters.readonly
   https://www.googleapis.com/auth/classroom.student-submissions.students.readonly
   https://www.googleapis.com/auth/userinfo.email
   https://www.googleapis.com/auth/userinfo.profile
   openid
   ```

5. **Agregar Test Users** (para desarrollo):
   - Agrega tu email y cualquier otro usuario que necesite acceso durante desarrollo

## Paso 4: Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth 2.0 Client IDs"**
3. Selecciona **"Web application"**
4. **Name**: `ClassTrack`
5. **Authorized redirect URIs** - Agrega EXACTAMENTE:
   ```
   http://localhost:5001/oauth/callback
   http://127.0.0.1:5001/oauth/callback
   ```
6. Click **"Create"**
7. **IMPORTANTE**: Copia el **Client ID** y **Client Secret**

## Paso 5: Configurar Variables de Entorno

1. Abre `backend/.env`
2. Reemplaza estos valores:
   ```env
   GOOGLE_CLIENT_ID=tu-client-id-aqui.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=tu-client-secret-aqui
   ```

## Paso 6: Probar la Configuración

1. Asegúrate que ambos servidores estén corriendo:
   ```bash
   # Terminal 1 - Backend
   cd backend
   .venv\Scripts\python.exe app.py

   # Terminal 2 - Frontend  
   cd frontend
   pnpm dev
   ```

2. Ve a http://localhost:5173
3. Click "Login with Google"
4. Deberías ser redirigido a Google para autorizar la app
5. Después de autorizar, deberías volver a la app autenticado

## Problemas Comunes

### Error 403: access_denied
- **Causa**: OAuth consent screen no configurado o usuario no agregado como test user
- **Solución**: Completa el Paso 3 y agrega tu email como test user

### Error: redirect_uri_mismatch
- **Causa**: La URI de redirección no coincide exactamente
- **Solución**: Verifica que `http://localhost:5001/oauth/callback` esté agregada EXACTAMENTE en Google Cloud Console

### Error: API not enabled
- **Causa**: Google Classroom API no habilitada
- **Solución**: Habilita la API en el Paso 2

## URLs de Referencia

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Classroom API Documentation](https://developers.google.com/classroom)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)

## Notas de Seguridad

- Nunca commits el archivo `.env` con credenciales reales
- En producción, usa dominios HTTPS para las redirect URIs
- Rota las credenciales regularmente
- Usa scopes mínimos necesarios
