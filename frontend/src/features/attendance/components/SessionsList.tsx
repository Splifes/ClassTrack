import React, { useState } from 'react';
import { AttendanceSession, attendanceService } from '../../../services/attendanceService';

interface SessionsListProps {
  sessions: AttendanceSession[];
  onSessionSelect: (session: AttendanceSession) => void;
  onCreateSession: (eventId: string) => void;
  courseId: string;
}

export const SessionsList: React.FC<SessionsListProps> = ({
  sessions,
  onSessionSelect,
  onCreateSession,
  courseId
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEventId, setNewEventId] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventId.trim()) return;

    setCreating(true);
    try {
      await onCreateSession(newEventId.trim());
      setNewEventId('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setCreating(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: 'Invalid date', time: '' };
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'not_started': { class: 'bg-secondary', text: 'Not Started' },
      'active': { class: 'bg-success', text: 'Active' },
      'completed': { class: 'bg-primary', text: 'Completed' },
      'cancelled': { class: 'bg-danger', text: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getAttendanceRate = (session: AttendanceSession) => {
    if (!session.attendance_summary) return null;
    
    const rate = attendanceService.calculateAttendanceRate(session.attendance_summary);
    const colorClass = rate >= 80 ? 'text-success' : rate >= 60 ? 'text-warning' : 'text-danger';
    
    return <span className={`fw-bold ${colorClass}`}>{rate}%</span>;
  };

  // Separate sessions by status
  const upcomingSessions = sessions.filter(s => s.status === 'not_started');
  const activeSessions = sessions.filter(s => s.status === 'active');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div>
      {/* Create Session Form */}
      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Create New Attendance Session</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateSession}>
              <div className="mb-3">
                <label htmlFor="eventId" className="form-label">
                  Calendar Event ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="eventId"
                  value={newEventId}
                  onChange={(e) => setNewEventId(e.target.value)}
                  placeholder="Enter Google Calendar event ID"
                  required
                />
                <div className="form-text">
                  You can find the event ID in the Google Calendar event URL or API response.
                </div>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating || !newEventId.trim()}
                >
                  {creating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Session'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewEventId('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Session Button */}
      {!showCreateForm && (
        <div className="mb-4">
          <button
            className="btn btn-success"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Create New Session
          </button>
        </div>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
          </div>
          <h5 className="text-muted">No attendance sessions found</h5>
          <p className="text-muted">
            Create your first attendance session from a calendar event to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-success mb-3">🟢 Active Sessions</h4>
              <div className="row">
                {activeSessions.map((session) => (
                  <SessionCard
                    key={session.event_id}
                    session={session}
                    onSelect={onSessionSelect}
                    getStatusBadge={getStatusBadge}
                    getAttendanceRate={getAttendanceRate}
                    formatDateTime={formatDateTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-secondary mb-3">⏳ Upcoming Sessions</h4>
              <div className="row">
                {upcomingSessions.map((session) => (
                  <SessionCard
                    key={session.event_id}
                    session={session}
                    onSelect={onSessionSelect}
                    getStatusBadge={getStatusBadge}
                    getAttendanceRate={getAttendanceRate}
                    formatDateTime={formatDateTime}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Sessions */}
          {completedSessions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-primary mb-3">✅ Completed Sessions</h4>
              <div className="row">
                {completedSessions.map((session) => (
                  <SessionCard
                    key={session.event_id}
                    session={session}
                    onSelect={onSessionSelect}
                    getStatusBadge={getStatusBadge}
                    getAttendanceRate={getAttendanceRate}
                    formatDateTime={formatDateTime}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface SessionCardProps {
  session: AttendanceSession;
  onSelect: (session: AttendanceSession) => void;
  getStatusBadge: (status: string) => JSX.Element;
  getAttendanceRate: (session: AttendanceSession) => JSX.Element | null;
  formatDateTime: (dateTime: string) => { date: string; time: string };
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onSelect,
  getStatusBadge,
  getAttendanceRate,
  formatDateTime
}) => {
  const { date, time } = formatDateTime(session.start_time);
  const attendanceRate = getAttendanceRate(session);

  return (
    <div className="col-md-6 col-lg-4 mb-3">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title mb-0">{session.title}</h6>
            {getStatusBadge(session.status)}
          </div>
          
          <div className="mb-2">
            <small className="text-muted">
              📅 {date} • ⏰ {time}
            </small>
          </div>

          {session.location && (
            <div className="mb-2">
              <small className="text-muted">
                📍 {session.location}
              </small>
            </div>
          )}

          {session.attendance_summary && (
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Attendance Rate:</small>
                {attendanceRate}
              </div>
              <div className="mt-1">
                <small className="text-muted">
                  Present: {session.attendance_summary.present} • 
                  Tardy: {session.attendance_summary.tardy} • 
                  Absent: {session.attendance_summary.absent}
                </small>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary btn-sm w-100"
            onClick={() => onSelect(session)}
          >
            {session.has_attendance ? 'Manage Attendance' : 'Start Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};
