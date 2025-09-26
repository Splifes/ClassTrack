# Google Classroom - Análisis Completo de Datos Disponibles

## 🎯 Datos Principales Disponibles

### **1. Courses (Cursos)**
```json
{
  "id": "course_id",
  "name": "Nombre del curso",
  "section": "Sección",
  "description": "Descripción",
  "room": "Aula",
  "ownerId": "teacher_id",
  "creationTime": "2024-01-15T10:00:00Z",
  "updateTime": "2024-01-20T15:30:00Z",
  "enrollmentCode": "abc123",
  "courseState": "ACTIVE|ARCHIVED|PROVISIONED|DECLINED|SUSPENDED",
  "alternateLink": "https://classroom.google.com/c/...",
  "teacherGroupEmail": "course_teachers@domain.com",
  "courseGroupEmail": "course_all@domain.com",
  "guardiansEnabled": true,
  "calendarId": "calendar_id"
}
```

### **2. CourseWork (Tareas/Assignments)**
```json
{
  "courseId": "course_id",
  "id": "coursework_id",
  "title": "Título de la tarea",
  "description": "Descripción detallada",
  "materials": [
    {
      "driveFile": { "id": "file_id", "title": "documento.pdf" },
      "youtubeVideo": { "id": "video_id", "title": "Video tutorial" },
      "link": { "url": "https://example.com", "title": "Enlace externo" },
      "form": { "formUrl": "https://forms.google.com/...", "title": "Formulario" }
    }
  ],
  "state": "PUBLISHED|DRAFT|DELETED",
  "alternateLink": "https://classroom.google.com/...",
  "creationTime": "2024-01-15T10:00:00Z",
  "updateTime": "2024-01-20T15:30:00Z",
  "dueDate": { "year": 2024, "month": 2, "day": 15 },
  "dueTime": { "hours": 23, "minutes": 59 },
  "maxPoints": 100,
  "workType": "ASSIGNMENT|SHORT_ANSWER_QUESTION|MULTIPLE_CHOICE_QUESTION",
  "submissionModificationMode": "MODIFIABLE_UNTIL_TURNED_IN|MODIFIABLE",
  "assigneeMode": "ALL_STUDENTS|INDIVIDUAL_STUDENTS",
  "individualStudentsOptions": { "studentIds": ["student1", "student2"] },
  "scheduledTime": "2024-01-15T08:00:00Z",
  "topicId": "topic_id"
}
```

### **3. StudentSubmissions (Entregas)**
```json
{
  "courseId": "course_id",
  "courseWorkId": "coursework_id",
  "id": "submission_id",
  "userId": "student_id",
  "creationTime": "2024-01-15T10:00:00Z",
  "updateTime": "2024-01-16T14:30:00Z",
  "state": "NEW|CREATED|TURNED_IN|RETURNED|RECLAIMED_BY_STUDENT",
  "late": false,
  "draftGrade": 85,
  "assignedGrade": 90,
  "alternateLink": "https://classroom.google.com/...",
  "courseWorkType": "ASSIGNMENT",
  "associatedWithDeveloper": false,
  "submissionHistory": [
    {
      "stateHistory": {
        "state": "TURNED_IN",
        "stateTimestamp": "2024-01-16T14:30:00Z",
        "actorUserId": "student_id"
      },
      "gradeHistory": {
        "pointsEarned": 90,
        "maxPoints": 100,
        "gradeTimestamp": "2024-01-17T10:00:00Z",
        "actorUserId": "teacher_id"
      }
    }
  ],
  "attachments": [
    {
      "driveFile": { "id": "file_id", "title": "tarea_completada.docx" }
    }
  ]
}
```

### **4. Students & Teachers (Usuarios)**
```json
{
  "courseId": "course_id",
  "userId": "user_id",
  "profile": {
    "id": "profile_id",
    "name": {
      "givenName": "Juan",
      "familyName": "Pérez",
      "fullName": "Juan Pérez"
    },
    "emailAddress": "juan.perez@example.com",
    "photoUrl": "https://lh3.googleusercontent.com/...",
    "permissions": [
      { "permission": "CREATE_COURSE" }
    ],
    "verifiedTeacher": true
  }
}
```

