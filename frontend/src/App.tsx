import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useMockAuth } from './hooks/useMockAuth'
import { useNotificationTriggers } from './hooks/useNotificationTriggers'
import { RoleGuard } from './components/guards/RoleGuard'
import { NotificationBell } from './components/notifications/NotificationBell'
import Dashboard from './routes/Dashboard'
import Students from './routes/Students'
import Courses from './routes/Courses';
import StudentCoursesPage from './routes/courses/StudentCoursesPage';
import TeacherCoursesPage from './routes/courses/TeacherCoursesPage';
import CoordinatorCoursesPage from './routes/courses/CoordinatorCoursesPage';
import CourseDetail from './routes/CourseDetail'
import ClassDetail from './routes/ClassDetail'
import AuthCallback from './routes/AuthCallback'
import Reports from './routes/Reports'
import StudentDashboard from './routes/StudentDashboard'
import TeacherDashboard from './routes/TeacherDashboard'
import CoordinatorDashboard from './routes/CoordinatorDashboard'
import HomeRedirector from './routes/HomeRedirector'
import SettingsPage from './pages/SettingsPage'
import WhatsappAdminPage from './pages/WhatsappAdminPage'
import { AttendancePage } from './features/attendance'
import { StudentCheckIn } from './pages/StudentCheckIn'

export default function App() {
  // Use mock auth in development, real auth in production
  const useDevelopmentAuth = import.meta.env.VITE_APP_ENV === 'development'
  const realAuth = useAuth()
  const mockAuth = useMockAuth()
  
  const { user, loading, isAuthenticated, login, logout, setRole } = useDevelopmentAuth ? mockAuth : realAuth
  
  // Initialize notification triggers
  useNotificationTriggers()

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">ClassTrack</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {isAuthenticated && (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/courses">
                    {user?.role === 'student' ? 'My Courses' : 'Courses'}
                  </NavLink>
                </li>
                {(user?.role === 'teacher' || user?.role === 'coordinator') && (
                  <li className="nav-item">
                    <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/students">
                      Students
                    </NavLink>
                  </li>
                )}
                {user?.role === 'coordinator' && (
                  <>
                    <li className="nav-item">
                      <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/reports">
                        Reports
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/attendance">
                        Attendance
                      </NavLink>
                    </li>
                  </>
                )}
                {/* Hardcoded access for testing - remove in production */}
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''} text-warning`} to="/coordinator-dashboard">
                    🔧 Coordinator Panel (TEST)
                  </NavLink>
                </li>
              </ul>
            )}
            <div className="d-flex align-items-center">
              {isAuthenticated ? (
                <div className="d-flex align-items-center">
                  {user?.picture && (
                    <img src={user.picture} alt={user.name} className="rounded-circle me-2" width="32" height="32" />
                  )}
                  <div className="me-3">
                    <span className="navbar-text d-block">{user?.name}</span>
                    <small className="text-muted">
                      Role: <span className={`badge ${user?.role === 'coordinator' ? 'bg-danger' : user?.role === 'teacher' ? 'bg-success' : 'bg-info'}`}>
                        {user?.role}
                      </span>
                    </small>
                  </div>
                  {import.meta.env.VITE_APP_ENV === 'development' && (
                    <select 
                      className="form-select form-select-sm me-2" 
                      style={{ width: 'auto' }}
                      value={user?.role || 'student'}
                      onChange={(e) => { setRole(e.target.value as any); window.location.reload(); }}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="coordinator">Coordinator</option>
                    </select>
                  )}
                  <NotificationBell />
                  <div className="nav-item dropdown ms-2">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="bi bi-gear"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger" 
                          onClick={logout}
                          disabled={loading}
                        >
                          {loading ? 'Logging out...' : 'Logout'}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={login}>
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {useDevelopmentAuth && (
        <div className="alert alert-info alert-dismissible fade show m-0 rounded-0" role="alert">
          <div className="container-fluid">
            <strong>🚧 Development Mode:</strong> Using mock authentication.
          </div>
        </div>
      )}

      <main className="py-4 flex-grow-1">
        <div className="container">
          {!isAuthenticated ? (
            <div className="text-center py-5">
              <h1>Welcome to ClassTrack</h1>
              <p className="lead">Please login to continue.</p>
              <button className="btn btn-primary btn-lg" onClick={login}>
                Login with Google
              </button>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<HomeRedirector />} />
              <Route path="/students" element={<RoleGuard allowed={['teacher', 'coordinator']}><Students /></RoleGuard>} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/student" element={<StudentCoursesPage />} />
              <Route path="/courses/teacher" element={<RoleGuard allowed={['teacher', 'coordinator']}><TeacherCoursesPage /></RoleGuard>} />
              <Route path="/courses/coordinator" element={<RoleGuard allowed={['coordinator']}><CoordinatorCoursesPage /></RoleGuard>} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              <Route path="/courses/:courseId/classes/:classId" element={<ClassDetail />} />
              <Route path="/reports" element={<RoleGuard allowed={['coordinator']}><Reports /></RoleGuard>} />
              <Route path="/courses/:courseId/attendance" element={<RoleGuard allowed={['teacher', 'coordinator']}><AttendancePage /></RoleGuard>} />
              <Route path="/check-in/:token" element={<StudentCheckIn />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/coordinator-dashboard" element={<CoordinatorDashboard />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin/whatsapp" element={<WhatsappAdminPage />} />
            </Routes>
          )}
        </div>
      </main>

      <footer className="border-top py-3 mt-auto">
        <div className="container text-center text-muted small">
          © {new Date().getFullYear()} ClassTrack
        </div>
      </footer>
    </div>
  )
}
