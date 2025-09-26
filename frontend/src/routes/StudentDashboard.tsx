import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';

interface QuickSummary {
  totalCourses: number;
  activeCourses: number;
  totalPendingAssignments: number;
  nextDeadline: any;
  overallStatus: string;
}

interface UpcomingDeadline {
  courseId: string;
  courseName: string;
  assignmentId: string;
  title: string;
  dueDate: string;
  dueDateFormatted: string;
  daysUntilDue: number;
  link: string;
  priority: string;
}

interface RecentAnnouncement {
  courseId: string;
  courseName: string;
  title: string;
  creationTime: string;
  link: string;
}

interface CourseProgress {
  courseId: string;
  courseName: string;
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  completionRate: number;
  status: string;
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
}

interface CompleteDashboardData {
  quickSummary: QuickSummary;
  upcomingDeadlines: UpcomingDeadline[];
  recentAnnouncements: RecentAnnouncement[];
  courseProgress: CourseProgress[];
  grades: any[];
  streak: Streak;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data: dashboardData, loading, error } = useApi<CompleteDashboardData>(() => api.getStudentDashboardComplete());

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">Error al cargar el dashboard: {error.message}</div>;
  }

  if (!dashboardData) {
    return (
      <div className="text-center mt-5">
        <h2>No se pudieron cargar los datos</h2>
        <p className="lead text-muted">Intenta recargar la página.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'behind': return 'warning';
      case 'critical': return 'danger';
      case 'needs_attention': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div>
      <h1 className="mb-4">Dashboard del Estudiante</h1>
      
      {/* Resumen Rápido */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">🎯 Resumen Rápido</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <h3 className="text-primary">{dashboardData.quickSummary.activeCourses}</h3>
                  <p className="text-muted mb-0">Cursos Activos</p>
                </div>
                <div className="col-md-3">
                  <h3 className={`text-${getStatusColor(dashboardData.quickSummary.overallStatus)}`}>
                    {dashboardData.quickSummary.totalPendingAssignments}
                  </h3>
                  <p className="text-muted mb-0">Tareas Pendientes</p>
                </div>
                <div className="col-md-3">
                  <h3 className="text-info">
                    {dashboardData.quickSummary.nextDeadline ? 
                      `${dashboardData.quickSummary.nextDeadline.daysUntilDue} días` : 
                      'N/A'
                    }
                  </h3>
                  <p className="text-muted mb-0">Próxima Entrega</p>
                </div>
                <div className="col-md-3">
                  <span className={`badge bg-${getStatusColor(dashboardData.quickSummary.overallStatus)} fs-6`}>
                    {dashboardData.quickSummary.overallStatus === 'excellent' ? '¡Excelente!' :
                     dashboardData.quickSummary.overallStatus === 'good' ? 'Bien' :
                     dashboardData.quickSummary.overallStatus === 'behind' ? 'Atrasado' : 'Crítico'}
                  </span>
                  <p className="text-muted mb-0 mt-1">Estado General</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Próximas Fechas de Entrega */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">📅 Próximas Entregas</h5>
            </div>
            <div className="card-body">
              {dashboardData.upcomingDeadlines.length > 0 ? (
                <div className="list-group list-group-flush">
                  {dashboardData.upcomingDeadlines.slice(0, 5).map(deadline => (
                    <div key={`${deadline.courseId}-${deadline.assignmentId}`} className="list-group-item d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{deadline.title}</h6>
                        <p className="mb-1 text-muted small">{deadline.courseName}</p>
                        <small className={`text-${getPriorityColor(deadline.priority)}`}>
                          {deadline.dueDateFormatted} ({deadline.daysUntilDue} días)
                        </small>
                      </div>
                      <span className={`badge bg-${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority === 'high' ? 'Urgente' : 'Normal'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No hay entregas próximas.</p>
              )}
            </div>
          </div>
        </div>

        {/* Anuncios Recientes */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">📢 Anuncios Recientes</h5>
            </div>
            <div className="card-body">
              {dashboardData.recentAnnouncements.length > 0 ? (
                <div className="list-group list-group-flush">
                  {dashboardData.recentAnnouncements.slice(0, 4).map((announcement, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{announcement.title}</h6>
                      </div>
                      <p className="mb-1 text-muted small">{announcement.courseName}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No hay anuncios recientes.</p>
              )}
            </div>
          </div>
        </div>

        {/* Progreso por Curso */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">📈 Mi Progreso por Curso</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {dashboardData.courseProgress.map(course => (
                  <div key={course.courseId} className="col-md-6 col-lg-4">
                    <div 
                      className="card h-100 course-card" 
                      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onClick={() => handleCourseClick(course.courseId)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0">{course.courseName}</h6>
                          <small className="text-muted">👆 Click para ver</small>
                        </div>
                        <div className="progress mb-2">
                          <div 
                            className={`progress-bar bg-${getStatusColor(course.status)}`}
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between text-small">
                          <span>{course.completionRate}% completado</span>
                          <span>{course.pendingAssignments} pendientes</span>
                        </div>
                        <small className={`text-${getStatusColor(course.status)}`}>
                          {course.status === 'excellent' ? 'Excelente' :
                           course.status === 'good' ? 'Bien' : 'Necesita atención'}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Racha de Entregas */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">⏰ Racha de Entregas</h5>
            </div>
            <div className="card-body text-center">
              <h3 className="text-success">{dashboardData.streak.currentStreak}</h3>
              <p className="text-muted">Días consecutivos al día</p>
              <small className="text-muted">
                Récord: {dashboardData.streak.longestStreak} días
              </small>
            </div>
          </div>
        </div>

        {/* Estadísticas de Entregas */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">📊 Mis Estadísticas</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <h4 className="text-success">{dashboardData.streak.onTimeSubmissions}</h4>
                  <small className="text-muted">A Tiempo</small>
                </div>
                <div className="col-6">
                  <h4 className="text-warning">{dashboardData.streak.lateSubmissions}</h4>
                  <small className="text-muted">Tarde</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
