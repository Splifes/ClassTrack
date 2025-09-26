from flask import Blueprint, jsonify, session, request
from services.classroom import GoogleClassroomService
from routes.decorators import auth_required
from datetime import datetime, time

dashboard_bp = Blueprint('dashboard_bp', __name__)
print("DEBUG: dashboard_routes.py loaded successfully!")

# Endpoint de debug para ver todas las rutas
@dashboard_bp.route('/api/debug/routes', methods=['GET'])
def debug_routes():
    from flask import current_app
    routes = []
    for rule in current_app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'rule': str(rule)
        })
    return jsonify(routes)

# Endpoint de debug para ver qué devuelve cada llamada a Google Classroom
@dashboard_bp.route('/api/debug/classroom-data', methods=['GET'])
@auth_required
def debug_classroom_data():
    user_info = session.get('user')
    access_token = session.get('access_token')
    
    if not user_info or not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    debug_data = {
        "user_info": user_info,
        "access_token_exists": access_token is not None,
        "access_token_preview": access_token[:20] + "..." if access_token else None,
        "steps": {}
    }
    
    try:
        # Paso 1: Inicializar servicio
        debug_data["steps"]["1_service_init"] = {"status": "attempting"}
        g = GoogleClassroomService(access_token)
        debug_data["steps"]["1_service_init"] = {"status": "success"}
        
        # Paso 2: Obtener cursos
        debug_data["steps"]["2_get_courses"] = {"status": "attempting"}
        courses = g.get_courses(student_id=user_info['id'])
        debug_data["steps"]["2_get_courses"] = {
            "status": "success",
            "count": len(courses),
            "data": courses
        }
        
        # Paso 3: Para cada curso, obtener coursework
        debug_data["steps"]["3_coursework_by_course"] = {}
        for i, course in enumerate(courses[:2]):  # Solo los primeros 2 cursos para no saturar
            course_id = course.get('id', f'course_{i}')
            debug_data["steps"]["3_coursework_by_course"][course_id] = {
                "course_name": course.get('name', 'Unknown'),
                "course_state": course.get('courseState', 'Unknown'),
                "status": "attempting"
            }
            
            try:
                coursework = g.get_coursework(course_id)
                debug_data["steps"]["3_coursework_by_course"][course_id].update({
                    "status": "success",
                    "coursework_count": len(coursework),
                    "coursework_data": coursework
                })
                
                # Paso 4: Para cada tarea, obtener submissions (solo la primera tarea)
                if coursework:
                    first_work = coursework[0]
                    work_id = first_work.get('id', 'unknown')
                    debug_data["steps"]["3_coursework_by_course"][course_id]["first_assignment_submissions"] = {
                        "assignment_title": first_work.get('title', 'Unknown'),
                        "assignment_id": work_id,
                        "status": "attempting"
                    }
                    
                    try:
                        submissions = g.get_student_submissions(course_id, work_id)
                        debug_data["steps"]["3_coursework_by_course"][course_id]["first_assignment_submissions"].update({
                            "status": "success",
                            "submissions_count": len(submissions),
                            "submissions_data": submissions
                        })
                    except Exception as e:
                        debug_data["steps"]["3_coursework_by_course"][course_id]["first_assignment_submissions"].update({
                            "status": "error",
                            "error": str(e)
                        })
                        
            except Exception as e:
                debug_data["steps"]["3_coursework_by_course"][course_id].update({
                    "status": "error",
                    "error": str(e)
                })
        
        debug_data["overall_status"] = "completed"
        
    except Exception as e:
        debug_data["overall_status"] = "failed"
        debug_data["fatal_error"] = str(e)
        import traceback
        debug_data["traceback"] = traceback.format_exc()
    
    return jsonify(debug_data)

