import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { data: courses, loading: coursesLoading } = useApi(() => api.getCourses())
  const { data: students, loading: studentsLoading } = useApi(() => api.getAllStudents())

  // Filter courses where user is teacher (in real app would check teacher status)
  const teachingCourses = courses?.filter(course => 
    course.courseState === 'ACTIVE'
  ) || []

  const getRecentSubmissions = () => {
    // Mock recent submissions - in real app would fetch from API
    return [
      { id: '1', student: 'John Doe', assignment: 'Math Quiz 1', course: 'Mathematics', submitted: '2024-01-10', status: 'pending' },
      { id: '2', student: 'Jane Smith', assignment: 'History Essay', course: 'History', submitted: '2024-01-09', status: 'graded' },
      { id: '3', student: 'Bob Johnson', assignment: 'Science Lab', course: 'Science', submitted: '2024-01-08', status: 'late' }
    ]
  }

  const recentSubmissions = getRecentSubmissions()
  const totalStudents = students?.length || 0
  const pendingGrading = recentSubmissions.filter(s => s.status === 'pending').length

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-2">Teacher Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.name}!</p>
        </div>
        {user?.picture && (
          <img 
            src={user.picture} 
            alt={user.name} 
            className="rounded-circle" 
            width="64" 
            height="64" 
          />
        )}
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">My Courses</h5>
              <h2 className="card-text">
                {coursesLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  teachingCourses.length
                )}
              </h2>
              <Link to="/courses" className="btn btn-outline-primary btn-sm">
                Manage
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info">Total Students</h5>
              <h2 className="card-text">
                {studentsLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  totalStudents
                )}
              </h2>
              <Link to="/students" className="btn btn-outline-info btn-sm">
                View All
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">Pending Grading</h5>
              <h2 className="card-text">{pendingGrading}</h2>
              <small className="text-muted">Submissions</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">This Week</h5>
              <h2 className="card-text">8</h2>
              <small className="text-muted">Assignments graded</small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Submissions</h5>
              <button className="btn btn-outline-primary btn-sm">View All</button>
            </div>
            <div className="card-body">
              {recentSubmissions.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Assignment</th>
                        <th>Course</th>
                        <th>Submitted</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSubmissions.map(submission => (
                        <tr key={submission.id}>
                          <td>{submission.student}</td>
                          <td>{submission.assignment}</td>
                          <td>{submission.course}</td>
                          <td>{new Date(submission.submitted).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              submission.status === 'graded' ? 'bg-success' :
                              submission.status === 'pending' ? 'bg-warning' :
                              submission.status === 'late' ? 'bg-danger' :
                              'bg-secondary'
                            }`}>
                              {submission.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No recent submissions.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/courses" className="btn btn-primary">
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                  </svg>
                  Manage Courses
                </Link>
                <Link to="/students" className="btn btn-outline-primary">
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002A.274.274 0 0 1 15 13H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                  </svg>
                  View Students
                </Link>
                <button className="btn btn-outline-success" disabled>
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                  </svg>
                  Attendance (Coming Soon)
                </button>
                <button className="btn btn-outline-info" disabled>
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                  </svg>
                  Reports (Coming Soon)
                </button>
              </div>
              
              <hr />
              
              <div className="text-center">
                <small className="text-muted">
                  Role: <span className="badge bg-success">Teacher</span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
