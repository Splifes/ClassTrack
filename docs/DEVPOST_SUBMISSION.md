# Plantilla de Submission en Devpost

Completar y pegar en la página de Devpost al momento de enviar.

## Nombre del proyecto
ClassTrack — Seguimiento y métricas para Google Classroom

## Descripción (qué problema resuelve)
- Seguimiento unificado del progreso por alumno, curso y profesor.
- Comunicación más clara (notificaciones opcionales).
- Métricas accesibles para coordinadores (asistencia, participación, entregas).

## Cómo lo construimos
- Frontend: React 18 + TypeScript + Vite + Bootstrap 5.
- Estado: React Query (server-state) + Zustand (UI/local-state).
- Integración: Google OAuth 2.0 (Authorization Code server-side en backend Flask), Google Classroom API a través de proxy backend. (Opcional: Calendar).

## Principales funcionalidades
- Login con Google (server-side) y detección de email del usuario.
- Dashboard con métricas básicas.
- Vistas: Students (progreso y estado de entregas) y Courses (clases y profesores).
- Filtros por cohorte, profesor y estado de entrega.
- (Opcional) Notificaciones, asistencia, reportes.

## Cómo ejecutarlo (local)
1) Requisitos: Node 18+, pnpm 8+
2) Backend: Python 3.10+, crear `.env` según `prompts/27_backend_env_template.md` y ejecutar `flask run -p 5001`
3) Frontend: `pnpm install`
4) Crear `.env.local` con:
```
VITE_BACKEND_URL=http://localhost:5001
```
5) `pnpm dev` y abrir `http://localhost:5173`

## Cómo probarlo
- Click en “Login con Google”, se redirige al backend → Google → backend `/oauth/callback` → frontend `/auth/callback`.
- Explorar Dashboard, Students y Courses.
- Probar filtros y ver estados de loading/error.

## Video demo (1–2 min)
- Link a YouTube: <URL>
- Guion: login → dashboard → students (filtros/entregas) → courses → (opcional) extra.

## Desafíos que enfrentamos
- Integración OAuth server-side y manejo de sesión segura.
- Normalización de datos de Classroom y paginaciones.

## Qué aprendimos
- Diseño SOLID en frontend con capas y tipos estrictos.
- Optimización de DX con prompts y fases de trabajo.

## Qué sigue
- Persistencia opcional (DB), webhooks/notificaciones.
- Notificaciones/Asistencia persistentes y reportes avanzados.

## Repositorio
- URL del repo público: <URL>

## Deploy (opcional)
- URL del deploy: <URL>