# Manejador explícito para peticiones OPTIONS (CORS preflight)
@dashboard_bp.route('/api/dashboards/student', methods=['OPTIONS'])
def handle_options():
    response = jsonify({})
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Endpoint completo para el dashboard del estudiante
@dashboard_bp.route('/api/dashboards/student-complete', methods=['GET'])
@auth_required
def get_student_dashboard_complete():
    try:
        print("DEBUG: === STARTING COMPLETE STUDENT DASHBOARD ===")
        
        user_info = session.get('user')
        access_token = session.get('access_token')
        
        if not user_info or not access_token:
            return jsonify({"error": "Not authenticated"}), 401
            
        g = GoogleClassroomService(access_token)
        courses = g.get_courses(student_id=user_info['id'])
        
        # Estructura del dashboard completo
        dashboard_data = {
            "quickSummary": {
                "totalCourses": 0,
                "activeCourses": 0,
                "totalPendingAssignments": 0,
                "nextDeadline": None,
                "overallStatus": "up_to_date"  # up_to_date, behind, critical
            },
            "upcomingDeadlines": [],
            "recentAnnouncements": [],
            "courseProgress": [],
            "grades": [],
            "streak": {
                "currentStreak": 0,
                "longestStreak": 0,
                "onTimeSubmissions": 0,
                "lateSubmissions": 0
            }
        }
        
        dashboard_data["quickSummary"]["totalCourses"] = len(courses)
        active_courses = [c for c in courses if c.get('courseState') == 'ACTIVE']
        dashboard_data["quickSummary"]["activeCourses"] = len(active_courses)
        
        all_upcoming_assignments = []
        total_pending = 0
        
        for course in active_courses:
            course_id = course['id']
            course_name = course['name']
            
            # Obtener coursework
            coursework = g.get_coursework(course_id)
            
            # Obtener anuncios
            announcements = g.get_announcements(course_id)
            
            # Procesar anuncios recientes (últimos 5 días)
            from datetime import datetime, timedelta
            five_days_ago = datetime.now() - timedelta(days=5)
            
            for announcement in announcements[:3]:  # Solo los 3 más recientes por curso
                dashboard_data["recentAnnouncements"].append({
                    "courseId": course_id,
                    "courseName": course_name,
                    "title": announcement.get('text', 'Sin título')[:100],
                    "creationTime": announcement.get('creationTime', ''),
                    "link": announcement.get('alternateLink', '#')
                })
            
            # Procesar assignments
            course_pending = 0
            course_completed = 0
            
            for work in coursework:
                # Obtener submissions para esta tarea
                submissions = g.get_student_submissions(course_id, work['id'])
                user_submission = None
                
                for sub in submissions:
                    if sub.get('userId') == user_info['id']:
                        user_submission = sub
                        break
                
                is_pending = not user_submission or user_submission.get('state') not in ['TURNED_IN', 'RETURNED']
                
                if is_pending:
                    course_pending += 1
                    total_pending += 1
                    
                    # Añadir a upcoming deadlines si tiene fecha
                    if 'dueDate' in work:
                        due_date = datetime(
                            work['dueDate'].get('year', 2024),
                            work['dueDate'].get('month', 1),
                            work['dueDate'].get('day', 1)
                        )
                        
                        all_upcoming_assignments.append({
                            "courseId": course_id,
                            "courseName": course_name,
                            "assignmentId": work['id'],
                            "title": work['title'],
                            "dueDate": due_date.isoformat(),
                            "dueDateFormatted": due_date.strftime('%d de %b, %Y'),
                            "daysUntilDue": (due_date - datetime.now()).days,
                            "link": work.get('alternateLink', '#'),
                            "priority": "high" if (due_date - datetime.now()).days <= 2 else "medium"
                        })
                else:
                    course_completed += 1
            
            # Progreso del curso
            total_assignments = len(coursework)
            completion_rate = (course_completed / total_assignments * 100) if total_assignments > 0 else 100
            
            dashboard_data["courseProgress"].append({
                "courseId": course_id,
                "courseName": course_name,
                "totalAssignments": total_assignments,
                "completedAssignments": course_completed,
                "pendingAssignments": course_pending,
                "completionRate": round(completion_rate, 1),
                "status": "excellent" if completion_rate >= 90 else "good" if completion_rate >= 70 else "needs_attention"
            })
        
        # Ordenar upcoming assignments por fecha
        all_upcoming_assignments.sort(key=lambda x: x['dueDate'])
        dashboard_data["upcomingDeadlines"] = all_upcoming_assignments[:10]  # Solo los próximos 10
        
        # Determinar próxima deadline
        if all_upcoming_assignments:
            dashboard_data["quickSummary"]["nextDeadline"] = all_upcoming_assignments[0]
        
        # Determinar estado general
        dashboard_data["quickSummary"]["totalPendingAssignments"] = total_pending
        
        if total_pending == 0:
            dashboard_data["quickSummary"]["overallStatus"] = "excellent"
        elif total_pending <= 3:
            dashboard_data["quickSummary"]["overallStatus"] = "good"
        elif total_pending <= 7:
            dashboard_data["quickSummary"]["overallStatus"] = "behind"
        else:
            dashboard_data["quickSummary"]["overallStatus"] = "critical"
        
        # Ordenar anuncios por fecha
        dashboard_data["recentAnnouncements"].sort(key=lambda x: x['creationTime'], reverse=True)
        dashboard_data["recentAnnouncements"] = dashboard_data["recentAnnouncements"][:8]  # Solo los 8 más recientes
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        print(f"ERROR: Exception in complete student dashboard: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch dashboard data: {str(e)}"}), 500

