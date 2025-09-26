import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface Overview {
  totalCourses: number;
  totalStudents: number;
  totalAssignments: number;
  averageSubmissionRate: number;
}

interface ClassPerformance {
  courseId: string;
  courseName: string;
  studentCount: number;
  assignmentCount: number;
  submissionRate: number;
  status: string;
}

interface SubmissionStatus {
  courseId: string;
  courseName: string;
  assignmentId: string;
  assignmentTitle: string;
  submittedCount: number;
  totalStudents: number;
  submissionRate: number;
  missingCount: number;
}

interface StudentComparison {
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  completionRate: number;
  submittedCount: number;
  totalAssignments: number;
  lateSubmissions: number;
  onTimeSubmissions: number;
  status: string;
}

interface ParticipationMetric {
  studentId: string;
  studentName: string;
  coursesCount: number;
  overallCompletionRate: number;
  totalSubmitted: number;
  totalAssignments: number;
  participationLevel: string;
}

interface TeacherDashboardData {
  overview: Overview;
  classPerformance: ClassPerformance[];
  submissionStatus: SubmissionStatus[];
  studentComparisons: StudentComparison[];
  participationMetrics: ParticipationMetric[];
  recentActivity: any[];
}

export default function TeacherDashboard() {
  const { user } = useAuth();

  // Usar endpoint real que obtiene datos de Google Classroom
  const { data: dashboardData, loading, error } = useApi<TeacherDashboardData>(() => api.getTeacherDashboard());

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
    return (
      <div className="alert alert-danger">
        <h4 className="alert-heading">Error al cargar el dashboard</h4>
        <p>No se pudieron obtener los datos de Google Classroom. Esto puede deberse a:</p>
        <ul>
          <li>Problemas de conexión con Google Classroom API</li>
          <li>Permisos insuficientes para acceder a los cursos</li>
          <li>Token de autenticación expirado</li>
        </ul>
        <hr />
        <p className="mb-0">
          <strong>Error técnico:</strong> {String(error)}
        </p>
        <button 
          className="btn btn-outline-danger mt-2" 
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
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
      case 'needs_attention': return 'warning';
      case 'at_risk': return 'danger';
      default: return 'secondary';
    }
  };

  const getParticipationColor = (level: string) => {
    switch (level) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'danger';
      default: return 'secondary';
    }
  };

  const copyJsonToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(dashboardData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      alert('JSON copiado al portapapeles!');
    } catch (err) {
      console.error('Error al copiar JSON:', err);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(dashboardData, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('JSON copiado al portapapeles!');
    }
  };

  return (
    <div>
      {/* Advertencia de acceso hardcodeado */}
      {user?.role !== 'teacher' && user?.role !== 'coordinator' && (
        <div className="alert alert-warning alert-dismissible fade show mb-3" role="alert">
          <strong>⚠️ Modo Desarrollo:</strong> Estás accediendo como <code>{user?.role}</code> pero esta página requiere rol de <code>teacher</code> o <code>coordinator</code>. 
          El acceso está temporalmente hardcodeado para testing.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Dashboard del Profesor</h1>
        <div className="d-flex gap-2 align-items-center">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={copyJsonToClipboard}
            title="Copiar datos JSON al portapapeles"
          >
            <i className="bi bi-clipboard"></i> Copiar JSON
          </button>
          <div className="badge bg-success">
            <i className="bi bi-google"></i> Datos de Google Classroom
          </div>
        </div>
      </div>
      
      {/* Resumen General */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">📊 Resumen General</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <h3 className="text-primary">{dashboardData.overview.totalCourses}</h3>
                  <p className="text-muted mb-0">Cursos</p>
                </div>
                <div className="col-md-3">
                  <h3 className="text-info">{dashboardData.overview.totalStudents}</h3>
                  <p className="text-muted mb-0">Estudiantes</p>
                </div>
                <div className="col-md-3">
                  <h3 className="text-warning">{dashboardData.overview.totalAssignments}</h3>
                  <p className="text-muted mb-0">Tareas Totales</p>
                </div>
                <div className="col-md-3">
                  <h3 className={`text-${dashboardData.overview.averageSubmissionRate >= 80 ? 'success' : dashboardData.overview.averageSubmissionRate >= 60 ? 'warning' : 'danger'}`}>
                    {dashboardData.overview.averageSubmissionRate}%
                  </h3>
                  <p className="text-muted mb-0">Tasa de Entrega</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Rendimiento por Clase */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">📈 Rendimiento por Clase</h5>
            </div>
            <div className="card-body">
              {dashboardData.classPerformance.length > 0 ? (
                <div className="list-group list-group-flush">
                  {dashboardData.classPerformance.map(course => (
                    <div key={course.courseId} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{course.courseName}</h6>
                          <p className="mb-1 text-muted small">
                            {course.studentCount} estudiantes • {course.assignmentCount} tareas
                          </p>
                        </div>
                        <div className="text-end">
                          <span className={`badge bg-${getStatusColor(course.status)} mb-1`}>
                            {course.submissionRate}%
                          </span>
                          <br />
                          <small className="text-muted">
                            {course.status === 'excellent' ? 'Excelente' :
                             course.status === 'good' ? 'Bien' : 'Necesita atención'}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No hay datos de rendimiento disponibles.</p>
              )}
            </div>
          </div>
        </div>

        {/* Estado de Entregas */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">📋 Estado de Entregas</h5>
            </div>
            <div className="card-body">
              {dashboardData.submissionStatus.length > 0 ? (
                <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {dashboardData.submissionStatus.slice(0, 8).map((submission, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1">{submission.assignmentTitle}</h6>
                          <p className="mb-1 text-muted small">{submission.courseName}</p>
                        </div>
                        <div className="text-end">
                          <span className={`badge ${submission.submissionRate >= 80 ? 'bg-success' : submission.submissionRate >= 60 ? 'bg-warning' : 'bg-danger'}`}>
                            {submission.submittedCount}/{submission.totalStudents}
                          </span>
                          <br />
                          <small className="text-muted">{submission.submissionRate}%</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No hay datos de entregas disponibles.</p>
              )}
            </div>
          </div>
        </div>

        {/* Comparaciones de Estudiantes */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">👥 Comparaciones de Estudiantes</h5>
            </div>
            <div className="card-body">
              {dashboardData.studentComparisons.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Curso</th>
                        <th>Completitud</th>
                        <th>Entregas</th>
                        <th>A Tiempo</th>
                        <th>Tarde</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.studentComparisons.slice(0, 10).map((student, index) => (
                        <tr key={index}>
                          <td>{student.studentName}</td>
                          <td><small className="text-muted">{student.courseName}</small></td>
                          <td>
                            <div className="progress" style={{ width: '80px', height: '20px' }}>
                              <div 
                                className={`progress-bar bg-${getStatusColor(student.status)}`}
                                style={{ width: `${student.completionRate}%` }}
                              ></div>
                            </div>
                            <small>{student.completionRate}%</small>
                          </td>
                          <td>{student.submittedCount}/{student.totalAssignments}</td>
                          <td><span className="badge bg-success">{student.onTimeSubmissions}</span></td>
                          <td><span className="badge bg-warning">{student.lateSubmissions}</span></td>
                          <td>
                            <span className={`badge bg-${getStatusColor(student.status)}`}>
                              {student.status === 'excellent' ? 'Excelente' :
                               student.status === 'good' ? 'Bien' : 'En Riesgo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No hay datos de estudiantes disponibles.</p>
              )}
            </div>
          </div>
        </div>

        {/* Métricas de Participación */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">📊 Métricas de Participación Global</h5>
            </div>
            <div className="card-body">
              {dashboardData.participationMetrics.length > 0 ? (
                <div className="row g-3">
                  {dashboardData.participationMetrics.slice(0, 12).map((student, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">{student.studentName}</h6>
                          <div className="progress mb-2">
                            <div 
                              className={`progress-bar bg-${getParticipationColor(student.participationLevel)}`}
                              style={{ width: `${student.overallCompletionRate}%` }}
                            ></div>
                          </div>
                          <div className="d-flex justify-content-between text-small">
                            <span>{student.overallCompletionRate}%</span>
                            <span>{student.coursesCount} cursos</span>
                          </div>
                          <small className={`text-${getParticipationColor(student.participationLevel)}`}>
                            Participación: {student.participationLevel === 'high' ? 'Alta' :
                                          student.participationLevel === 'medium' ? 'Media' : 'Baja'}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No hay métricas de participación disponibles.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">🚀 Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <div className="d-grid">
                    <Link to="/courses" className="btn btn-primary">
                      📚 Manage Courses
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-grid">
                    <Link to="/students" className="btn btn-info">
                      👥 View Students
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-grid">
                    <button 
                      className="btn btn-success"
                      onClick={() => {
                        // Navigate to first course's attendance if available
                        if (dashboardData.classPerformance.length > 0) {
                          window.location.href = `/courses/${dashboardData.classPerformance[0].courseId}/attendance`;
                        } else {
                          window.location.href = '/courses';
                        }
                      }}
                    >
                      📋 Take Attendance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
