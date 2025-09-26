from flask import Blueprint, jsonify, session
from services.classroom import GoogleClassroomService

students_bp = Blueprint('students', __name__, url_prefix='/students')

from .decorators import auth_required

@students_bp.route('/', methods=['GET'])
@auth_required
def get_all_students():
    """Get a unique list of all students from all courses accessible to the user."""
    access_token = session.get('access_token')
    if not access_token:
        return jsonify({"error": "User not authenticated"}), 401

    try:
        classroom_service = GoogleClassroomService(access_token)
        students = classroom_service.get_all_students_from_all_courses()
        return jsonify({"students": students}), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch students", "message": str(e)}), 500