# Endpoint completo para el dashboard del profesor
@dashboard_bp.route('/api/dashboards/teacher-complete', methods=['GET'])
@auth_required
def get_teacher_dashboard_complete():
    try:
        print("DEBUG: === STARTING COMPLETE TEACHER DASHBOARD ===")
        
        user_info = session.get('user')
        access_token = session.get('access_token')
        
        if not user_info or not access_token:
            return jsonify({"error": "Not authenticated"}), 401
            
        g = GoogleClassroomService(access_token)
        
        # Obtener cursos que enseña el profesor
        teaching_courses = g.get_teaching_courses()
        
        # Estructura del dashboard del profesor
        dashboard_data = {
            "overview": {
                "totalCourses": len(teaching_courses),
                "totalStudents": 0,
                "totalAssignments": 0,
                "averageSubmissionRate": 0
            },
            "classPerformance": [],
            "submissionStatus": [],
            "studentComparisons": [],
            "participationMetrics": [],
            "recentActivity": []
        }
        
        all_students = {}
        total_assignments = 0
        total_submissions = 0
        total_possible_submissions = 0
        
        for course in teaching_courses:
            if course.get('courseState') != 'ACTIVE':
                continue
                
            course_id = course['id']
            course_name = course['name']
            
            # Obtener estudiantes del curso
            students = g.get_students(course_id)
            course_student_count = len(students)
            dashboard_data["overview"]["totalStudents"] += course_student_count
            
            # Obtener coursework del curso
            coursework = g.get_coursework(course_id)
            course_assignment_count = len(coursework)
            total_assignments += course_assignment_count
            
            # Métricas por curso
            course_submissions = 0
            course_possible_submissions = course_student_count * course_assignment_count
            total_possible_submissions += course_possible_submissions
            
            # Análisis de entregas por estudiante
            student_performance = {}
            assignment_submission_rates = {}
            
            for work in coursework:
                work_id = work['id']
                work_title = work['title']
                
                # Obtener todas las entregas para esta tarea
                submissions = g.get_student_submissions(course_id, work_id)
                submitted_count = len([s for s in submissions if s.get('state') in ['TURNED_IN', 'RETURNED']])
                
                assignment_submission_rates[work_id] = {
                    'title': work_title,
                    'submitted': submitted_count,
                    'total': course_student_count,
                    'rate': (submitted_count / course_student_count * 100) if course_student_count > 0 else 0
                }
                
                course_submissions += submitted_count
                
                # Analizar por estudiante
                for submission in submissions:
                    student_id = submission.get('userId')
                    if student_id:
                        if student_id not in student_performance:
                            student_performance[student_id] = {
                                'submitted': 0,
                                'total': 0,
                                'late': 0,
                                'on_time': 0
                            }
                        
                        student_performance[student_id]['total'] += 1
                        
                        if submission.get('state') in ['TURNED_IN', 'RETURNED']:
                            student_performance[student_id]['submitted'] += 1
                            
                            # Verificar si fue tarde (simplificado)
                            if submission.get('late', False):
                                student_performance[student_id]['late'] += 1
                            else:
                                student_performance[student_id]['on_time'] += 1
            
            total_submissions += course_submissions
            
            # Rendimiento del curso
            course_submission_rate = (course_submissions / course_possible_submissions * 100) if course_possible_submissions > 0 else 0
            
            dashboard_data["classPerformance"].append({
                "courseId": course_id,
                "courseName": course_name,
                "studentCount": course_student_count,
                "assignmentCount": course_assignment_count,
                "submissionRate": round(course_submission_rate, 1),
                "status": "excellent" if course_submission_rate >= 90 else "good" if course_submission_rate >= 75 else "needs_attention"
            })
            
            # Estado de entregas por tarea
            for work_id, work_data in assignment_submission_rates.items():
                dashboard_data["submissionStatus"].append({
                    "courseId": course_id,
                    "courseName": course_name,
                    "assignmentId": work_id,
                    "assignmentTitle": work_data['title'],
                    "submittedCount": work_data['submitted'],
                    "totalStudents": work_data['total'],
                    "submissionRate": round(work_data['rate'], 1),
                    "missingCount": work_data['total'] - work_data['submitted']
                })
            
            # Comparaciones de estudiantes
            for student in students:
                student_id = student['userId']
                student_name = student['profile']['name']['fullName']
                
                perf = student_performance.get(student_id, {'submitted': 0, 'total': course_assignment_count, 'late': 0, 'on_time': 0})
                completion_rate = (perf['submitted'] / perf['total'] * 100) if perf['total'] > 0 else 0
                
                dashboard_data["studentComparisons"].append({
                    "courseId": course_id,
                    "courseName": course_name,
                    "studentId": student_id,
                    "studentName": student_name,
                    "completionRate": round(completion_rate, 1),
                    "submittedCount": perf['submitted'],
                    "totalAssignments": perf['total'],
                    "lateSubmissions": perf['late'],
                    "onTimeSubmissions": perf['on_time'],
                    "status": "excellent" if completion_rate >= 90 else "good" if completion_rate >= 70 else "at_risk"
                })
                
                # Agregar a estudiantes globales para métricas de participación
                if student_id not in all_students:
                    all_students[student_id] = {
                        'name': student_name,
                        'courses': [],
                        'total_completion': 0,
                        'total_assignments': 0
                    }
                
                all_students[student_id]['courses'].append(course_name)
                all_students[student_id]['total_completion'] += perf['submitted']
                all_students[student_id]['total_assignments'] += perf['total']
        
        # Calcular métricas generales
        dashboard_data["overview"]["totalAssignments"] = total_assignments
        dashboard_data["overview"]["averageSubmissionRate"] = round(
            (total_submissions / total_possible_submissions * 100) if total_possible_submissions > 0 else 0, 1
        )
        
        # Métricas de participación global
        for student_id, student_data in all_students.items():
            overall_rate = (student_data['total_completion'] / student_data['total_assignments'] * 100) if student_data['total_assignments'] > 0 else 0
            
            dashboard_data["participationMetrics"].append({
                "studentId": student_id,
                "studentName": student_data['name'],
                "coursesCount": len(student_data['courses']),
                "overallCompletionRate": round(overall_rate, 1),
                "totalSubmitted": student_data['total_completion'],
                "totalAssignments": student_data['total_assignments'],
                "participationLevel": "high" if overall_rate >= 85 else "medium" if overall_rate >= 60 else "low"
            })
        
        # Ordenar por rendimiento
        dashboard_data["studentComparisons"].sort(key=lambda x: x['completionRate'], reverse=True)
        dashboard_data["participationMetrics"].sort(key=lambda x: x['overallCompletionRate'], reverse=True)
        dashboard_data["submissionStatus"].sort(key=lambda x: x['submissionRate'])
        
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        print(f"ERROR: Exception in complete teacher dashboard: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch teacher dashboard data: {str(e)}"}), 500

