import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';

export const StudentCheckIn: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !studentEmail.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const checkInResult = await attendanceService.studentCheckIn(token, studentEmail.trim());
      setResult(checkInResult);
    } catch (err: any) {
      setError(err.message || 'Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return '✅';
      case 'tardy':
        return '⏰';
      case 'absent':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'tardy':
        return 'warning';
      case 'absent':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (result && result.success) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className={`card border-${getStatusColor(result.status)}`}>
              <div className="card-header bg-success text-white text-center">
                <h4 className="mb-0">
                  {getStatusIcon(result.status)} Check-in Successful!
                </h4>
              </div>
              <div className="card-body text-center">
                <div className="mb-3">
                  <h5>Status: <span className={`badge bg-${getStatusColor(result.status)}`}>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span></h5>
                </div>
                
                <p className="text-muted">{result.message}</p>
                
                {result.record && (
                  <div className="mt-3">
                    <small className="text-muted">
                      Check-in time: {new Date(result.record.check_in_time).toLocaleString()}
                    </small>
                  </div>
                )}

                <div className="mt-4">
                  <div className="alert alert-info">
                    <small>
                      <strong>What happens next?</strong><br />
                      Your attendance has been recorded. You can close this page now.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white text-center">
              <h4 className="mb-0">📋 Class Check-in</h4>
            </div>
            <div className="card-body">
              {!token ? (
                <div className="alert alert-danger">
                  <strong>Invalid check-in link</strong><br />
                  This check-in link is invalid or has expired. Please contact your teacher for a new link.
                </div>
              ) : (
                <>
                  <div className="mb-4 text-center">
                    <p className="text-muted">
                      Enter your email address to check in for class.
                    </p>
                  </div>

                  <form onSubmit={handleCheckIn}>
                    <div className="mb-3">
                      <label htmlFor="studentEmail" className="form-label">
                        Student Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="studentEmail"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="your.email@school.edu"
                        required
                        disabled={loading}
                      />
                      <div className="form-text">
                        Use the same email address associated with your Google Classroom account.
                      </div>
                    </div>

                    {error && (
                      <div className="alert alert-danger">
                        <strong>Check-in failed:</strong><br />
                        {error}
                      </div>
                    )}

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !studentEmail.trim()}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Checking in...
                          </>
                        ) : (
                          '✅ Check In'
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="mt-4">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title">💡 How it works</h6>
                        <ul className="small mb-0">
                          <li>Enter your student email address</li>
                          <li>Click "Check In" to record your attendance</li>
                          <li>Your status will be determined by the current time:
                            <ul className="mt-1">
                              <li><span className="badge bg-success">Present</span> - On time</li>
                              <li><span className="badge bg-warning">Tardy</span> - A few minutes late</li>
                              <li><span className="badge bg-danger">Absent</span> - Very late</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
