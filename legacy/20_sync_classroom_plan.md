# Prompt 20 — Plan de Sincronización con Google Classroom — Roadmap (Opcional)

Nota: Bajo Opción A, el backend Flask proxyea Google Classroom en tiempo real para el usuario autenticado. Este plan de sincronización batch es opcional si se decide persistir datos localmente (p. ej., en Supabase). Ver `ClassTrack/README02.md` (Architecture Option A).

Objetivo: definir estrategia de ingesta/sync de datos desde Classroom: cursos, alumnos, trabajos, entregas.

## Estrategia
- Pull incremental con paginación y `pageToken`.
- Orden: Courses → Teachers/Students → Assignments → Submissions.
- Idempotencia por claves Google (`google_*_id`) con `upsert`.
- Ventana de actualización: últimas N semanas para submissions.

## Consideraciones
- Rate limits: aplicar backoff exponencial (HTTP 429/5xx).
- Retrasos de propagación: reintentos a los 5/15 minutos.
- Ausencia de webhooks → cron/scheduler (Supabase Edge Functions o externo).

## Pseudocódigo
```
for course in listCourses():
  upsertCourse(course)
  for student in listStudents(course): upsertStudent(student)
  for teacher in listTeachers(course): upsertTeacher(teacher)
  for work in listCourseWork(course): upsertAssignment(work)
  for submission in listSubmissions(course, work): upsertSubmission(submission)
```

## Mapping principal
- Course.id → `courses.google_course_id`
- CourseWork.id → `assignments.google_work_id`
- Student.userId → `students.google_student_id`
- Teacher.userId → `teachers.google_teacher_id`

## Aceptación
- Reglas de upsert claras y sin duplicados.
- Plan de paginación y reintentos documentado.