# Endpoint de debug que simula datos de profesor (sin autenticación real)
@dashboard_bp.route('/api/dashboards/teacher-debug', methods=['GET'])
@auth_required
def get_teacher_dashboard_debug():
    """Dashboard del profesor con datos simulados para testing"""
    try:
        print("DEBUG: === STARTING DEBUG TEACHER DASHBOARD (SIMULATED) ===")
        
        # Datos simulados realistas para un profesor
        dashboard_data = {
            "overview": {
                "totalCourses": 3,
                "totalStudents": 67,
                "totalAssignments": 18,
                "averageSubmissionRate": 82.4
            },
            "classPerformance": [
                {
                    "courseId": "course_math_101",
                    "courseName": "Matemáticas Básicas",
                    "studentCount": 28,
                    "assignmentCount": 6,
                    "submissionRate": 89.3,
                    "status": "excellent"
                },
                {
                    "courseId": "course_algebra_201", 
                    "courseName": "Álgebra Intermedia",
                    "studentCount": 22,
                    "assignmentCount": 7,
                    "submissionRate": 77.3,
                    "status": "good"
                },
                {
                    "courseId": "course_geometry_301",
                    "courseName": "Geometría Avanzada",
                    "studentCount": 17,
                    "assignmentCount": 5,
                    "submissionRate": 64.7,
                    "status": "needs_attention"
                }
            ],
            "submissionStatus": [
                {
                    "courseId": "course_math_101",
                    "courseName": "Matemáticas Básicas",
                    "assignmentId": "hw_derivatives_1",
                    "assignmentTitle": "Tarea: Derivadas Básicas",
                    "submittedCount": 26,
                    "totalStudents": 28,
                    "submissionRate": 92.9,
                    "missingCount": 2
                },
                {
                    "courseId": "course_algebra_201",
                    "courseName": "Álgebra Intermedia", 
                    "assignmentId": "quiz_systems_1",
                    "assignmentTitle": "Quiz: Sistemas de Ecuaciones",
                    "submittedCount": 18,
                    "totalStudents": 22,
                    "submissionRate": 81.8,
                    "missingCount": 4
                },
                {
                    "courseId": "course_geometry_301",
                    "courseName": "Geometría Avanzada",
                    "assignmentId": "project_proofs",
                    "assignmentTitle": "Proyecto: Demostraciones Geométricas",
                    "submittedCount": 9,
                    "totalStudents": 17,
                    "submissionRate": 52.9,
                    "missingCount": 8
                },
                {
                    "courseId": "course_math_101",
                    "courseName": "Matemáticas Básicas",
                    "assignmentId": "exam_midterm",
                    "assignmentTitle": "Examen Parcial",
                    "submittedCount": 27,
                    "totalStudents": 28,
                    "submissionRate": 96.4,
                    "missingCount": 1
                },
                {
                    "courseId": "course_algebra_201",
                    "courseName": "Álgebra Intermedia",
                    "assignmentId": "hw_matrices",
                    "assignmentTitle": "Tarea: Operaciones con Matrices",
                    "submittedCount": 15,
                    "totalStudents": 22,
                    "submissionRate": 68.2,
                    "missingCount": 7
                }
            ],
            "studentComparisons": [
                {
                    "courseId": "course_math_101",
                    "courseName": "Matemáticas Básicas",
                    "studentId": "student_ana_garcia",
                    "studentName": "Ana García Rodríguez",
                    "completionRate": 100.0,
                    "submittedCount": 6,
                    "totalAssignments": 6,
                    "lateSubmissions": 0,
                    "onTimeSubmissions": 6,
                    "status": "excellent"
                },
                {
                    "courseId": "course_algebra_201",
                    "courseName": "Álgebra Intermedia",
                    "studentId": "student_carlos_lopez",
                    "studentName": "Carlos López Martínez",
                    "completionRate": 85.7,
                    "submittedCount": 6,
                    "totalAssignments": 7,
                    "lateSubmissions": 2,
                    "onTimeSubmissions": 4,
                    "status": "good"
                },
                {
                    "courseId": "course_geometry_301",
                    "courseName": "Geometría Avanzada",
                    "studentId": "student_maria_torres",
                    "studentName": "María Torres Vega",
                    "completionRate": 80.0,
                    "submittedCount": 4,
                    "totalAssignments": 5,
                    "lateSubmissions": 1,
                    "onTimeSubmissions": 3,
                    "status": "good"
                },
                {
                    "courseId": "course_math_101",
                    "courseName": "Matemáticas Básicas",
                    "studentId": "student_diego_ruiz",
                    "studentName": "Diego Ruiz Herrera",
                    "completionRate": 66.7,
                    "submittedCount": 4,
                    "totalAssignments": 6,
                    "lateSubmissions": 3,
                    "onTimeSubmissions": 1,
                    "status": "at_risk"
                },
                {
                    "courseId": "course_algebra_201",
                    "courseName": "Álgebra Intermedia",
                    "studentId": "student_sofia_morales",
                    "studentName": "Sofía Morales Castro",
                    "completionRate": 71.4,
                    "submittedCount": 5,
                    "totalAssignments": 7,
                    "lateSubmissions": 2,
                    "onTimeSubmissions": 3,
                    "status": "good"
                },
                {
                    "courseId": "course_geometry_301",
                    "courseName": "Geometría Avanzada",
                    "studentId": "student_alejandro_jimenez",
                    "studentName": "Alejandro Jiménez Ortiz",
                    "completionRate": 40.0,
                    "submittedCount": 2,
                    "totalAssignments": 5,
                    "lateSubmissions": 1,
                    "onTimeSubmissions": 1,
                    "status": "at_risk"
                },
                {
                    "courseId": "course_math_101",
                    "courseName": "Matemáticas Básicas",
                    "studentId": "student_valentina_santos",
                    "studentName": "Valentina Santos Pérez",
                    "completionRate": 83.3,
                    "submittedCount": 5,
                    "totalAssignments": 6,
                    "lateSubmissions": 1,
                    "onTimeSubmissions": 4,
                    "status": "good"
                }
            ],
            "participationMetrics": [
                {
                    "studentId": "student_ana_garcia",
                    "studentName": "Ana García Rodríguez",
                    "coursesCount": 2,
                    "overallCompletionRate": 92.3,
                    "totalSubmitted": 12,
                    "totalAssignments": 13,
                    "participationLevel": "high"
                },
                {
                    "studentId": "student_carlos_lopez",
                    "studentName": "Carlos López Martínez",
                    "coursesCount": 3,
                    "overallCompletionRate": 77.8,
                    "totalSubmitted": 14,
                    "totalAssignments": 18,
                    "participationLevel": "medium"
                },
                {
                    "studentId": "student_maria_torres",
                    "studentName": "María Torres Vega",
                    "coursesCount": 2,
                    "overallCompletionRate": 81.8,
                    "totalSubmitted": 9,
                    "totalAssignments": 11,
                    "participationLevel": "medium"
                },
                {
                    "studentId": "student_diego_ruiz",
                    "studentName": "Diego Ruiz Herrera",
                    "coursesCount": 1,
                    "overallCompletionRate": 66.7,
                    "totalSubmitted": 4,
                    "totalAssignments": 6,
                    "participationLevel": "medium"
                },
                {
                    "studentId": "student_sofia_morales",
                    "studentName": "Sofía Morales Castro",
                    "coursesCount": 2,
                    "overallCompletionRate": 75.0,
                    "totalSubmitted": 9,
                    "totalAssignments": 12,
                    "participationLevel": "medium"
                },
                {
                    "studentId": "student_alejandro_jimenez",
                    "studentName": "Alejandro Jiménez Ortiz",
                    "coursesCount": 1,
                    "overallCompletionRate": 40.0,
                    "totalSubmitted": 2,
                    "totalAssignments": 5,
                    "participationLevel": "low"
                }
            ],
            "recentActivity": []
        }
        
        print("DEBUG: Returning simulated teacher dashboard data")
        return jsonify(dashboard_data), 200
        
    except Exception as e:
        print(f"ERROR: Exception in debug teacher dashboard: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch debug teacher dashboard: {str(e)}"}), 500

