# Prompt 18 — RLS y Policies (Supabase) — Roadmap (Opcional)

Nota: Bajo Opción A, el backend Flask proxyea Google Classroom y la app puede funcionar sin DB propia. Estas policies aplican solo si se adopta Supabase para persistencia. Ver `ClassTrack/README02.md` (Architecture Option A).

Objetivo: habilitar Row Level Security y definir policies por tabla basadas en `tenant_id` y rol.

## Principios
- RLS ON en todas las tablas de datos.
- Filtrado mínimo: `tenant_id = auth.jwt() -> tenant_id` (o mapeo por email si aplica).
- Autorización por rol: `coordinator` amplio, `teacher` sobre cursos propios, `student` sobre sus datos.

## Activar RLS
```sql
alter table public.users enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_members enable row level security;
alter table public.notifications enable row level security;
alter table public.user_roles enable row level security;
```

## Helpers sugeridos
```sql
-- Asumimos que el JWT incluye `role` y `tenant_id` en `app_metadata` o `user_metadata`.
create or replace function auth_role() returns text
language sql stable as $$ select coalesce(current_setting('request.jwt.claims', true)::jsonb->>'role','student') $$;

create or replace function auth_tenant() returns uuid
language sql stable as $$ select (current_setting('request.jwt.claims', true)::jsonb->>'tenant_id')::uuid $$;
```

## Policies genéricas por tenant
```sql
-- Lectura por tenant
create policy sel_by_tenant on public.courses for select
using (tenant_id = auth_tenant());

-- Escritura restringida por rol
create policy ins_coordinator on public.courses for insert
with check (tenant_id = auth_tenant() and auth_role() = 'coordinator');

create policy upd_coordinator on public.courses for update
using (tenant_id = auth_tenant() and auth_role() = 'coordinator')
with check (tenant_id = auth_tenant() and auth_role() = 'coordinator');

create policy del_coordinator on public.courses for delete
using (tenant_id = auth_tenant() and auth_role() = 'coordinator');
```

## Policies específicas
```sql
-- Students pueden leer sus propias inscripciones y entregas
create policy sel_my_enrollments on public.enrollments for select
using (tenant_id = auth_tenant());

create policy sel_my_submissions on public.submissions for select
using (tenant_id = auth_tenant());

-- Teachers pueden leer cursos que poseen
create policy sel_teacher_courses on public.courses for select
using (tenant_id = auth_tenant());
```

Nota: Ajustar a las necesidades exactas una vez definido el JWT y el mapeo de usuarios/roles.

## Aceptación
- RLS activado en todas las tablas.
- Policies compilan y permiten casos de uso del dashboard sin escalamiento de privilegios.
