from flask import Blueprint, jsonify, request, session
from services.classroom import GoogleClassroomService
from services.calendar_service import GoogleCalendarService
from services.attendance_service import AttendanceService, AttendanceStatus
from .decorators import auth_required
from datetime import datetime

attendance_bp = Blueprint('attendance', __name__, url_prefix='/attendance')

# Global attendance service instance (in production, use proper dependency injection)
attendance_service = AttendanceService()

@attendance_bp.get('/courses/<course_id>/sessions')
@auth_required
def get_course_sessions(course_id):
    """Get all attendance sessions for a course."""
    access_token = session['access_token']
    
    try:
        # Get calendar events for the course
        calendar_service = GoogleCalendarService(access_token)
        class_sessions = calendar_service.get_class_sessions_for_course(course_id)
        
        # Get existing attendance sessions
        course_summary = attendance_service.get_course_attendance_summary(course_id)
        existing_sessions = {s['event_id']: s for s in course_summary['sessions']}
        
        # Combine calendar events with attendance data
        sessions_with_attendance = []
        for event in class_sessions:
            event_id = event['id']
            session_data = existing_sessions.get(event_id, {})
            
            combined_session = {
                'event_id': event_id,
                'session_id': session_data.get('session_id'),
                'title': event.get('summary', 'Class Session'),
                'start_time': event.get('start', {}).get('dateTime'),
                'end_time': event.get('end', {}).get('dateTime'),
                'location': event.get('location'),
                'has_attendance': bool(session_data),
                'status': session_data.get('status', 'not_started'),
                'attendance_summary': None
            }
            
            # Add attendance summary if session exists
            if session_data:
                session_attendance = attendance_service.get_session_attendance(session_data['session_id'])
                if session_attendance['success']:
                    combined_session['attendance_summary'] = session_attendance['summary']
            
            sessions_with_attendance.append(combined_session)
        
        return jsonify({
            'success': True,
            'course_id': course_id,
            'sessions': sessions_with_attendance
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch course sessions', 'message': str(e)}), 500

@attendance_bp.post('/courses/<course_id>/sessions')
@auth_required
def create_attendance_session(course_id):
    """Create a new attendance session from a calendar event."""
    access_token = session['access_token']
    data = request.get_json()
    
    if not data or 'event_id' not in data:
        return jsonify({'error': 'Event ID is required'}), 400
    
    event_id = data['event_id']
    
    try:
        # Get event details from calendar
        calendar_service = GoogleCalendarService(access_token)
        event_data = calendar_service.get_event_details(event_id)
        
        if not event_data:
            return jsonify({'error': 'Calendar event not found'}), 404
        
        # Create attendance session
        session_data = attendance_service.create_attendance_session(course_id, event_id, event_data)
        
        return jsonify({
            'success': True,
            'session': session_data
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to create attendance session', 'message': str(e)}), 500

@attendance_bp.get('/sessions/<session_id>')
@auth_required
def get_session_details(session_id):
    """Get detailed information about an attendance session."""
    try:
        session_attendance = attendance_service.get_session_attendance(session_id)
        
        if not session_attendance['success']:
            return jsonify({'error': session_attendance['error']}), 404
        
        return jsonify(session_attendance), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch session details', 'message': str(e)}), 500

@attendance_bp.get('/sessions/<session_id>/roster')
@auth_required
def get_session_roster(session_id):
    """Get the roster for an attendance session with current attendance status."""
    access_token = session['access_token']
    
    try:
        # Get session details
        session_attendance = attendance_service.get_session_attendance(session_id)
        if not session_attendance['success']:
            return jsonify({'error': session_attendance['error']}), 404
        
        session_data = session_attendance['session']
        course_id = session_data['course_id']
        
        # Get course students
        classroom_service = GoogleClassroomService(access_token)
        students = classroom_service.get_course_students(course_id)
        
        # Combine with attendance records
        attendance_records = {r['student_id']: r for r in session_attendance['attendance_records']}
        
        roster = []
        for student in students:
            student_id = student['userId']
            attendance_record = attendance_records.get(student_id)
            
            roster_entry = {
                'student_id': student_id,
                'student_name': student['profile']['name']['fullName'],
                'student_email': student['profile']['emailAddress'],
                'photo_url': student['profile'].get('photoUrl'),
                'attendance_status': attendance_record['status'] if attendance_record else 'not_marked',
                'check_in_time': attendance_record.get('check_in_time') if attendance_record else None,
                'method': attendance_record.get('method') if attendance_record else None,
                'notes': attendance_record.get('notes', '') if attendance_record else ''
            }
            
            roster.append(roster_entry)
        
        return jsonify({
            'success': True,
            'session': session_data,
            'roster': roster,
            'summary': session_attendance['summary']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch session roster', 'message': str(e)}), 500

@attendance_bp.post('/sessions/<session_id>/attendance')
@auth_required
def mark_attendance(session_id):
    """Mark attendance for students (teacher action)."""
    data = request.get_json()
    
    if not data or 'records' not in data:
        return jsonify({'error': 'Attendance records are required'}), 400
    
    try:
        results = []
        for record in data['records']:
            student_id = record.get('student_id')
            status = record.get('status')
            notes = record.get('notes', '')
            
            if not student_id or not status:
                results.append({
                    'student_id': student_id,
                    'success': False,
                    'error': 'Student ID and status are required'
                })
                continue
            
            try:
                attendance_status = AttendanceStatus(status)
            except ValueError:
                results.append({
                    'student_id': student_id,
                    'success': False,
                    'error': f'Invalid status: {status}'
                })
                continue
            
            result = attendance_service.mark_attendance_manual(session_id, student_id, attendance_status, notes)
            results.append({
                'student_id': student_id,
                'success': result['success'],
                'error': result.get('error'),
                'record': result.get('record')
            })
        
        return jsonify({
            'success': True,
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to mark attendance', 'message': str(e)}), 500

@attendance_bp.post('/sessions/<session_id>/check-in-token')
@auth_required
def generate_check_in_token(session_id):
    """Generate a check-in token for student self-check-in."""
    data = request.get_json() or {}
    expires_in_minutes = data.get('expires_in_minutes', 60)
    
    try:
        token = attendance_service.generate_check_in_token(session_id, expires_in_minutes)
        
        # In a real implementation, you might want to generate a QR code here
        check_in_url = f"/attendance/check-in/{token}"
        
        return jsonify({
            'success': True,
            'token': token,
            'check_in_url': check_in_url,
            'expires_in_minutes': expires_in_minutes
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to generate check-in token', 'message': str(e)}), 500

@attendance_bp.post('/check-in/<token>')
def student_check_in(token):
    """Student check-in endpoint (no auth required, uses token)."""
    data = request.get_json()
    
    if not data or 'student_email' not in data:
        return jsonify({'error': 'Student email is required'}), 400
    
    student_email = data['student_email']
    student_id = data.get('student_id', student_email)  # Fallback to email if no ID
    
    try:
        result = attendance_service.check_in_student(token, student_id, student_email)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'error': 'Check-in failed', 'message': str(e)}), 500

@attendance_bp.get('/courses/<course_id>/summary')
@auth_required
def get_course_attendance_summary(course_id):
    """Get attendance summary and statistics for a course."""
    try:
        summary = attendance_service.get_course_attendance_summary(course_id)
        return jsonify(summary), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch attendance summary', 'message': str(e)}), 500

@attendance_bp.get('/students/<student_id>/history')
@auth_required
def get_student_attendance_history(student_id):
    """Get attendance history for a specific student."""
    course_id = request.args.get('course_id')
    
    try:
        history = attendance_service.get_student_attendance_history(student_id, course_id)
        return jsonify(history), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch student attendance history', 'message': str(e)}), 500

@attendance_bp.get('/courses/<course_id>/export')
@auth_required
def export_course_attendance(course_id):
    """Export attendance data for a course (CSV format)."""
    try:
        summary = attendance_service.get_course_attendance_summary(course_id)
        
        # In a real implementation, you would generate a CSV file here
        # For now, return the data in a format suitable for CSV export
        
        export_data = {
            'course_id': course_id,
            'export_date': datetime.now().isoformat(),
            'sessions': summary['sessions'],
            'student_statistics': summary['student_statistics']
        }
        
        return jsonify({
            'success': True,
            'export_data': export_data,
            'format': 'json'  # In production, this would be CSV
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to export attendance data', 'message': str(e)}), 500
