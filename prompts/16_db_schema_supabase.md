# Prompt 16 — Esquema de Base de Datos (Supabase/PostgreSQL) — Roadmap (Opcional)

Nota: Bajo Opción A la app funciona con backend Flask proxy de Google Classroom sin DB propia. Este prompt define una persistencia opcional para métricas/estado extendido. Ver `ClassTrack/README02.md` (Architecture Option A).

Objetivo: definir el modelo de datos inicial para ClassTrack en Supabase (PostgreSQL) listo para migraciones y RLS.

## Lineamientos
- Normalizar entidades principales y relaciones N:M.
- Incluir claves primarias (uuid por defecto), foráneas con ON DELETE/UPDATE, índices y restricciones únicas.
- Preparado para RLS (filtrado por `tenant_id` y propietario cuando aplique).
- Auditar columnas: `created_at`, `updated_at` (trigger o default), `created_by` cuando aplique.

## Entidades principales
- Users (cuentas del sistema, identidad Google)
- Teachers (perfil docente)
- Students (perfil alumno)
- Courses (curso desde Classroom)
- Enrollments (inscripción alumno-curso) [N:M]
- Assignments (tareas/works del curso)
- Submissions (entregas por alumno)
- Cohorts (agrupación de alumnos)
- CohortMembers (alumno-cohorte) [N:M]
- Notifications (alertas en app)
- Roles (role-based access por usuario)

## Tablas y columnas (borrador SQL)

```sql
-- Extension requerida
create extension if not exists "uuid-ossp";

-- Users
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  email text not null unique,
  display_name text,
  avatar_url text,
  google_user_id text unique,
  role text not null default 'student', -- coordinator | teacher | student
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_users_tenant on public.users(tenant_id);

-- Teachers
create table if not exists public.teachers (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  google_teacher_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_teachers_tenant on public.teachers(tenant_id);
create unique index if not exists uq_teachers_user on public.teachers(user_id);

-- Students
create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  user_id uuid references public.users(id) on delete set null,
  google_student_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_students_tenant on public.students(tenant_id);

-- Courses
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  google_course_id text not null,
  name text not null,
  section text,
  description text,
  owner_teacher_id uuid references public.teachers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, google_course_id)
);
create index if not exists idx_courses_tenant on public.courses(tenant_id);

-- Enrollments (Student-Course)
create table if not exists public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active', -- active | dropped
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, course_id)
);
create index if not exists idx_enrollments_tenant on public.enrollments(tenant_id);
create index if not exists idx_enrollments_course on public.enrollments(course_id);

-- Assignments (Course work)
create table if not exists public.assignments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  course_id uuid not null references public.courses(id) on delete cascade,
  google_work_id text,
  title text not null,
  due_date timestamptz,
  max_points numeric(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, course_id, google_work_id)
);
create index if not exists idx_assignments_tenant on public.assignments(tenant_id);
create index if not exists idx_assignments_course on public.assignments(course_id);

-- Submissions
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  state text not null, -- new | created | turned_in | returned | late
  score numeric(10,2),
  late boolean default false,
  turned_in_at timestamptz,
  updated_from_api_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);
create index if not exists idx_submissions_tenant on public.submissions(tenant_id);
create index if not exists idx_submissions_assignment on public.submissions(assignment_id);
create index if not exists idx_submissions_student on public.submissions(student_id);

-- Cohorts
create table if not exists public.cohorts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, name)
);
create index if not exists idx_cohorts_tenant on public.cohorts(tenant_id);

-- Cohort Members (Student-Cohort)
create table if not exists public.cohort_members (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cohort_id, student_id)
);
create index if not exists idx_cohort_members_tenant on public.cohort_members(tenant_id);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  user_id uuid references public.users(id) on delete set null,
  type text not null, -- late_submission | missing_work | low_grade
  payload jsonb not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_tenant on public.notifications(tenant_id);
create index if not exists idx_notifications_user on public.notifications(user_id);

-- Roles (optional override por proyecto)
create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id, role)
);
create index if not exists idx_user_roles_tenant on public.user_roles(tenant_id);
```

## Índices sugeridos adicionales
- `submissions(tenant_id, assignment_id, student_id)` compuesto para queries de tablero.
- `assignments(tenant_id, due_date)` para listados por vencimiento.

## Consideraciones RLS (ver Prompt 18)
- Filtro por `tenant_id` en todas las tablas.
- Lectura/escritura restringida por rol y propiedad.

## Aceptación
- Esquema SQL compila en Supabase.
- Relaciones, constraints y unique keys probadas con datos de ejemplo.
- Listado de índices y claves cubre consultas del dashboard.
