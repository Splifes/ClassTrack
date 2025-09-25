# Prompt 17 — Setup de Supabase (Proyecto, Auth, Storage) — Roadmap (Opcional)

Nota: Bajo Opción A, el backend Flask proxyea Google Classroom y la app puede funcionar sin DB propia. Este setup de Supabase es opcional para persistencia extendida. Ver `ClassTrack/README02.md` (Architecture Option A).

Objetivo: guía paso a paso para levantar Supabase para ClassTrack.

## Pasos
1) Crear proyecto en https://supabase.com (región cercana a usuarios)
2) Obtener `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Project Settings → API)
3) Guardar en `.env.local` según `00_env_variables.md`
4) Crear esquema base ejecutando SQL de `16_db_schema_supabase.md`
5) Habilitar RLS (ver `18_rls_policies.md`) y crear policies
6) (Opcional) Configurar Storage buckets (e.g., `avatars/`)
7) Revisar autenticación: solo OAuth Google (PKCE desde frontend)

## Autenticación
- Proveedor: Google OAuth (Web)
- Flujo frontend: PKCE → `03_auth_oauth_pkce.md`
- Mapear identidad: email de Google → `users.email`

## Recomendaciones
- Crear roles: `coordinator`, `teacher`, `student`
- Usar `tenant_id` para segmentar datos por institución/cohorte
- Activar logs para auditoría (Auth y SQL)

## Aceptación
- Proyecto Supabase creado y accesible.
- Anon key verificada desde el frontend (SDK conecta).
- SQL aplicado sin errores.
