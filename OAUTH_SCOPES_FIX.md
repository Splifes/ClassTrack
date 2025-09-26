# 🔧 OAuth Scopes Fix - Error 403 Solucionado

## 🎯 Problema Identificado

El error **403 Forbidden** al acceder a `coursework` se debía a **scopes de OAuth faltantes**. Revisamos la documentación oficial de Google Classroom API y encontramos que nos faltaban permisos específicos.

## 📋 Análisis de la Documentación

### Scopes Requeridos para CourseWork:
Según [Google Classroom API - courses.courseWork.list](https://developers.google.com/classroom/reference/rest/v1/courses.courseWork/list):

**Requiere uno de estos scopes:**
- `https://www.googleapis.com/auth/classroom.coursework.students.readonly`
- `https://www.googleapis.com/auth/classroom.coursework.me.readonly`
- `https://www.googleapis.com/auth/classroom.coursework.students`
- `https://www.googleapis.com/auth/classroom.coursework.me`

### Scopes Requeridos para Announcements:
Según [Google Classroom API - courses.announcements.list](https://developers.google.com/classroom/reference/rest/v1/courses.announcements/list):

**Requiere uno de estos scopes:**
- `https://www.googleapis.com/auth/classroom.announcements`
- `https://www.googleapis.com/auth/classroom.announcements.readonly`

## 🔍 Scopes Anteriores (Incompletos)

```python
# ANTES - en services/oauth.py líneas 21-28
'scope': ' '.join([
    'openid',
    'email', 
    'profile',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'
])
```

**❌ Faltaban:**
- Scope para coursework
- Scope para announcements

## ✅ Scopes Corregidos (Completos)

```python
# DESPUÉS - en services/oauth.py líneas 21-31
'scope': ' '.join([
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly', 
    'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.students.readonly',  # ✅ NUEVO
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',        # ✅ NUEVO
    'https://www.googleapis.com/auth/classroom.announcements.readonly'         # ✅ NUEVO
])
```

## 🎯 Explicación de Cada Scope

### **Scopes Básicos:**
- `openid` - Identificación OpenID
- `email` - Acceso al email del usuario
- `profile` - Acceso al perfil básico

### **Scopes de Classroom:**
- `classroom.courses.readonly` - Ver información de cursos
- `classroom.rosters.readonly` - Ver listas de estudiantes/profesores
- `classroom.student-submissions.students.readonly` - Ver submissions de estudiantes

### **Scopes Nuevos Agregados:**
- `classroom.coursework.students.readonly` - **Ver coursework de todos los estudiantes** (para profesores)
- `classroom.coursework.me.readonly` - **Ver MI coursework** (para estudiantes)
- `classroom.announcements.readonly` - **Ver anuncios del curso**

## 🔄 Qué Necesitas Hacer Ahora

### **IMPORTANTE: Re-autorización Requerida**

Como agregamos nuevos scopes, necesitas **volver a autorizar la aplicación**:

1. **Logout** de la aplicación actual
2. **Login nuevamente** - Google te pedirá permisos adicionales
3. **Acepta los nuevos permisos** cuando Google los solicite
4. **Prueba acceder** a coursework - ya no debería dar error 403

### **Pasos Específicos:**

1. Ve a http://localhost:5173
2. Click "Logout" si estás logueado
3. Click "Login with Google" 
4. **Google te mostrará una pantalla con permisos adicionales**
5. Acepta todos los permisos
6. Ve al curso 805427608483
7. Click "🔍 Datos Completos"
8. **¡Ya no debería haber error 403!**

## 🎓 Diferencias por Rol de Usuario

### **Como Profesor/Owner:**
- `coursework.students.readonly` - Ve **todo el coursework** del curso
- Puede ver submissions de **todos los estudiantes**
- Acceso completo a analytics del curso

### **Como Estudiante:**
- `coursework.me.readonly` - Ve **solo SU coursework** asignado
- Puede ver **solo SUS submissions**
- Analytics personales únicamente

## 🔍 Verificación de Scopes

Puedes verificar qué scopes tienes actualmente:

1. Ve a [Google Account Permissions](https://myaccount.google.com/permissions)
2. Busca "ClassTrack" o tu aplicación
3. Verifica que incluya los nuevos permisos de coursework y announcements

## 📊 Resultado Esperado

Después de re-autorizar:

- ✅ **No más errores 403** en coursework
- ✅ **Acceso completo** a assignments según tu rol
- ✅ **Announcements funcionando** (cuando se implemente)
- ✅ **Vista de estudiante** con datos reales
- ✅ **Vista de profesor** con datos completos

## 🚨 Troubleshooting

Si sigues teniendo problemas:

1. **Verifica que aceptaste todos los permisos** en Google
2. **Limpia cookies/localStorage** del navegador
3. **Prueba en modo incógnito**
4. **Revisa la consola** del navegador por errores
5. **Verifica los logs** del backend

## 📝 Notas Técnicas

- Los scopes son **acumulativos** - necesitas todos los relevantes
- Google **cachea permisos** - logout/login fuerza refresh
- Algunos scopes son **mutuamente exclusivos** (no nuestro caso)
- La **re-autorización es normal** cuando se agregan scopes

**¡El error 403 debería estar completamente resuelto después de la re-autorización! 🎉**
