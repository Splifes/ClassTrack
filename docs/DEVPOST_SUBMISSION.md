# Plantilla de Submission en Devpost

Completar y pegar en la página de Devpost al momento de enviar.

## Nombre del proyecto
ClassTrack — Seguimiento y métricas para Google Classroom

## Descripción (qué problema resuelve)
- Seguimiento unificado del progreso por alumno, curso y profesor.
- Comunicación más clara (notificaciones opcionales).
- Métricas accesibles para coordinadores (asistencia, participación, entregas).

## Cómo lo construimos
- Frontend: React 18 + TypeScript + Vite + Tailwind.
- Estado: React Query (server-state) + Zustand (UI/local-state).
- Integración: Google OAuth 2.0 (PKCE), Google Classroom API. (Opcional: Calendar).

## Principales funcionalidades
- Login con Google (PKCE) y detección de email del usuario.
- Dashboard con métricas básicas.
- Vistas: Students (progreso y estado de entregas) y Courses (clases y profesores).
- Filtros por cohorte, profesor y estado de entrega.
- (Opcional) Notificaciones, asistencia, reportes.

## Cómo ejecutarlo (local)
1) Requisitos: Node 18+, pnpm 8+
2) `pnpm install`
3) Crear `.env.local` con:
```
VITE_GOOGLE_CLIENT_ID=...
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=
VITE_GOOGLE_CLASSROOM_API_URL=https://classroom.googleapis.com
```
4) `pnpm dev` y abrir `http://localhost:5173`

## Cómo probarlo
- Click en “Login con Google”, autorizar y volver a la app.
- Explorar Dashboard, Students y Courses.
- Probar filtros y ver estados de loading/error.

## Video demo (1–2 min)
- Link a YouTube: <URL>
- Guion: login → dashboard → students (filtros/entregas) → courses → (opcional) extra.

## Desafíos que enfrentamos
- Integración con OAuth PKCE sin backend.
- Normalización de datos de Classroom y paginaciones.

## Qué aprendimos
- Diseño SOLID en frontend con capas y tipos estrictos.
- Optimización de DX con prompts y fases de trabajo.

## Qué sigue
- Backend proxy para tokens y webhooks.
- Notificaciones/Asistencia persistentes y reportes avanzados.

## Repositorio
- URL del repo público: <URL>

## Deploy (opcional)
- URL del deploy: <URL>
