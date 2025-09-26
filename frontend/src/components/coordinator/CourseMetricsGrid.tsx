import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseMetric {
  course_id: string;
  course_name: string;
  teacher_name: string;
  teacher_email: string;
  student_count: number;
  assignment_count: number;
  average_grade: number;
  submission_rate: number;
  on_time_rate: number;
  risk_level: 'low' | 'medium' | 'high';
  issues: string[];
  grade_distribution: {
    excellent: number;
    good: number;
    regular: number;
    poor: number;
  };
}

interface Props {
  courses: CourseMetric[];
  loading?: boolean;
}

export default function CourseMetricsGrid({ courses, loading }: Props) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof CourseMetric>('average_grade');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleSort = (field: keyof CourseMetric) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return 'success';
    if (grade >= 70) return 'info';
    if (grade >= 60) return 'warning';
    return 'danger';
  };

  const filteredAndSortedCourses = courses
    .filter(course => filterRisk === 'all' || course.risk_level === filterRisk)
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando métricas de cursos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📊 Métricas por Curso</h5>
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm"
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
            >
              <option value="all">Todos los riesgos</option>
              <option value="high">Alto riesgo</option>
              <option value="medium">Riesgo medio</option>
              <option value="low">Bajo riesgo</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('course_name')}
                >
                  Curso {sortField === 'course_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('teacher_name')}
                >
                  Profesor {sortField === 'teacher_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('student_count')}
                >
                  Estudiantes {sortField === 'student_count' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('average_grade')}
                >
                  Promedio {sortField === 'average_grade' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('submission_rate')}
                >
                  Entregas {sortField === 'submission_rate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('on_time_rate')}
                >
                  A Tiempo {sortField === 'on_time_rate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Riesgo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCourses.map(course => (
                <tr key={course.course_id}>
                  <td>
                    <div>
                      <strong>{course.course_name}</strong>
                      <br />
                      <small className="text-muted">{course.assignment_count} tareas</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      {course.teacher_name}
                      <br />
                      <small className="text-muted">{course.teacher_email}</small>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-info">{course.student_count}</span>
                  </td>
                  <td>
                    <span className={`badge bg-${getGradeColor(course.average_grade)}`}>
                      {course.average_grade.toFixed(1)}%
                    </span>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div 
                        className={`progress-bar bg-${getGradeColor(course.average_grade)}`}
                        style={{ width: `${course.average_grade}%` }}
                      />
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${course.submission_rate >= 80 ? 'bg-success' : course.submission_rate >= 60 ? 'bg-warning' : 'bg-danger'}`}>
                      {course.submission_rate.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${course.on_time_rate >= 80 ? 'bg-success' : course.on_time_rate >= 60 ? 'bg-warning' : 'bg-danger'}`}>
                      {course.on_time_rate.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge bg-${getRiskColor(course.risk_level)}`}>
                      {course.risk_level === 'high' ? 'Alto' : 
                       course.risk_level === 'medium' ? 'Medio' : 'Bajo'}
                    </span>
                    {course.issues.length > 0 && (
                      <div className="mt-1">
                        {course.issues.slice(0, 2).map((issue, idx) => (
                          <small key={idx} className="text-muted d-block">• {issue}</small>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => navigate(`/courses/${course.course_id}`)}
                      >
                        Ver
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => window.open(`mailto:${course.teacher_email}?subject=Curso: ${course.course_name}`, '_blank')}
                      >
                        Email
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAndSortedCourses.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No se encontraron cursos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
      <div className="card-footer">
        <small className="text-muted">
          Mostrando {filteredAndSortedCourses.length} de {courses.length} cursos
        </small>
      </div>
    </div>
  );
}
