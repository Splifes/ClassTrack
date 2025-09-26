import React, { useState, useEffect } from 'react';
import { AttendanceSession, SessionRoster, AttendanceRecord, CheckInToken, attendanceService } from '../../../services/attendanceService';

interface AttendanceSessionViewProps {
  session: AttendanceSession;
  onBack: () => void;
}

export const AttendanceSessionView: React.FC<AttendanceSessionViewProps> = ({
  session,
  onBack
}) => {
  const [roster, setRoster] = useState<SessionRoster | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkInToken, setCheckInToken] = useState<CheckInToken | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'checkin'>('roster');

  useEffect(() => {
    loadRoster();
  }, [session.session_id]);

  const loadRoster = async () => {
    if (!session.session_id) return;

    try {
      setLoading(true);
      setError(null);
      const rosterData = await attendanceService.getSessionRoster(session.session_id);
      setRoster(rosterData);
    } catch (err) {
      setError('Failed to load session roster');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, status: string, notes: string = '') => {
    if (!roster) return;

    const updatedRoster = {
      ...roster,
      roster: roster.roster.map(record =>
        record.student_id === studentId
          ? { ...record, attendance_status: status as any, notes }
          : record
      )
    };

    setRoster(updatedRoster);
  };

  const handleSaveAttendance = async () => {
    if (!roster || !session.session_id) return;

    setSaving(true);
    try {
      const records = roster.roster
        .filter(r => r.attendance_status !== 'not_marked')
        .map(r => ({
          student_id: r.student_id,
          status: r.attendance_status as 'present' | 'tardy' | 'absent' | 'excused',
          notes: r.notes || ''
        }));

      await attendanceService.markAttendance(session.session_id, records);
      
      // Reload roster to get updated data
      await loadRoster();
      
      alert('Attendance saved successfully!');
    } catch (err) {
      setError('Failed to save attendance');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCheckIn = async () => {
    if (!session.session_id) return;

    try {
      const token = await attendanceService.generateCheckInToken(session.session_id, 60);
      setCheckInToken(token);
    } catch (err) {
      setError('Failed to generate check-in token');
      console.error(err);
    }
  };

  const copyCheckInLink = () => {
    if (!checkInToken) return;
    
    const fullUrl = `${window.location.origin}/check-in/${checkInToken.token}`;
    navigator.clipboard.writeText(fullUrl);
    alert('Check-in link copied to clipboard!');
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid mt-3">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading session data...</span>
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
          <button className="btn btn-outline-danger btn-sm ms-2" onClick={loadRoster}>
            Retry
          </button>
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Sessions
        </button>
      </div>
    );
  }

  if (!roster) {
    return (
      <div className="container-fluid mt-3">
        <div className="alert alert-warning">
          No roster data available for this session.
        </div>
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <button className="btn btn-outline-secondary btn-sm mb-2" onClick={onBack}>
            ← Back to Sessions
          </button>
          <h2>{roster.session.title}</h2>
          <p className="text-muted mb-1">
            📅 {formatDateTime(roster.session.start_time)}
          </p>
          <p className="text-muted">
            Session ID: {roster.session.session_id}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={handleSaveAttendance}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              '💾 Save Attendance'
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">{roster.summary.total}</h5>
              <p className="card-text">Total Students</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">{roster.summary.present}</h5>
              <p className="card-text">Present</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">{roster.summary.tardy}</h5>
              <p className="card-text">Tardy</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-danger">{roster.summary.absent}</h5>
              <p className="card-text">Absent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'roster' ? 'active' : ''}`}
            onClick={() => setActiveTab('roster')}
          >
            📋 Attendance Roster
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'checkin' ? 'active' : ''}`}
            onClick={() => setActiveTab('checkin')}
          >
            📱 Student Check-in
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'roster' && (
        <AttendanceRosterTab
          roster={roster.roster}
          onAttendanceChange={handleAttendanceChange}
        />
      )}

      {activeTab === 'checkin' && (
        <CheckInTab
          checkInToken={checkInToken}
          onGenerateToken={handleGenerateCheckIn}
          onCopyLink={copyCheckInLink}
        />
      )}
    </div>
  );
};

interface AttendanceRosterTabProps {
  roster: AttendanceRecord[];
  onAttendanceChange: (studentId: string, status: string, notes: string) => void;
}

