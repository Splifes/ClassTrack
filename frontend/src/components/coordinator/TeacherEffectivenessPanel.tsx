import React, { useState } from 'react';

interface TeacherMetric {
  teacher_name: string;
  teacher_email: string;
  total_courses: number;
  course_names: string[];
  total_students: number;
  total_assignments: number;
  average_class_performance: number;
  students_per_course: number;
  assignments_per_course: number;
  workload_level: 'light' | 'moderate' | 'high' | 'overloaded';
  performance_level: 'needs_improvement' | 'average' | 'good' | 'excellent';
}

interface Props {
  teachers: TeacherMetric[];
  loading?: boolean;
}

export default function TeacherEffectivenessPanel({ teachers, loading }: Props) {
  const [sortField, setSortField] = useState<keyof TeacherMetric>('average_class_performance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterWorkload, setFilterWorkload] = useState<'all' | 'light' | 'moderate' | 'high' | 'overloaded'>('all');

  const handleSort = (field: keyof TeacherMetric) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'overloaded': return 'danger';
      case 'high': return 'warning';
      case 'moderate': return 'info';
      case 'light': return 'success';
      default: return 'secondary';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'average': return 'warning';
      case 'needs_improvement': return 'danger';
      default: return 'secondary';
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'average': return 'Promedio';
      case 'needs_improvement': return 'Necesita Mejora';
      default: return performance;
    }
  };

  const getWorkloadBadge = (workload: string) => {
    switch (workload) {
      case 'overloaded': return 'Sobrecargado';
      case 'high': return 'Alta';
      case 'moderate': return 'Moderada';
      case 'light': return 'Ligera';
      default: return workload;
    }
  };

  const filteredAndSortedTeachers = teachers
    .filter(teacher => filterWorkload === 'all' || teacher.workload_level === filterWorkload)
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
            <span className="visually-hidden">Cargando métricas de profesores...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">👨‍🏫 Efectividad de Profesores</h5>
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm"
              value={filterWorkload}
              onChange={(e) => setFilterWorkload(e.target.value as any)}
            >
              <option value="all">Todas las cargas</option>
              <option value="overloaded">Sobrecargados</option>
              <option value="high">Carga alta</option>
              <option value="moderate">Carga moderada</option>
              <option value="light">Carga ligera</option>
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
                  onClick={() => handleSort('teacher_name')}
                >
                  Profesor {sortField === 'teacher_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('total_courses')}
                >
                  Cursos {sortField === 'total_courses' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('total_students')}
                >
                  Estudiantes {sortField === 'total_students' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('average_class_performance')}
                >
                  Rendimiento {sortField === 'average_class_performance' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Carga de Trabajo</th>
                <th>Nivel</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTeachers.map(teacher => (
                <tr key={teacher.teacher_email}>
                  <td>
                    <div>
                      <strong>{teacher.teacher_name}</strong>
                      <br />
                      <small className="text-muted">{teacher.teacher_email}</small>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-primary">{teacher.total_courses}</span>
                    <div className="mt-1">
                      {teacher.course_names.slice(0, 2).map((course, idx) => (
                        <small key={idx} className="text-muted d-block">• {course}</small>
                      ))}
                      {teacher.course_names.length > 2 && (
                        <small className="text-muted">+{teacher.course_names.length - 2} más</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className="badge bg-info">{teacher.total_students}</span>
                      <br />
                      <small className="text-muted">{teacher.students_per_course.toFixed(1)} por curso</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span className={`badge bg-${getPerformanceColor(teacher.performance_level)}`}>
                        {teacher.average_class_performance.toFixed(1)}%
                      </span>
                      <div className="progress mt-1" style={{ height: '4px' }}>
                        <div 
                          className={`progress-bar bg-${getPerformanceColor(teacher.performance_level)}`}
                          style={{ width: `${teacher.average_class_performance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge bg-${getWorkloadColor(teacher.workload_level)}`}>
                      {getWorkloadBadge(teacher.workload_level)}
                    </span>
                    <br />
                    <small className="text-muted">
                      {teacher.assignments_per_course.toFixed(1)} tareas/curso
                    </small>
                  </td>
                  <td>
                    <span className={`badge bg-${getPerformanceColor(teacher.performance_level)}`}>
                      {getPerformanceBadge(teacher.performance_level)}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => window.open(`mailto:${teacher.teacher_email}?subject=Seguimiento Académico`, '_blank')}
                      >
                        Email
                      </button>
                      <button 
                        className="btn btn-outline-info"
                        title="Ver cursos del profesor"
                      >
                        Cursos
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAndSortedTeachers.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No se encontraron profesores con los filtros seleccionados.</p>
          </div>
        )}
      </div>
      <div className="card-footer">
        <div className="row text-center">
          <div className="col-3">
            <small className="text-muted">Total Profesores</small>
            <div><strong>{teachers.length}</strong></div>
          </div>
          <div className="col-3">
            <small className="text-muted">Promedio Estudiantes</small>
            <div><strong>{teachers.length > 0 ? (teachers.reduce((sum, t) => sum + t.total_students, 0) / teachers.length).toFixed(0) : 0}</strong></div>
          </div>
          <div className="col-3">
            <small className="text-muted">Promedio Cursos</small>
            <div><strong>{teachers.length > 0 ? (teachers.reduce((sum, t) => sum + t.total_courses, 0) / teachers.length).toFixed(1) : 0}</strong></div>
          </div>
          <div className="col-3">
            <small className="text-muted">Rendimiento Promedio</small>
            <div><strong>{teachers.length > 0 ? (teachers.reduce((sum, t) => sum + t.average_class_performance, 0) / teachers.length).toFixed(1) : 0}%</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
