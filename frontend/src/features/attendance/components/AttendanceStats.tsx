import React, { useState, useEffect } from 'react';
import { CourseAttendanceSummary, StudentAttendanceStats, attendanceService } from '../../../services/attendanceService';

interface AttendanceStatsProps {
  courseId: string;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ courseId }) => {
  const [summary, setSummary] = useState<CourseAttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'attendance_rate' | 'present' | 'absent'>('attendance_rate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterThreshold, setFilterThreshold] = useState<number>(0);

  useEffect(() => {
    loadSummary();
  }, [courseId]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const summaryData = await attendanceService.getCourseAttendanceSummary(courseId);
      setSummary(summaryData);
    } catch (err) {
      setError('Failed to load attendance statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const exportData = await attendanceService.exportCourseAttendance(courseId);
      
      // Create and download JSON file (in production, this would be CSV)
      const dataStr = JSON.stringify(exportData.export_data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance-${courseId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export attendance data');
      console.error(err);
    }
  };

  const sortedAndFilteredStudents = React.useMemo(() => {
    if (!summary) return [];

    let filtered = summary.student_statistics.filter(
      student => student.attendance_rate >= filterThreshold
    );

    return filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'name':
          // We don't have student names in the stats, so sort by student_id
          aValue = a.student_id;
          bValue = b.student_id;
          break;
        case 'attendance_rate':
          aValue = a.attendance_rate;
          bValue = b.attendance_rate;
          break;
        case 'present':
          aValue = a.present;
          bValue = b.present;
          break;
        case 'absent':
          aValue = a.absent;
          bValue = b.absent;
          break;
        default:
          aValue = a.attendance_rate;
          bValue = b.attendance_rate;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [summary, sortBy, sortOrder, filterThreshold]);

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-success';
    if (rate >= 80) return 'text-warning';
    if (rate >= 70) return 'text-orange';
    return 'text-danger';
  };

  const getAttendanceRateBackground = (rate: number) => {
    if (rate >= 90) return 'bg-success';
    if (rate >= 80) return 'bg-warning';
    if (rate >= 70) return 'bg-orange';
    return 'bg-danger';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button className="btn btn-outline-danger btn-sm ms-2" onClick={loadSummary}>
          Retry
        </button>
      </div>
    );
  }

  if (!summary || summary.student_statistics.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <i className="bi bi-graph-up" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
        </div>
        <h5 className="text-muted">No attendance data available</h5>
        <p className="text-muted">
          Attendance statistics will appear here once you start taking attendance.
        </p>
      </div>
    );
  }

  const overallStats = {
    totalSessions: summary.total_sessions,
    totalStudents: summary.student_statistics.length,
    averageAttendanceRate: summary.student_statistics.length > 0 
      ? Math.round(summary.student_statistics.reduce((sum, s) => sum + s.attendance_rate, 0) / summary.student_statistics.length)
      : 0,
    studentsAtRisk: summary.student_statistics.filter(s => s.attendance_rate < 70).length
  };

  return (
    <div>
      {/* Overall Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h4 className="card-title text-primary">{overallStats.totalSessions}</h4>
              <p className="card-text">Total Sessions</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h4 className="card-title text-info">{overallStats.totalStudents}</h4>
              <p className="card-text">Students</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h4 className={`card-title ${getAttendanceRateColor(overallStats.averageAttendanceRate)}`}>
                {overallStats.averageAttendanceRate}%
              </h4>
              <p className="card-text">Average Attendance</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h4 className="card-title text-danger">{overallStats.studentsAtRisk}</h4>
              <p className="card-text">At Risk (&lt;70%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="form-label">Sort by:</label>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="attendance_rate">Attendance Rate</option>
                <option value="name">Student ID</option>
                <option value="present">Present Count</option>
                <option value="absent">Absent Count</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Order:</label>
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Min Attendance Rate:</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="100"
                value={filterThreshold}
                onChange={(e) => setFilterThreshold(Number(e.target.value))}
              />
              <small className="text-muted">{filterThreshold}%</small>
            </div>
            <div className="col-md-2">
              <label className="form-label">&nbsp;</label>
              <button className="btn btn-success w-100" onClick={handleExport}>
                📊 Export Data
              </button>
            </div>
            <div className="col-md-2">
              <label className="form-label">&nbsp;</label>
              <button className="btn btn-outline-primary w-100" onClick={loadSummary}>
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Statistics Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            📊 Student Attendance Statistics 
            <span className="badge bg-secondary ms-2">
              {sortedAndFilteredStudents.length} students
            </span>
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Sessions</th>
                  <th>Present</th>
                  <th>Tardy</th>
                  <th>Absent</th>
                  <th>Excused</th>
                  <th>Attendance Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredStudents.map((student) => (
                  <StudentStatsRow key={student.student_id} student={student} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Attendance Rate Distribution */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">📈 Attendance Rate Distribution</h6>
            </div>
            <div className="card-body">
              <AttendanceDistribution students={summary.student_statistics} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">⚠️ Students Needing Attention</h6>
            </div>
            <div className="card-body">
              <AtRiskStudents students={summary.student_statistics} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StudentStatsRowProps {
  student: StudentAttendanceStats;
}

const StudentStatsRow: React.FC<StudentStatsRowProps> = ({ student }) => {
  const getStatusBadge = (rate: number) => {
    if (rate >= 90) return <span className="badge bg-success">Excellent</span>;
    if (rate >= 80) return <span className="badge bg-warning">Good</span>;
    if (rate >= 70) return <span className="badge bg-orange text-dark">Fair</span>;
    return <span className="badge bg-danger">At Risk</span>;
  };

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return 'text-success';
    if (rate >= 80) return 'text-warning';
    if (rate >= 70) return 'text-orange';
    return 'text-danger';
  };

  return (
    <tr>
      <td>
        <code className="small">{student.student_id}</code>
      </td>
      <td>{student.total_sessions}</td>
      <td>
        <span className="badge bg-success">{student.present}</span>
      </td>
      <td>
        <span className="badge bg-warning">{student.tardy}</span>
      </td>
      <td>
        <span className="badge bg-danger">{student.absent}</span>
      </td>
      <td>
        <span className="badge bg-info">{student.excused}</span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
            <div
              className={`progress-bar ${student.attendance_rate >= 90 ? 'bg-success' : 
                student.attendance_rate >= 80 ? 'bg-warning' : 
                student.attendance_rate >= 70 ? 'bg-orange' : 'bg-danger'}`}
              style={{ width: `${student.attendance_rate}%` }}
            ></div>
          </div>
          <span className={`fw-bold ${getAttendanceRateColor(student.attendance_rate)}`}>
            {student.attendance_rate}%
          </span>
        </div>
      </td>
      <td>{getStatusBadge(student.attendance_rate)}</td>
    </tr>
  );
};

interface AttendanceDistributionProps {
  students: StudentAttendanceStats[];
}

const AttendanceDistribution: React.FC<AttendanceDistributionProps> = ({ students }) => {
  const distribution = {
    excellent: students.filter(s => s.attendance_rate >= 90).length,
    good: students.filter(s => s.attendance_rate >= 80 && s.attendance_rate < 90).length,
    fair: students.filter(s => s.attendance_rate >= 70 && s.attendance_rate < 80).length,
    atRisk: students.filter(s => s.attendance_rate < 70).length
  };

  const total = students.length;

  return (
    <div>
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small>Excellent (90-100%)</small>
          <small>{distribution.excellent} students</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${total > 0 ? (distribution.excellent / total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small>Good (80-89%)</small>
          <small>{distribution.good} students</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-warning"
            style={{ width: `${total > 0 ? (distribution.good / total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small>Fair (70-79%)</small>
          <small>{distribution.fair} students</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-orange"
            style={{ width: `${total > 0 ? (distribution.fair / total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small>At Risk (&lt;70%)</small>
          <small>{distribution.atRisk} students</small>
        </div>
        <div className="progress mb-2" style={{ height: '8px' }}>
          <div
            className="progress-bar bg-danger"
            style={{ width: `${total > 0 ? (distribution.atRisk / total) * 100 : 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

interface AtRiskStudentsProps {
  students: StudentAttendanceStats[];
}

const AtRiskStudents: React.FC<AtRiskStudentsProps> = ({ students }) => {
  const atRiskStudents = students
    .filter(s => s.attendance_rate < 80)
    .sort((a, b) => a.attendance_rate - b.attendance_rate);

  if (atRiskStudents.length === 0) {
    return (
      <div className="text-center text-muted">
        <div className="mb-2">🎉</div>
        <p>All students have good attendance!</p>
      </div>
    );
  }

  return (
    <div>
      {atRiskStudents.slice(0, 10).map((student) => (
        <div key={student.student_id} className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <code className="small">{student.student_id}</code>
            <br />
            <small className="text-muted">
              {student.present}P / {student.tardy}T / {student.absent}A
            </small>
          </div>
          <span className={`badge ${student.attendance_rate < 70 ? 'bg-danger' : 'bg-warning'}`}>
            {student.attendance_rate}%
          </span>
        </div>
      ))}
      {atRiskStudents.length > 10 && (
        <small className="text-muted">
          ... and {atRiskStudents.length - 10} more students
        </small>
      )}
    </div>
  );
};