const AttendanceRosterTab: React.FC<AttendanceRosterTabProps> = ({
  roster,
  onAttendanceChange
}) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Check-in Time</th>
                <th>Method</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((record) => (
                <AttendanceRow
                  key={record.student_id}
                  record={record}
                  onAttendanceChange={onAttendanceChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface AttendanceRowProps {
  record: AttendanceRecord;
  onAttendanceChange: (studentId: string, status: string, notes: string) => void;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({
  record,
  onAttendanceChange
}) => {
  const [notes, setNotes] = useState(record.notes || '');
  const [showNotes, setShowNotes] = useState(false);

  const getStatusBadge = (status: string) => {
    const config = {
      'present': { class: 'bg-success', icon: '✅', text: 'Present' },
      'tardy': { class: 'bg-warning', icon: '⏰', text: 'Tardy' },
      'absent': { class: 'bg-danger', icon: '❌', text: 'Absent' },
      'excused': { class: 'bg-info', icon: '📝', text: 'Excused' },
      'not_marked': { class: 'bg-secondary', icon: '❓', text: 'Not Marked' }
    };

    const statusConfig = config[status as keyof typeof config] || config.not_marked;
    return (
      <span className={`badge ${statusConfig.class}`}>
        {statusConfig.icon} {statusConfig.text}
      </span>
    );
  };

  const handleStatusChange = (newStatus: string) => {
    onAttendanceChange(record.student_id, newStatus, notes);
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onAttendanceChange(record.student_id, record.attendance_status, newNotes);
  };

  return (
    <tr>
      <td>
        <div className="d-flex align-items-center">
          {record.photo_url && (
            <img
              src={record.photo_url}
              alt={record.student_name}
              className="rounded-circle me-2"
              width="32"
              height="32"
            />
          )}
          <div>
            <div className="fw-medium">{record.student_name}</div>
            <small className="text-muted">{record.student_email}</small>
          </div>
        </div>
      </td>
      <td>{getStatusBadge(record.attendance_status)}</td>
      <td>
        {record.check_in_time ? (
          <small>{new Date(record.check_in_time).toLocaleTimeString()}</small>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>
      <td>
        {record.method ? (
          <small className="text-muted">{record.method.replace('_', ' ')}</small>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>
      <td>
        {showNotes ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            onBlur={() => setShowNotes(false)}
            onKeyPress={(e) => e.key === 'Enter' && setShowNotes(false)}
            autoFocus
          />
        ) : (
          <span
            className="text-muted"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowNotes(true)}
          >
            {notes || 'Add note...'}
          </span>
        )}
      </td>
      <td>
        <div className="btn-group btn-group-sm">
          <button
            className="btn btn-outline-success"
            onClick={() => handleStatusChange('present')}
            title="Mark Present"
          >
            ✅
          </button>
          <button
            className="btn btn-outline-warning"
            onClick={() => handleStatusChange('tardy')}
            title="Mark Tardy"
          >
            ⏰
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => handleStatusChange('absent')}
            title="Mark Absent"
          >
            ❌
          </button>
          <button
            className="btn btn-outline-info"
            onClick={() => handleStatusChange('excused')}
            title="Mark Excused"
          >
            📝
          </button>
        </div>
      </td>
    </tr>
  );
};

interface CheckInTabProps {
  checkInToken: CheckInToken | null;
  onGenerateToken: () => void;
  onCopyLink: () => void;
}

const CheckInTab: React.FC<CheckInTabProps> = ({
  checkInToken,
  onGenerateToken,
  onCopyLink
}) => {
  return (
    <div className="row">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">📱 Student Self Check-in</h5>
          </div>
          <div className="card-body">
            {!checkInToken ? (
              <div className="text-center py-4">
                <p className="text-muted mb-3">
                  Generate a check-in token to allow students to mark their own attendance.
                </p>
                <button className="btn btn-primary" onClick={onGenerateToken}>
                  🔗 Generate Check-in Link
                </button>
              </div>
            ) : (
              <div>
                <div className="alert alert-success">
                  <strong>Check-in link generated!</strong>
                  <br />
                  Students can use this link to check in for the next {checkInToken.expires_in_minutes} minutes.
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Check-in URL:</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={`${window.location.origin}/check-in/${checkInToken.token}`}
                      readOnly
                    />
                    <button className="btn btn-outline-secondary" onClick={onCopyLink}>
                      📋 Copy
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-success" onClick={onGenerateToken}>
                    🔄 Generate New Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">💡 How it works</h6>
          </div>
          <div className="card-body">
            <ol className="small">
              <li>Generate a secure check-in link</li>
              <li>Share the link with students (via email, LMS, etc.)</li>
              <li>Students click the link and enter their email</li>
              <li>System automatically marks attendance based on timing</li>
              <li>Late arrivals are marked as "tardy"</li>
            </ol>
            
            <div className="mt-3">
              <strong>Security:</strong>
              <ul className="small mt-1">
                <li>Links expire after 60 minutes</li>
                <li>Each student can only check in once</li>
                <li>Timing is automatically calculated</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
