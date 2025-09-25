import { useAuth } from '../hooks/useAuth'
import StudentDashboard from './dashboards/StudentDashboard'
import TeacherDashboard from './dashboards/TeacherDashboard'
import CoordinatorDashboard from './dashboards/CoordinatorDashboard'

export default function Dashboard() {
  const { user, userRole } = useAuth()

  if (!user || !userRole) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  // Render role-specific dashboard
  switch (userRole) {
    case 'student':
      return <StudentDashboard />
    case 'teacher':
      return <TeacherDashboard />
    case 'coordinator':
      return <CoordinatorDashboard />
    default:
      return (
        <div className="container py-5">
          <div className="alert alert-warning text-center">
            <h4>Unknown Role</h4>
            <p>Your role "{userRole}" is not recognized. Please contact support.</p>
          </div>
        </div>
      )
  }
}
