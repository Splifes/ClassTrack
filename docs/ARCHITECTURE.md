# Arquitectura (Documento, sin código)

Este documento describe la arquitectura de ClassTrack a alto nivel.

## Visión general
- Frontend SPA: React 18 + TypeScript + Vite + Bootstrap 5.
- Estado y datos: React Query (server-state), Zustand (UI/local-state), tipos estrictos.
- Integraciones: Google OAuth 2.0 (Authorization Code server-side) vía backend Flask y Google Classroom API. Opcional: Google Calendar.
- Backend: Flask (Python). Gestiona OAuth, mantiene sesión y actúa como proxy a Google Classroom.

## Diagrama (mermaid)
```mermaid
flowchart LR
  subgraph User[Usuario]
    U1[Alumno]
    U2[Profesor]
    U3[Coordinador]
  end

  subgraph FE[Frontend (React + TS + Bootstrap)]
    R[UI (Pages/Components)]
    Q[React Query]
    Z[Zustand Store]
    SVC[Services (auth, classroom, calendar)]
    TYP[Types / Contracts]
  end

  subgraph BE[Backend (Flask)]
    AUTH[OAuth 2.0 Authorization Code]
    API[REST API / Proxy Classroom]
  end

  GAuth[Google OAuth 2.0]
  GClass[Google Classroom API]
  GCal[Google Calendar API]

  U1 --> R
  U2 --> R
  U3 --> R

  R <---> Z
  R <---> Q
  Q --> SVC
  Z --> TYP
  SVC --> TYP

  R -->|/api/*| BE
  BE --> AUTH
  BE -->|proxy| GClass
  BE -- (opcional) --> GCal
  SVC -- (opcional) --> GCal
```

## Capas
- UI (Pages/Components): composición, accesibilidad, responsive.
- Rutas: `react-router-dom` con guards por rol (opcional).
- Estado local/UI: `Zustand` (filtros, rol, UI), sin lógica de servidor.
- Server state: `React Query` (caching, reintentos, paginación).
- Servicios frontend: `auth` (invoca BE), `classroom` (consume BE), `calendar` (opcional), `attendance` (opcional), `notification` (opcional).
- Tipos/Contratos: en `src/types/` definidos a partir de `docs/API_CONTRACTS.md` y `docs/DATA_MODEL.md`.

## Seguridad y privacidad
- Sin secretos en el frontend ni en el repositorio.
- Frontend: `VITE_BACKEND_URL` en `.env.local` (no commit).
- Backend: `.env` con `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SECRET_KEY`, `BASE_URL`, `FRONTEND_URL`.
- Mínimos scopes necesarios de Google.

## Escalabilidad
- Code-splitting por rutas.
- Hooks de dominio y servicios desacoplados.
- Componentes UI reutilizables.

## Observabilidad (básico)
- Manejo de errores consistente y mensajes visibles para el usuario.
- Logs controlados en desarrollo, silenciosos en producción.
