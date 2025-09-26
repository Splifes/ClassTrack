import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { attendanceService, AttendanceSession } from '../../services/attendanceService';
import { SessionsList } from './components/SessionsList';
import { AttendanceSessionView } from './components/AttendanceSessionView';
import { AttendanceStats } from './components/AttendanceStats';

export const AttendancePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [activeTab, setActiveTab] = useState<'sessions' | 'stats'>('sessions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      loadSessions();
    }
  }, [courseId]);

  const loadSessions = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      setError(null);
      const sessionsData = await attendanceService.getCourseSessions(courseId);
      setSessions(sessionsData);
    } catch (err) {
      setError('Failed to load attendance sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (eventId: string) => {
    if (!courseId) return;
    
    try {
      const newSession = await attendanceService.createAttendanceSession(courseId, eventId);
      setSessions(prev => [...prev, newSession]);
      setSelectedSession(newSession);
    } catch (err) {
      setError('Failed to create attendance session');
      console.error(err);
    }
  };

  const handleSessionSelect = (session: AttendanceSession) => {
    setSelectedSession(session);
  };

  const handleBackToList = () => {
    setSelectedSession(null);
    loadSessions(); // Refresh sessions to get updated data
  };

  if (loading) {
    return (
      <div className="container-fluid mt-3">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading attendance data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-3">
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-outline-danger btn-sm ms-2" onClick={loadSessions}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If a specific session is selected, show the session view
  if (selectedSession) {
    return (
      <AttendanceSessionView
        session={selectedSession}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="container-fluid mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 Attendance Management</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={loadSessions}
            disabled={loading}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            📅 Sessions ({sessions.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistics
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'sessions' && (
        <SessionsList
          sessions={sessions}
          onSessionSelect={handleSessionSelect}
          onCreateSession={handleCreateSession}
          courseId={courseId!}
        />
      )}

      {activeTab === 'stats' && (
        <AttendanceStats courseId={courseId!} />
      )}
    </div>
  );
};
