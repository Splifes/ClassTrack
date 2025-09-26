from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import uuid
import json
from enum import Enum

class AttendanceStatus(Enum):
    PRESENT = "present"
    TARDY = "tardy"
    ABSENT = "absent"
    EXCUSED = "excused"

class AttendanceService:
    def __init__(self):
        # In a real implementation, this would connect to a database
        # For now, we'll use in-memory storage
        self.sessions = {}  # session_id -> session_data
        self.attendance_records = {}  # session_id -> {student_id -> attendance_record}
        self.check_in_tokens = {}  # token -> session_data
    
    def create_attendance_session(self, course_id: str, event_id: str, event_data: Dict) -> Dict:
        """
        Create a new attendance session based on a calendar event.
        
        Args:
            course_id: Google Classroom course ID
            event_id: Google Calendar event ID
            event_data: Calendar event data
        
        Returns:
            Created session data
        """
        session_id = str(uuid.uuid4())
        
        # Extract event timing
        start_time = event_data.get('start', {}).get('dateTime')
        end_time = event_data.get('end', {}).get('dateTime')
        
        session_data = {
            'session_id': session_id,
            'course_id': course_id,
            'event_id': event_id,
            'title': event_data.get('summary', 'Class Session'),
            'description': event_data.get('description', ''),
            'start_time': start_time,
            'end_time': end_time,
            'created_at': datetime.now().isoformat(),
            'status': 'active',  # active, completed, cancelled
            'check_in_window': {
                'start': start_time,
                'end': end_time
            },
            'tardy_threshold_minutes': 15,  # Consider tardy after 15 minutes
            'location': event_data.get('location', ''),
            'meet_link': self._extract_meet_link(event_data)
        }
        
        self.sessions[session_id] = session_data
        self.attendance_records[session_id] = {}
        
        return session_data
    
    def generate_check_in_token(self, session_id: str, expires_in_minutes: int = 60) -> str:
        """
        Generate a secure check-in token for a session.
        
        Args:
            session_id: The attendance session ID
            expires_in_minutes: Token expiration time in minutes
        
        Returns:
            Check-in token string
        """
        token = str(uuid.uuid4())
        expires_at = datetime.now() + timedelta(minutes=expires_in_minutes)
        
        self.check_in_tokens[token] = {
            'session_id': session_id,
            'expires_at': expires_at.isoformat(),
            'created_at': datetime.now().isoformat()
        }
        
        return token
    
    def check_in_student(self, token: str, student_id: str, student_email: str, check_in_time: Optional[str] = None) -> Dict:
        """
        Check in a student using a token.
        
        Args:
            token: Check-in token
            student_id: Google Classroom student ID
            student_email: Student email address
            check_in_time: Check-in timestamp (optional, defaults to now)
        
        Returns:
            Check-in result with status and details
        """
        if check_in_time is None:
            check_in_time = datetime.now().isoformat()
        
        # Validate token
        token_data = self.check_in_tokens.get(token)
        if not token_data:
            return {'success': False, 'error': 'Invalid or expired token'}
        
        # Check token expiration
        expires_at = datetime.fromisoformat(token_data['expires_at'])
        if datetime.now() > expires_at:
            return {'success': False, 'error': 'Token has expired'}
        
        session_id = token_data['session_id']
        session = self.sessions.get(session_id)
        if not session:
            return {'success': False, 'error': 'Session not found'}
        
        # Determine attendance status based on timing
        status = self._determine_attendance_status(session, check_in_time)
        
        # Record attendance
        attendance_record = {
            'student_id': student_id,
            'student_email': student_email,
            'status': status.value,
            'check_in_time': check_in_time,
            'session_id': session_id,
            'method': 'token_check_in',
            'recorded_at': datetime.now().isoformat()
        }
        
        if session_id not in self.attendance_records:
            self.attendance_records[session_id] = {}
        
        self.attendance_records[session_id][student_id] = attendance_record
        
        return {
            'success': True,
            'status': status.value,
            'message': f'Successfully checked in as {status.value}',
            'record': attendance_record
        }
    
    def mark_attendance_manual(self, session_id: str, student_id: str, status: AttendanceStatus, notes: str = "") -> Dict:
        """
        Manually mark attendance for a student (teacher action).
        
        Args:
            session_id: The attendance session ID
            student_id: Google Classroom student ID
            status: Attendance status
            notes: Optional notes
        
        Returns:
            Updated attendance record
        """
        session = self.sessions.get(session_id)
        if not session:
            return {'success': False, 'error': 'Session not found'}
        
        attendance_record = {
            'student_id': student_id,
            'status': status.value,
            'session_id': session_id,
            'method': 'manual_entry',
            'notes': notes,
            'recorded_at': datetime.now().isoformat(),
            'recorded_by': 'teacher'  # In real implementation, get from auth context
        }
        
        if session_id not in self.attendance_records:
            self.attendance_records[session_id] = {}
        
        self.attendance_records[session_id][student_id] = attendance_record
        
        return {'success': True, 'record': attendance_record}
    
    def get_session_attendance(self, session_id: str) -> Dict:
        """Get all attendance records for a session."""
        session = self.sessions.get(session_id)
        if not session:
            return {'success': False, 'error': 'Session not found'}
        
        records = self.attendance_records.get(session_id, {})
        
        return {
            'success': True,
            'session': session,
            'attendance_records': list(records.values()),
            'summary': self._calculate_session_summary(records)
        }
    
    def get_course_attendance_summary(self, course_id: str) -> Dict:
        """Get attendance summary for all sessions in a course."""
        course_sessions = [s for s in self.sessions.values() if s['course_id'] == course_id]
        
        total_sessions = len(course_sessions)
        student_stats = {}
        
        for session in course_sessions:
            session_id = session['session_id']
            records = self.attendance_records.get(session_id, {})
            
            for student_id, record in records.items():
                if student_id not in student_stats:
                    student_stats[student_id] = {
                        'student_id': student_id,
                        'total_sessions': 0,
                        'present': 0,
                        'tardy': 0,
                        'absent': 0,
                        'excused': 0
                    }
                
                student_stats[student_id]['total_sessions'] += 1
                student_stats[student_id][record['status']] += 1
        
        # Calculate percentages
        for student_id, stats in student_stats.items():
            total = stats['total_sessions']
            if total > 0:
                stats['attendance_rate'] = round((stats['present'] + stats['tardy']) / total * 100, 2)
                stats['present_rate'] = round(stats['present'] / total * 100, 2)
                stats['tardy_rate'] = round(stats['tardy'] / total * 100, 2)
                stats['absent_rate'] = round(stats['absent'] / total * 100, 2)
        
        return {
            'course_id': course_id,
            'total_sessions': total_sessions,
            'student_statistics': list(student_stats.values()),
            'sessions': course_sessions
        }
    
    def get_student_attendance_history(self, student_id: str, course_id: Optional[str] = None) -> Dict:
        """Get attendance history for a specific student."""
        student_records = []
        
        for session_id, records in self.attendance_records.items():
            if student_id in records:
                session = self.sessions.get(session_id)
                if course_id is None or (session and session['course_id'] == course_id):
                    record = records[student_id].copy()
                    record['session_info'] = session
                    student_records.append(record)
        
        # Sort by session date
        student_records.sort(key=lambda x: x.get('session_info', {}).get('start_time', ''))
        
        return {
            'student_id': student_id,
            'course_id': course_id,
            'total_records': len(student_records),
            'records': student_records
        }
    
    def _determine_attendance_status(self, session: Dict, check_in_time: str) -> AttendanceStatus:
        """Determine attendance status based on check-in time and session timing."""
        check_in_dt = datetime.fromisoformat(check_in_time.replace('Z', '+00:00'))
        session_start = datetime.fromisoformat(session['start_time'].replace('Z', '+00:00'))
        
        # Calculate minutes late
        minutes_late = (check_in_dt - session_start).total_seconds() / 60
        
        if minutes_late <= 0:
            return AttendanceStatus.PRESENT
        elif minutes_late <= session.get('tardy_threshold_minutes', 15):
            return AttendanceStatus.TARDY
        else:
            return AttendanceStatus.ABSENT  # Too late, marked as absent
    
    def _calculate_session_summary(self, records: Dict) -> Dict:
        """Calculate summary statistics for a session."""
        if not records:
            return {'total': 0, 'present': 0, 'tardy': 0, 'absent': 0, 'excused': 0}
        
        summary = {'total': len(records), 'present': 0, 'tardy': 0, 'absent': 0, 'excused': 0}
        
        for record in records.values():
            status = record['status']
            if status in summary:
                summary[status] += 1
        
        return summary
    
    def _extract_meet_link(self, event_data: Dict) -> Optional[str]:
        """Extract Google Meet link from calendar event data."""
        # Check in conferenceData
        conference_data = event_data.get('conferenceData', {})
        if conference_data:
            entry_points = conference_data.get('entryPoints', [])
            for entry_point in entry_points:
                if entry_point.get('entryPointType') == 'video':
                    return entry_point.get('uri')
        
        # Check in description
        description = event_data.get('description', '')
        if 'meet.google.com' in description:
            # Simple regex to extract meet link
            import re
            meet_match = re.search(r'https://meet\.google\.com/[a-z-]+', description)
            if meet_match:
                return meet_match.group()
        
        return None
