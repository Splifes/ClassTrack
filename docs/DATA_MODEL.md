# Modelo de Datos (Documento, sin código)

Este documento describe las entidades y relaciones necesarias para el MVP.

## Entidades
- User
  - id, email, role: 'student' | 'teacher' | 'coordinator'
  - displayName

- Course
  - id, name, section, teacherIds: string[]

- Student (perfil)
  - userId, email, fullName, cohort

- Teacher (perfil)
  - userId, email, fullName

- CourseWork (tarea)
  - id, courseId, title, dueDate, dueTime, state

- Submission (entrega)
  - id, courseId, courseWorkId, userId, state, late, assignedGrade, updateTime

## Relaciones
- Course 1—N CourseWork
- Course N—N Student
- Course N—N Teacher
- CourseWork 1—N Submission
- Student 1—N Submission

## Derivaciones y métricas
- Progreso del estudiante: % de CourseWork con Submission en estado TURNED_IN/RETURNED y no late.
- Riesgo: reglas simples en base a atrasos/faltantes.
- Cohorte: tomado de section (o metadata externa si aplica).

## Ejemplos (no JSON ejecutable)
- `Course`: "Intro a JS", section "Cohorte A"
- `Submission`: TURNED_IN y `late=true` ⇒ cuenta como entregado tarde.
