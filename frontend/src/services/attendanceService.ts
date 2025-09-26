import { api } from './api';

// Types for attendance system
export interface AttendanceSession {
  session_id?: string;
  event_id: string;
  course_id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  has_attendance: boolean;
  status: 'not_started' | 'active' | 'completed' | 'cancelled';
  attendance_summary?: AttendanceSummary;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  tardy: number;
  absent: number;
  excused: number;
}

export interface AttendanceRecord {
  student_id: string;
  student_name: string;
  student_email: string;
  photo_url?: string;
  attendance_status: 'present' | 'tardy' | 'absent' | 'excused' | 'not_marked';
  check_in_time?: string;
  method?: 'token_check_in' | 'manual_entry';
  notes?: string;
}

export interface SessionRoster {
  session: {
    session_id: string;
    course_id: string;
    title: string;
    start_time: string;
    end_time: string;
  };
  roster: AttendanceRecord[];
  summary: AttendanceSummary;
}

export interface StudentAttendanceStats {
  student_id: string;
  total_sessions: number;
  present: number;
  tardy: number;
  absent: number;
  excused: number;
  attendance_rate: number;
  present_rate: number;
  tardy_rate: number;
  absent_rate: number;
}

export interface CourseAttendanceSummary {
  course_id: string;
  total_sessions: number;
  student_statistics: StudentAttendanceStats[];
  sessions: AttendanceSession[];
}

export interface CheckInToken {
  token: string;
  check_in_url: string;
  expires_in_minutes: number;
}

export class AttendanceService {
  /**
   * Get all attendance sessions for a course
   */
  async getCourseSessions(courseId: string): Promise<AttendanceSession[]> {
    try {
      const response = await api.request<{ sessions: AttendanceSession[] }>(`/attendance/courses/${courseId}/sessions`);
      return response.sessions;
    } catch (error) {
      console.error('Failed to fetch course sessions:', error);
      throw error;
    }
  }

  /**
   * Create a new attendance session from a calendar event
   */
  async createAttendanceSession(courseId: string, eventId: string): Promise<AttendanceSession> {
    try {
      const response = await api.request<{ session: AttendanceSession }>(`/attendance/courses/${courseId}/sessions`, {
        method: 'POST',
        body: JSON.stringify({ event_id: eventId })
      });
      return response.session;
    } catch (error) {
      console.error('Failed to create attendance session:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about an attendance session
   */
  async getSessionDetails(sessionId: string): Promise<any> {
    try {
      const response = await api.request<any>(`/attendance/sessions/${sessionId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch session details:', error);
      throw error;
    }
  }

  /**
   * Get the roster for an attendance session
   */
  async getSessionRoster(sessionId: string): Promise<SessionRoster> {
    try {
      const response = await api.request<SessionRoster>(`/attendance/sessions/${sessionId}/roster`);
      return response;
    } catch (error) {
      console.error('Failed to fetch session roster:', error);
      throw error;
    }
  }

  /**
   * Mark attendance for multiple students (teacher action)
   */
  async markAttendance(sessionId: string, records: Array<{
    student_id: string;
    status: 'present' | 'tardy' | 'absent' | 'excused';
    notes?: string;
  }>): Promise<any> {
    try {
      const response = await api.request<any>(`/attendance/sessions/${sessionId}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ records })
      });
      return response;
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      throw error;
    }
  }

  /**
   * Generate a check-in token for student self-check-in
   */
  async generateCheckInToken(sessionId: string, expiresInMinutes: number = 60): Promise<CheckInToken> {
    try {
      const response = await api.request<CheckInToken>(`/attendance/sessions/${sessionId}/check-in-token`, {
        method: 'POST',
        body: JSON.stringify({ expires_in_minutes: expiresInMinutes })
      });
      return response;
    } catch (error) {
      console.error('Failed to generate check-in token:', error);
      throw error;
    }
  }

  /**
   * Student check-in using token (no auth required)
   */
  async studentCheckIn(token: string, studentEmail: string, studentId?: string): Promise<any> {
    try {
      const response = await fetch(`${api.baseUrl}/attendance/check-in/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_email: studentEmail,
          student_id: studentId || studentEmail
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to check in:', error);
      throw error;
    }
  }

  /**
   * Get attendance summary for a course
   */
  async getCourseAttendanceSummary(courseId: string): Promise<CourseAttendanceSummary> {
    try {
      const response = await api.request<CourseAttendanceSummary>(`/attendance/courses/${courseId}/summary`);
      return response;
    } catch (error) {
      console.error('Failed to fetch course attendance summary:', error);
      throw error;
    }
  }

  /**
   * Get attendance history for a specific student
   */
  async getStudentAttendanceHistory(studentId: string, courseId?: string): Promise<any> {
    try {
      const url = `/attendance/students/${studentId}/history${courseId ? `?course_id=${courseId}` : ''}`;
      const response = await api.request<any>(url);
      return response;
    } catch (error) {
      console.error('Failed to fetch student attendance history:', error);
      throw error;
    }
  }

  /**
   * Export attendance data for a course
   */
  async exportCourseAttendance(courseId: string): Promise<any> {
    try {
      const response = await api.request<any>(`/attendance/courses/${courseId}/export`);
      return response;
    } catch (error) {
      console.error('Failed to export attendance data:', error);
      throw error;
    }
  }

  /**
   * Generate QR code data for check-in
   */
  generateQRCodeData(token: string): string {
    // In a real implementation, this would be the full URL to the check-in page
    return `${window.location.origin}/check-in/${token}`;
  }

  /**
   * Calculate attendance percentage
   */
  calculateAttendanceRate(summary: AttendanceSummary): number {
    if (summary.total === 0) return 0;
    return Math.round(((summary.present + summary.tardy) / summary.total) * 100);
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'present':
        return 'success';
      case 'tardy':
        return 'warning';
      case 'absent':
        return 'danger';
      case 'excused':
        return 'info';
      default:
        return 'secondary';
    }
  }

  /**
   * Get status icon for UI
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'present':
        return '✅';
      case 'tardy':
        return '⏰';
      case 'absent':
        return '❌';
      case 'excused':
        return '📝';
      default:
        return '❓';
    }
  }
}

// Export singleton instance
export const attendanceService = new AttendanceService();
