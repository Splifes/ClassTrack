import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { useProgressMetrics } from '../../hooks/useProgressMetrics'
import { useRiskFlags, useHighRiskStudents } from '../../hooks/useRiskFlags'
import { api } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui'
import { Badge } from '../../components/ui'

export default function CoordinatorDashboard() {
  const { user } = useAuth()
  const { data: courses, loading: coursesLoading } = useApi(() => api.getCourses())
  const { data: students, loading: studentsLoading } = useApi(() => api.getAllStudents())
  
  // Use domain hooks for metrics
  const progressMetrics = useProgressMetrics()
  const riskMetrics = useRiskFlags()
  const highRiskStudents = useHighRiskStudents(5)

  const getGlobalStats = () => {
    const totalCourses = courses?.length || 0
    const activeCourses = courses?.filter(c => c.courseState === 'ACTIVE').length || 0
    const totalStudents = students?.length || 0
    
    // Mock additional stats
    const totalTeachers = 15
    const pendingReviews = 8
    const systemAlerts = 3
    
    return { totalCourses, activeCourses, totalStudents, totalTeachers, pendingReviews, systemAlerts }
  }

  const getSystemAlerts = () => {
    // Mock system alerts
    return [
      { id: '1', type: 'warning', message: 'Low attendance in Mathematics course', course: 'Mathematics', date: '2024-01-10' },
      { id: '2', type: 'info', message: 'New teacher registration pending approval', date: '2024-01-09' },
      { id: '3', type: 'danger', message: 'Multiple late submissions in History course', course: 'History', date: '2024-01-08' }
    ]
  }

  const stats = getGlobalStats()
  const systemAlerts = getSystemAlerts()

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-2">Coordinator Dashboard</h1>
          <p className="text-muted">System overview and management - Welcome, {user?.name}!</p>
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

      {/* Global Stats */}
      <div className="row mb-4">
        <div className="col-md-2 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Courses</h5>
              <h2 className="card-text">
                {coursesLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  stats.totalCourses
                )}
              </h2>
              <Link to="/courses" className="btn btn-outline-primary btn-sm">
                Manage
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">Active Courses</h5>
              <h2 className="card-text">
                {coursesLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  stats.activeCourses
                )}
              </h2>
              <small className="text-muted">Running now</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info">Total Students</h5>
              <h2 className="card-text">
                {studentsLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  stats.totalStudents
                )}
              </h2>
              <Link to="/students" className="btn btn-outline-info btn-sm">
                View All
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-secondary">Teachers</h5>
              <h2 className="card-text">{stats.totalTeachers}</h2>
              <small className="text-muted">Active faculty</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">Pending Reviews</h5>
              <h2 className="card-text">{stats.pendingReviews}</h2>
              <small className="text-muted">Require attention</small>
            </div>
          </div>
        </div>
        
        <div className="col-md-2 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-danger">System Alerts</h5>
              <h2 className="card-text">{stats.systemAlerts}</h2>
              <small className="text-muted">Active issues</small>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Metrics */}
      {progressMetrics && 'global' in progressMetrics && (
        <div className="row mb-4">
          <div className="col-md-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Progress Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="row text-center">
                  <div className="col-6">
                    <h3 className="text-success">{progressMetrics.global.onTimePercentage.toFixed(1)}%</h3>
                    <small className="text-muted">On-time Submissions</small>
                  </div>
                  <div className="col-6">
                    <h3 className="text-info">{progressMetrics.global.completionRate.toFixed(1)}%</h3>
                    <small className="text-muted">Completion Rate</small>
                  </div>
                </div>
                <hr />
                <div className="small">
                  <div>Total Submissions: <strong>{progressMetrics.global.totalSubmissions}</strong></div>
                  <div>On Time: <strong>{progressMetrics.global.onTimeSubmissions}</strong></div>
                  <div>Late: <strong>{progressMetrics.global.lateSubmissions}</strong></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                {riskMetrics ? (
                  <>
                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <h4 className="text-danger">{riskMetrics.highRisk}</h4>
                        <small className="text-muted">High Risk</small>
                      </div>
                      <div className="col-4">
                        <h4 className="text-warning">{riskMetrics.mediumRisk}</h4>
                        <small className="text-muted">Medium Risk</small>
                      </div>
                      <div className="col-4">
                        <h4 className="text-success">{riskMetrics.lowRisk}</h4>
                        <small className="text-muted">Low Risk</small>
                      </div>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${(riskMetrics.lowRisk / riskMetrics.totalStudents) * 100}%` }}
                      />
                      <div 
                        className="progress-bar bg-warning" 
                        style={{ width: `${(riskMetrics.mediumRisk / riskMetrics.totalStudents) * 100}%` }}
                      />
                      <div 
                        className="progress-bar bg-danger" 
                        style={{ width: `${(riskMetrics.highRisk / riskMetrics.totalStudents) * 100}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        <div className="col-md-8 mb-4">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle>High-Risk Students</CardTitle>
              <Link to="/students" className="btn btn-outline-primary btn-sm">View All Students</Link>
            </CardHeader>
            <CardContent>
              {highRiskStudents.length > 0 ? (
                <div className="list-group list-group-flush">
                  {highRiskStudents.map(student => (
                    <div key={`${student.courseId}-${student.studentId}`} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{student.studentName}</h6>
                          <p className="mb-1 text-muted small">{student.courseName}</p>
                          <div className="mb-1">
                            {student.reasons.slice(0, 2).map((reason, idx) => (
                              <small key={idx} className="text-muted d-block">• {reason}</small>
                            ))}
                          </div>
                        </div>
                        <div className="text-end">
                          <Badge variant={student.riskLevel === 'high' ? 'danger' : 'warning'}>
                            {student.riskLevel} risk
                          </Badge>
                          <div className="small text-muted mt-1">
                            Score: {student.score}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No high-risk students identified.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">System Alerts</h5>
              <button className="btn btn-outline-primary btn-sm">View All</button>
            </div>
            <div className="card-body">
              {systemAlerts.length > 0 ? (
                <div className="list-group list-group-flush">
                  {systemAlerts.map(alert => (
                    <div key={alert.id} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex">
                          <div className="me-3">
                            {alert.type === 'warning' && (
                              <svg width="20" height="20" fill="orange" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                              </svg>
                            )}
                            {alert.type === 'info' && (
                              <svg width="20" height="20" fill="blue" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                              </svg>
                            )}
                            {alert.type === 'danger' && (
                              <svg width="20" height="20" fill="red" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                              </svg>
                            )}
                          </div>
                          <div>
                            <h6 className="mb-1">{alert.message}</h6>
                            {alert.course && (
                              <p className="mb-1 text-muted small">Course: {alert.course}</p>
                            )}
                            <small className="text-muted">
                              {new Date(alert.date).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm">
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No active alerts.</p>
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
                  Manage All Courses
                </Link>
                <Link to="/students" className="btn btn-outline-primary">
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002A.274.274 0 0 1 15 13H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                  </svg>
                  View All Students
                </Link>
                <button className="btn btn-outline-success" disabled>
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm0 1v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4H1zm6 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                  </svg>
                  Global Reports (Coming Soon)
                </button>
                <button className="btn btn-outline-warning" disabled>
                  <svg width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                  </svg>
                  System Settings (Coming Soon)
                </button>
              </div>
              
              <hr />
              
              <div className="text-center">
                <small className="text-muted">
                  Role: <span className="badge bg-danger">Coordinator</span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