@dashboard_bp.route('/api/dashboards/student', methods=['GET'])
@auth_required
def get_student_dashboard():
    try:
        print("DEBUG: === STARTING DASHBOARD REQUEST ===")
        
        print("DEBUG: Step 1 - Getting user info from session")
        user_info = session.get('user')
        print(f"DEBUG: User info: {user_info}")
        if not user_info:
            print("ERROR: No user info in session")
            return jsonify({"error": "User not authenticated"}), 401

        print("DEBUG: Step 2 - Getting access token from session")
        access_token = session.get('access_token')
        print(f"DEBUG: Access token exists: {access_token is not None}")
        if access_token:
            print(f"DEBUG: Access token starts with: {access_token[:20]}...")
        
        if not access_token:
            print("ERROR: No access token found in session")
            return jsonify({"error": "No access token found"}), 401
            
        print("DEBUG: Step 3 - Initializing GoogleClassroomService")
        try:
            g = GoogleClassroomService(access_token)
            print("DEBUG: GoogleClassroomService initialized successfully")
        except Exception as e:
            print(f"ERROR: Failed to initialize GoogleClassroomService: {e}")
            raise
        
        print("DEBUG: Step 4 - Getting courses")
        try:
            courses = g.get_courses(student_id=user_info['id'])
            print(f"DEBUG: get_courses returned: {type(courses)}")
            print(f"DEBUG: Found {len(courses)} courses")
            if courses:
                print(f"DEBUG: First course sample: {courses[0] if courses else 'None'}")
        except Exception as e:
            print(f"ERROR: Failed to get courses: {e}")
            raise
        
        dashboard_data = []
        print(f"DEBUG: Step 5 - Processing {len(courses)} courses")

        for i, course in enumerate(courses):
            try:
                print(f"DEBUG: === Processing course {i+1}/{len(courses)} ===")
                print(f"DEBUG: Course ID: {course.get('id', 'NO_ID')}")
                print(f"DEBUG: Course name: {course.get('name', 'NO_NAME')}")
                print(f"DEBUG: Course state: {course.get('courseState', 'NO_STATE')}")
                
                if course.get('courseState') != 'ACTIVE':
                    print(f"DEBUG: Skipping inactive course: {course.get('name')}")
                    continue

                print(f"DEBUG: Step 5.1 - Getting coursework for course {course['id']}")
                try:
                    course_work = g.get_coursework(course['id'])
                    print(f"DEBUG: get_coursework returned: {type(course_work)}")
                    print(f"DEBUG: Found {len(course_work)} assignments")
                    if course_work:
                        print(f"DEBUG: First assignment sample: {course_work[0] if course_work else 'None'}")
                except Exception as e:
                    print(f"ERROR: Failed to get coursework for {course['id']}: {e}")
                    continue
                
                print(f"DEBUG: Step 5.2 - Getting submissions for each assignment")
                submission_states = {}
                for j, work in enumerate(course_work):
                    try:
                        print(f"DEBUG: Getting submissions for assignment {j+1}/{len(course_work)}: {work.get('id', 'NO_ID')}")
                        submissions = g.get_student_submissions(course['id'], work['id'])
                        print(f"DEBUG: Found {len(submissions)} submissions for assignment {work['id']}")
                        
                        for sub in submissions:
                            if sub.get('userId') == user_info['id']:
                                submission_states[work['id']] = sub.get('state', 'NEW')
                                print(f"DEBUG: Found user submission for {work['id']}: {sub.get('state', 'NEW')}")
                                break
                    except Exception as e:
                        print(f"ERROR: Failed to get submissions for assignment {work.get('id', 'NO_ID')}: {e}")
                        continue

                print(f"DEBUG: Step 5.3 - Processing pending assignments")
                pending_assignments = []
                for work in course_work:
                    try:
                        work_state = submission_states.get(work['id'], 'NEW')
                        print(f"DEBUG: Assignment {work.get('title', 'NO_TITLE')} state: {work_state}")
                        
                        if work_state not in ['TURNED_IN', 'RETURNED']:
                            due_date_str = "Sin fecha límite"
                            if 'dueDate' in work:
                                due_date = datetime(
                                    work['dueDate'].get('year', 1970),
                                    work['dueDate'].get('month', 1),
                                    work['dueDate'].get('day', 1)
                                )
                                due_date_str = due_date.strftime('%d de %b, %Y')
                            
                            pending_assignments.append({
                                'id': work['id'],
                                'title': work['title'],
                                'dueDate': due_date_str,
                                'link': work.get('alternateLink', '#')
                            })
                            print(f"DEBUG: Added pending assignment: {work.get('title', 'NO_TITLE')}")
                    except Exception as e:
                        print(f"ERROR: Failed to process assignment {work.get('id', 'NO_ID')}: {e}")
                        continue

                if pending_assignments:
                    dashboard_data.append({
                        'courseId': course['id'],
                        'courseName': course['name'],
                        'pendingAssignments': pending_assignments
                    })
                    print(f"DEBUG: Added course {course['name']} with {len(pending_assignments)} pending assignments")
                else:
                    print(f"DEBUG: No pending assignments for course {course['name']}")
                    
            except Exception as e:
                print(f"ERROR: Failed to process course {course.get('id', 'NO_ID')}: {e}")
                continue

        print(f"DEBUG: Step 6 - Final result")
        print(f"DEBUG: Returning {len(dashboard_data)} courses with pending assignments")
        print(f"DEBUG: Final dashboard_data: {dashboard_data}")
        return jsonify(dashboard_data), 200

    except Exception as e:
        print(f"ERROR: FATAL exception in dashboard endpoint: {e}")
        import traceback
        print("ERROR: Full traceback:")
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch dashboard data: {str(e)}"}), 500
