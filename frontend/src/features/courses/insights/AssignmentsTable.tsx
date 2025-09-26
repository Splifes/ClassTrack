import React from 'react';
import { Assignment } from '../../../services/courseService';

interface Props {
  assignments: Assignment[];
}

const AssignmentsTable: React.FC<Props> = ({ assignments }) => {

  const getStatusBadge = (assignment: Assignment) => {
    if (assignment.late) return <span className="badge bg-warning text-dark">Tardía</span>;
    switch (assignment.state) {
      case 'TURNED_IN':
        return <span className="badge bg-primary">Entregada</span>;
      case 'RETURNED':
        return <span className="badge bg-success">Calificada</span>;
      case 'MISSING':
        return <span className="badge bg-danger">Faltante</span>;
      case 'CREATED':
        return <span className="badge bg-secondary">Asignada</span>;
      default:
        return <span className="badge bg-light text-dark">{assignment.state}</span>;
    }
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title mb-3">Resumen de Tareas</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Tarea</th>
                <th>Estado</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(assignment => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{getStatusBadge(assignment)}</td>
                  <td>
                    {assignment.grade !== null
                      ? `${assignment.grade}${assignment.maxPoints ? ` / ${assignment.maxPoints}` : ''}`
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsTable;
