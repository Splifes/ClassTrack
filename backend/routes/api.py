from flask import Blueprint, jsonify, session
from services.classroom import GoogleClassroomService

bp = Blueprint('api', __name__)

def require_auth():
    """Check if user is authenticated"""
    if 'access_token' not in session or 'user' not in session:
        return None
    return session['access_token']

@bp.get('/health')
def health():
    return jsonify({"status": "ok"}), 200

@bp.get('/api/auth/me')
def auth_me():
    """Get current user info"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    return jsonify(session['user']), 200

@bp.get('/api/courses')
def get_courses():
    """Get all courses for authenticated user"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        classroom_service = GoogleClassroomService(access_token)
        courses = classroom_service.get_courses()
        return jsonify({"courses": courses}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch courses", "message": str(e)}), 500

@bp.get('/api/courses/<course_id>')
def get_course(course_id):
    """Get specific course details"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        classroom_service = GoogleClassroomService(access_token)
        course = classroom_service.get_course(course_id)
        if not course:
            return jsonify({"error": "Course not found"}), 404
        return jsonify(course), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch course", "message": str(e)}), 500

@bp.get('/api/courses/<course_id>/students')
def get_course_students(course_id):
    """Get students for a course"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        classroom_service = GoogleClassroomService(access_token)
        students = classroom_service.get_students(course_id)
        return jsonify({"students": students}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch students", "message": str(e)}), 500

@bp.get('/api/courses/<course_id>/teachers')
def get_course_teachers(course_id):
    """Get teachers for a course"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        classroom_service = GoogleClassroomService(access_token)
        teachers = classroom_service.get_teachers(course_id)
        return jsonify({"teachers": teachers}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch teachers", "message": str(e)}), 500

@bp.get('/api/courses/<course_id>/coursework')
def get_course_coursework(course_id):
    """Get coursework (assignments) for a course"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        classroom_service = GoogleClassroomService(access_token)
        coursework = classroom_service.get_coursework(course_id)
        return jsonify({"coursework": coursework}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch coursework", "message": str(e)}), 500

@bp.get('/api/courses/<course_id>/coursework/<coursework_id>/submissions')
def get_coursework_submissions(course_id, coursework_id):
    """Get student submissions for coursework"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        classroom_service = GoogleClassroomService(access_token)
        submissions = classroom_service.get_student_submissions(course_id, coursework_id)
        return jsonify({"submissions": submissions}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch submissions", "message": str(e)}), 500

@bp.get('/api/students')
def get_all_students():
    """Get all students across all courses"""
    access_token = require_auth()
    if not access_token:
        return jsonify({"error": "Not authenticated"}), 401
    
    try:
        classroom_service = GoogleClassroomService(access_token)
        courses = classroom_service.get_courses()
        
        all_students = []
        for course in courses:
            students = classroom_service.get_students(course['id'])
            for student in students:
                student['courseId'] = course['id']
                student['courseName'] = course['name']
                all_students.append(student)
        
        return jsonify({"students": all_students}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch students", "message": str(e)}), 500