### **5. Announcements (Anuncios)**
```json
{
  "courseId": "course_id",
  "id": "announcement_id",
  "text": "Texto del anuncio",
  "materials": [...],
  "state": "PUBLISHED|DRAFT|DELETED",
  "alternateLink": "https://classroom.google.com/...",
  "creationTime": "2024-01-15T10:00:00Z",
  "updateTime": "2024-01-15T10:30:00Z",
  "scheduledTime": "2024-01-15T08:00:00Z",
  "assigneeMode": "ALL_STUDENTS|INDIVIDUAL_STUDENTS",
  "individualStudentsOptions": { "studentIds": ["student1"] }
}
```

### **6. Topics (Temas/Categorías)**
```json
{
  "courseId": "course_id",
  "topicId": "topic_id",
  "name": "Unidad 1: Introducción",
  "updateTime": "2024-01-15T10:00:00Z"
}
```

### **7. Guardians (Tutores/Padres)**
```json
{
  "studentId": "student_id",
  "guardianId": "guardian_id",
  "guardianProfile": {
    "id": "guardian_profile_id",
    "name": { "givenName": "María", "familyName": "Pérez" },
    "emailAddress": "maria.perez@example.com"
  },
  "invitedEmailAddress": "maria.perez@example.com"
}
```

## 🎨 Estrategia de Visualización Completa

### **Nivel 1: Dashboard Ejecutivo**
- Métricas generales por curso
- Tendencias de participación
- Alertas automáticas

### **Nivel 2: Análisis Detallado**
- Timeline completo de actividades
- Análisis de submissions por estudiante
- Patrones de comportamiento

### **Nivel 3: Datos Granulares**
- Historial completo de cambios
- Archivos adjuntos y materiales
- Interacciones específicas

### **Nivel 4: Insights Avanzados**
- Predicciones de rendimiento
- Análisis de engagement
- Reportes personalizados

## 🔍 Datos Más Valiosos para Visualizar

### **Alta Prioridad:**
1. **Submission Timeline**: Cuándo entregan, patrones de retraso
2. **Grade Distribution**: Distribución de calificaciones
3. **Material Usage**: Qué materiales se usan más
4. **Student Engagement**: Frecuencia de actividad
5. **Assignment Difficulty**: Basado en tiempo de entrega y calificaciones

### **Media Prioridad:**
6. **Topic Performance**: Rendimiento por tema/unidad
7. **Announcement Engagement**: Qué anuncios generan más actividad
8. **Guardian Involvement**: Participación de tutores
9. **Course Evolution**: Cómo cambia el curso en el tiempo
10. **Peer Comparison**: Comparación entre estudiantes

### **Baja Prioridad:**
11. **File Analysis**: Tipos de archivos más usados
12. **Link Tracking**: Enlaces externos más visitados
13. **Schedule Patterns**: Patrones de horarios de entrega
14. **Device Usage**: Desde qué dispositivos acceden
15. **Geographic Data**: Ubicación de accesos (si disponible)

## 🛠️ Implementación Técnica

### **Backend Endpoints Necesarios:**
- `/api/courses/{id}/complete-data` - Todos los datos del curso
- `/api/courses/{id}/analytics` - Métricas calculadas
- `/api/courses/{id}/timeline-detailed` - Timeline con todos los eventos
- `/api/courses/{id}/materials` - Análisis de materiales
- `/api/students/{id}/complete-profile` - Perfil completo del estudiante

### **Frontend Components:**
- `CourseAnalyticsDashboard` - Vista completa de analytics
- `DetailedTimeline` - Timeline expandido
- `MaterialsExplorer` - Explorador de materiales
- `StudentProfileComplete` - Perfil completo de estudiante
- `SubmissionAnalyzer` - Análisis detallado de entregas
