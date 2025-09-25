import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data: courses, loading: coursesLoading } = useApi(() => api.getCourses())

  // Filter courses where user is enrolled as student
  const enrolledCourses = courses?.filter(course => 
    // In real app, this would check enrollment status
    course.courseState === 'ACTIVE'
  ) || []

  const getUpcomingAssignments = () => {
    // Mock upcoming assignments - in real app would fetch from API
    return [
      { id: '1', title: 'Math Homework Chapter 5', course: 'Mathematics', dueDate: '2024-01-15' },
      { id: '2', title: 'History Essay', course: 'History', dueDate: '2024-01-18' },
      { id: '3', title: 'Science Lab Report', course: 'Science', dueDate: '2024-01-20' }
    ]
  }

  const upcomingAssignments = getUpcomingAssignments()

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-2">Student Dashboard</h1>
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
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">My Courses</h5>
              <h2 className="card-text">
                {coursesLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  enrolledCourses.length
                )}
              </h2>
              <Link to="/courses" className="btn btn-outline-primary btn-sm">
                View All
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">Pending Tasks</h5>
              <h2 className="card-text">{upcomingAssignments.length}</h2>
              <small className="text-muted">Due this week</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">Completed</h5>
              <h2 className="card-text">12</h2>
              <small className="text-muted">This month</small>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Upcoming Assignments</h5>
            </div>
            <div className="card-body">
              {upcomingAssignments.length > 0 ? (
                <div className="list-group list-group-flush">
                  {upcomingAssignments.map(assignment => (
                    <div key={assignment.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{assignment.title}</h6>
                          <p className="mb-1 text-muted small">{assignment.course}</p>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </small>
                          <br />
                          <span className="badge bg-warning">Pending</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No upcoming assignments.</p>
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
                  My Courses
                </Link>
                <button className="btn btn-outline-secondary" disabled>
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                  </svg>
                  Attendance (Coming Soon)
                </button>
                <button className="btn btn-outline-info" disabled>
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  </svg>
                  Messages (Coming Soon)
                </button>
              </div>
              
              <hr />
              
              <div className="text-center">
                <small className="text-muted">
                  Role: <span className="badge bg-info">Student</span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
