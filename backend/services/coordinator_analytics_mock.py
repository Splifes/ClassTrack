from typing import Dict, List
from datetime import datetime, timedelta
import random

class CoordinatorAnalyticsMockService:
    """Mock service for coordinator analytics with realistic data"""
    
    def get_comprehensive_analytics(self) -> Dict:
        """Get mock analytics data for coordinator dashboard"""
        return {
            "institution_overview": self._get_mock_institution_overview(),
            "course_metrics": self._get_mock_course_metrics(),
            "teacher_metrics": self._get_mock_teacher_metrics(),
            "alerts": self._get_mock_alerts(),
            "last_updated": datetime.now().isoformat()
        }
    
    def _get_mock_institution_overview(self) -> Dict:
        """Mock institution overview data"""
        return {
            "total_courses": 24,
            "active_courses": 18,
            "total_teachers": 12,
            "total_students": 456,
            "courses_per_teacher": 1.5,
            "students_per_course": 25.3
        }
    
    def _get_mock_course_metrics(self) -> List[Dict]:
        """Mock course metrics with realistic data"""
        courses = [
            {
                "course_id": "course_001",
                "course_name": "Matemáticas Avanzadas",
                "teacher_name": "Prof. Ana García",
                "teacher_email": "ana.garcia@escuela.edu",
                "student_count": 28,
                "assignment_count": 15,
                "material_count": 8,
                "average_grade": 78.5,
                "submission_rate": 85.2,
                "on_time_rate": 72.1,
                "late_rate": 13.1,
                "announcements_count": 12,
                "recent_announcements": 3,
                "materials_shared": 8,
                "risk_level": "medium",
                "issues": ["Algunas entregas tardías", "Promedio por debajo del objetivo"],
                "last_activity": "2024-01-15T10:30:00Z",
                "grade_distribution": {
                    "excellent": 25.0,
                    "good": 42.9,
                    "regular": 21.4,
                    "poor": 10.7
                }
            },
            {
                "course_id": "course_002",
                "course_name": "Historia Mundial",
                "teacher_name": "Prof. Carlos Rodríguez",
                "teacher_email": "carlos.rodriguez@escuela.edu",
                "student_count": 32,
                "assignment_count": 12,
                "material_count": 15,
                "average_grade": 92.3,
                "submission_rate": 96.8,
                "on_time_rate": 89.4,
                "late_rate": 7.4,
                "announcements_count": 18,
                "recent_announcements": 5,
                "materials_shared": 15,
                "risk_level": "low",
                "issues": [],
                "last_activity": "2024-01-16T14:20:00Z",
                "grade_distribution": {
                    "excellent": 65.6,
                    "good": 25.0,
                    "regular": 6.3,
                    "poor": 3.1
                }
            },
            {
                "course_id": "course_003",
                "course_name": "Química Orgánica",
                "teacher_name": "Prof. María López",
                "teacher_email": "maria.lopez@escuela.edu",
                "student_count": 24,
                "assignment_count": 18,
                "material_count": 12,
                "average_grade": 65.8,
                "submission_rate": 68.5,
                "on_time_rate": 52.3,
                "late_rate": 16.2,
                "announcements_count": 8,
                "recent_announcements": 1,
                "materials_shared": 12,
                "risk_level": "high",
                "issues": ["Promedio muy bajo", "Baja tasa de entregas", "Muchas entregas tardías"],
                "last_activity": "2024-01-12T09:15:00Z",
                "grade_distribution": {
                    "excellent": 8.3,
                    "good": 20.8,
                    "regular": 37.5,
                    "poor": 33.4
                }
            },
            {
                "course_id": "course_004",
                "course_name": "Literatura Española",
                "teacher_name": "Prof. Juan Martínez",
                "teacher_email": "juan.martinez@escuela.edu",
                "student_count": 26,
                "assignment_count": 14,
                "material_count": 20,
                "average_grade": 84.7,
                "submission_rate": 91.3,
                "on_time_rate": 78.6,
                "late_rate": 12.7,
                "announcements_count": 16,
                "recent_announcements": 4,
                "materials_shared": 20,
                "risk_level": "low",
                "issues": [],
                "last_activity": "2024-01-16T11:45:00Z",
                "grade_distribution": {
                    "excellent": 42.3,
                    "good": 38.5,
                    "regular": 15.4,
                    "poor": 3.8
                }
            },
            {
                "course_id": "course_005",
                "course_name": "Física Cuántica",
                "teacher_name": "Prof. Elena Sánchez",
                "teacher_email": "elena.sanchez@escuela.edu",
                "student_count": 18,
                "assignment_count": 16,
                "material_count": 10,
                "average_grade": 71.2,
                "submission_rate": 77.8,
                "on_time_rate": 61.1,
                "late_rate": 16.7,
                "announcements_count": 10,
                "recent_announcements": 2,
                "materials_shared": 10,
                "risk_level": "medium",
                "issues": ["Materia compleja", "Entregas irregulares"],
                "last_activity": "2024-01-14T16:30:00Z",
                "grade_distribution": {
                    "excellent": 22.2,
                    "good": 33.3,
                    "regular": 27.8,
                    "poor": 16.7
                }
            },
            {
                "course_id": "course_006",
                "course_name": "Biología Molecular",
                "teacher_name": "Prof. Roberto Torres",
                "teacher_email": "roberto.torres@escuela.edu",
                "student_count": 30,
                "assignment_count": 13,
                "material_count": 18,
                "average_grade": 88.9,
                "submission_rate": 93.6,
                "on_time_rate": 85.4,
                "late_rate": 8.2,
                "announcements_count": 14,
                "recent_announcements": 6,
                "materials_shared": 18,
                "risk_level": "low",
                "issues": [],
                "last_activity": "2024-01-16T13:20:00Z",
                "grade_distribution": {
                    "excellent": 53.3,
                    "good": 30.0,
                    "regular": 13.3,
                    "poor": 3.4
                }
            },
            {
                "course_id": "course_007",
                "course_name": "Programación Avanzada",
                "teacher_name": "Prof. Laura Fernández",
                "teacher_email": "laura.fernandez@escuela.edu",
                "student_count": 22,
                "assignment_count": 20,
                "material_count": 25,
                "average_grade": 79.4,
                "submission_rate": 86.4,
                "on_time_rate": 68.2,
                "late_rate": 18.2,
                "announcements_count": 22,
                "recent_announcements": 7,
                "materials_shared": 25,
                "risk_level": "medium",
                "issues": ["Entregas tardías frecuentes"],
                "last_activity": "2024-01-16T15:10:00Z",
                "grade_distribution": {
                    "excellent": 31.8,
                    "good": 36.4,
                    "regular": 22.7,
                    "poor": 9.1
                }
            },
            {
                "course_id": "course_008",
                "course_name": "Arte y Diseño",
                "teacher_name": "Prof. Patricia Ruiz",
                "teacher_email": "patricia.ruiz@escuela.edu",
                "student_count": 35,
                "assignment_count": 10,
                "material_count": 30,
                "average_grade": 91.7,
                "submission_rate": 97.1,
                "on_time_rate": 94.3,
                "late_rate": 2.8,
                "announcements_count": 15,
                "recent_announcements": 4,
                "materials_shared": 30,
                "risk_level": "low",
                "issues": [],
                "last_activity": "2024-01-16T12:00:00Z",
                "grade_distribution": {
                    "excellent": 71.4,
                    "good": 22.9,
                    "regular": 5.7,
                    "poor": 0.0
                }
            }
        ]
        return courses
    
    def _get_mock_teacher_metrics(self) -> List[Dict]:
        """Mock teacher effectiveness metrics"""
        teachers = [
            {
                "teacher_name": "Prof. Ana García",
                "teacher_email": "ana.garcia@escuela.edu",
                "total_courses": 2,
                "course_names": ["Matemáticas Avanzadas", "Álgebra Lineal"],
                "total_students": 52,
                "total_assignments": 28,
                "average_class_performance": 78.5,
                "students_per_course": 26.0,
                "assignments_per_course": 14.0,
                "workload_level": "moderate",
                "performance_level": "good"
            },
            {
                "teacher_name": "Prof. Carlos Rodríguez",
                "teacher_email": "carlos.rodriguez@escuela.edu",
                "total_courses": 1,
                "course_names": ["Historia Mundial"],
                "total_students": 32,
                "total_assignments": 12,
                "average_class_performance": 92.3,
                "students_per_course": 32.0,
                "assignments_per_course": 12.0,
                "workload_level": "moderate",
                "performance_level": "excellent"
            },
            {
                "teacher_name": "Prof. María López",
                "teacher_email": "maria.lopez@escuela.edu",
                "total_courses": 3,
                "course_names": ["Química Orgánica", "Química General", "Laboratorio"],
                "total_students": 78,
                "total_assignments": 45,
                "average_class_performance": 65.8,
                "students_per_course": 26.0,
                "assignments_per_course": 15.0,
                "workload_level": "high",
                "performance_level": "needs_improvement"
            },
            {
                "teacher_name": "Prof. Juan Martínez",
                "teacher_email": "juan.martinez@escuela.edu",
                "total_courses": 2,
                "course_names": ["Literatura Española", "Redacción Avanzada"],
                "total_students": 48,
                "total_assignments": 26,
                "average_class_performance": 84.7,
                "students_per_course": 24.0,
                "assignments_per_course": 13.0,
                "workload_level": "moderate",
                "performance_level": "good"
            },
            {
                "teacher_name": "Prof. Elena Sánchez",
                "teacher_email": "elena.sanchez@escuela.edu",
                "total_courses": 2,
                "course_names": ["Física Cuántica", "Mecánica Clásica"],
                "total_students": 36,
                "total_assignments": 30,
                "average_class_performance": 71.2,
                "students_per_course": 18.0,
                "assignments_per_course": 15.0,
                "workload_level": "moderate",
                "performance_level": "average"
            },
            {
                "teacher_name": "Prof. Roberto Torres",
                "teacher_email": "roberto.torres@escuela.edu",
                "total_courses": 1,
                "course_names": ["Biología Molecular"],
                "total_students": 30,
                "total_assignments": 13,
                "average_class_performance": 88.9,
                "students_per_course": 30.0,
                "assignments_per_course": 13.0,
                "workload_level": "moderate",
                "performance_level": "excellent"
            },
            {
                "teacher_name": "Prof. Laura Fernández",
                "teacher_email": "laura.fernandez@escuela.edu",
                "total_courses": 4,
                "course_names": ["Programación Avanzada", "Algoritmos", "Estructuras de Datos", "Desarrollo Web"],
                "total_students": 95,
                "total_assignments": 68,
                "average_class_performance": 79.4,
                "students_per_course": 23.8,
                "assignments_per_course": 17.0,
                "workload_level": "high",
                "performance_level": "good"
            },
            {
                "teacher_name": "Prof. Patricia Ruiz",
                "teacher_email": "patricia.ruiz@escuela.edu",
                "total_courses": 3,
                "course_names": ["Arte y Diseño", "Historia del Arte", "Diseño Gráfico"],
                "total_students": 87,
                "total_assignments": 25,
                "average_class_performance": 91.7,
                "students_per_course": 29.0,
                "assignments_per_course": 8.3,
                "workload_level": "high",
                "performance_level": "excellent"
            },
            {
                "teacher_name": "Prof. Diego Morales",
                "teacher_email": "diego.morales@escuela.edu",
                "total_courses": 5,
                "course_names": ["Educación Física", "Deportes", "Natación", "Atletismo", "Gimnasia"],
                "total_students": 165,
                "total_assignments": 35,
                "average_class_performance": 86.2,
                "students_per_course": 33.0,
                "assignments_per_course": 7.0,
                "workload_level": "overloaded",
                "performance_level": "good"
            }
        ]
        return teachers
    
    def _get_mock_alerts(self) -> List[Dict]:
        """Mock system alerts"""
        alerts = [
            {
                "type": "course_risk",
                "severity": "high",
                "title": "Curso de alto riesgo: Química Orgánica",
                "description": "Promedio: 65.8%, Tasa de entregas: 68.5%",
                "course_id": "course_003",
                "teacher": "Prof. María López",
                "action_required": True
            },
            {
                "type": "teacher_overload",
                "severity": "high",
                "title": "Profesor sobrecargado: Prof. Diego Morales",
                "description": "165 estudiantes en 5 cursos diferentes",
                "teacher_email": "diego.morales@escuela.edu",
                "action_required": True
            },
            {
                "type": "teacher_performance",
                "severity": "medium",
                "title": "Rendimiento bajo: Prof. María López",
                "description": "Promedio de clase: 65.8% en múltiples cursos",
                "teacher_email": "maria.lopez@escuela.edu",
                "action_required": True
            },
            {
                "type": "low_engagement",
                "severity": "medium",
                "title": "Baja participación en Química Orgánica",
                "description": "Solo 68.5% de tasa de entregas",
                "course_id": "course_003",
                "teacher": "Prof. María López",
                "action_required": True
            },
            {
                "type": "course_risk",
                "severity": "medium",
                "title": "Entregas tardías: Programación Avanzada",
                "description": "18.2% de entregas tardías, por encima del promedio",
                "course_id": "course_007",
                "teacher": "Prof. Laura Fernández",
                "action_required": True
            },
            {
                "type": "teacher_workload",
                "severity": "medium",
                "title": "Carga alta: Prof. Laura Fernández",
                "description": "95 estudiantes en 4 cursos técnicos",
                "teacher_email": "laura.fernandez@escuela.edu",
                "action_required": False
            }
        ]
        return alerts
