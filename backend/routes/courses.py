from flask import Blueprint, jsonify, session
from services.classroom import GoogleClassroomService
from services.coordinator_analytics import CoordinatorAnalyticsService
from services.coordinator_analytics_mock import CoordinatorAnalyticsMockService
from .decorators import auth_required

courses_bp = Blueprint('courses', __name__, url_prefix='/courses')

@courses_bp.get('/all')
@auth_required
def get_all_courses():
    """Get all courses in the domain (for coordinators)"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        courses = classroom_service.get_all_domain_courses()
        return jsonify({"courses": courses}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch all courses", "message": str(e)}), 500

@courses_bp.get('/teaching')
@auth_required
def get_teaching_courses():
    """Get all courses taught by the authenticated user"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        courses = classroom_service.get_teaching_courses()
        return jsonify({"courses": courses}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch teaching courses", "message": str(e)}), 500

@courses_bp.get('/')
@auth_required
def get_courses():
    """Get all courses for authenticated user"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        courses = classroom_service.get_courses()
        return jsonify({"courses": courses}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch courses", "message": str(e)}), 500

@courses_bp.get('/<course_id>')
@auth_required
def get_course(course_id):
    """Get specific course details"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        course = classroom_service.get_course(course_id)
        if not course:
            return jsonify({"error": "Course not found"}), 404
        return jsonify(course), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch course", "message": str(e)}), 500

@courses_bp.get('/<course_id>/students')
@auth_required
def get_course_students(course_id):
    """Get students for a course"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        students = classroom_service.get_students(course_id)
        return jsonify({"students": students}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch students", "message": str(e)}), 500

@courses_bp.get('/<course_id>/teachers')
@auth_required
def get_course_teachers(course_id):
    """Get teachers for a course"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        teachers = classroom_service.get_teachers(course_id)
        return jsonify({"teachers": teachers}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch teachers", "message": str(e)}), 500

@courses_bp.get('/<course_id>/coursework')
@auth_required
def get_course_coursework(course_id):
    """Get coursework (assignments) for a course"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        coursework = classroom_service.get_coursework(course_id)
        return jsonify({"coursework": coursework}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch coursework", "message": str(e)}), 500

@courses_bp.get('/<course_id>/coursework/<coursework_id>/submissions')
@auth_required
def get_coursework_submissions(course_id, coursework_id):
    """Get student submissions for coursework"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        submissions = classroom_service.get_student_submissions(course_id, coursework_id)
        return jsonify({"submissions": submissions}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch submissions", "message": str(e)}), 500

@courses_bp.get('/<course_id>/materials')
@auth_required
def get_course_materials(course_id):
    """Get course work materials for a specific course."""
    access_token = session['access_token']
    classroom_service = GoogleClassroomService(access_token)
    try:
        materials = classroom_service.get_course_work_materials(course_id)
        return jsonify({"materials": materials}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch course materials", "message": str(e)}), 500

@courses_bp.get('/<course_id>/announcements')
@auth_required
def get_course_announcements(course_id):
    """Get announcements for a specific course."""
    access_token = session['access_token']
    classroom_service = GoogleClassroomService(access_token)
    try:
        announcements = classroom_service.get_announcements(course_id)
        return jsonify({"announcements": announcements}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch announcements", "message": str(e)}), 500

@courses_bp.get('/<course_id>/topics')
@auth_required
def get_course_topics(course_id):
    """Get topics for a specific course."""
    access_token = session['access_token']
    classroom_service = GoogleClassroomService(access_token)
    try:
        topics = classroom_service.get_topics(course_id)
        return jsonify({"topics": topics}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch topics", "message": str(e)}), 500

@courses_bp.get('/<course_id>/timeline')
@auth_required
def get_course_timeline(course_id):
    user = session.get('user')
    """Get combined timeline of course activities"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        timeline_events = classroom_service.get_course_timeline(course_id, user)
        return jsonify({"timeline": timeline_events}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch timeline", "message": str(e)}), 500

@courses_bp.get('/stream-timeline')
@auth_required
def get_all_courses_stream_timeline():
    """Fetches and combines the stream timeline for all user's courses."""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        stream_items = classroom_service.get_all_courses_stream()
        return jsonify({"stream_timeline": stream_items}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch stream timeline", "message": str(e)}), 500

@courses_bp.get('/<course_id>/complete-data')
@auth_required
def get_complete_course_data(course_id):
    """Get all available data for a course from Google Classroom"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        complete_data = classroom_service.get_complete_course_data(course_id)
        return jsonify(complete_data), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch complete course data", "message": str(e)}), 500


@courses_bp.get('/<course_id>/permissions')
@auth_required
def check_course_permissions(course_id):
    """Check what permissions the current user has for a specific course"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        permissions = classroom_service.check_user_permissions_for_course(course_id, session['user'])
        return jsonify(permissions), 200
    except Exception as e:
        return jsonify({"error": "Failed to check permissions", "message": str(e)}), 500

@courses_bp.get('/<course_id>/student-view')
@auth_required
def get_student_view_data(course_id):
    """Get all data available to a student for a specific course"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        student_data = classroom_service.get_student_view_for_course(course_id, session['user'])
        return jsonify(student_data), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch student view data", "message": str(e)}), 500

@courses_bp.get('/<course_id>/insights')
@auth_required
def get_student_course_insights(course_id):
    """Get detailed insights for a student in a specific course."""
    access_token = session['access_token']
    user = session.get('user')
    if not user or 'id' not in user:
        return jsonify({"error": "User not found in session"}), 401

    try:
        classroom_service = GoogleClassroomService(access_token)
        insights = classroom_service.get_student_course_insights(course_id, user['id'])
        return jsonify(insights), 200
    except Exception as e:
        return jsonify({"error": "Failed to generate course insights", "message": str(e)}), 500

@courses_bp.get('/coordinator/analytics')
@auth_required
def get_coordinator_analytics():
    """Get comprehensive analytics for coordinator dashboard"""
    # Using mock data for demonstration - replace with real service in production
    try:
        mock_service = CoordinatorAnalyticsMockService()
        analytics = mock_service.get_comprehensive_analytics()
        return jsonify(analytics), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch coordinator analytics", "message": str(e)}), 500

@courses_bp.get('/coordinator/analytics/real')
@auth_required
def get_coordinator_analytics_real():
    """Get real analytics from Google Classroom (for production)"""
    access_token = session['access_token']
    try:
        classroom_service = GoogleClassroomService(access_token)
        analytics_service = CoordinatorAnalyticsService(classroom_service)
        analytics = analytics_service.get_comprehensive_analytics()
        return jsonify(analytics), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch coordinator analytics", "message": str(e)}), 500

