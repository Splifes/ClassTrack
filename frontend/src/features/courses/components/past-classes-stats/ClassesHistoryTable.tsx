import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui'
import type { ClassesHistoryTableProps } from '../../types/pastClassesStats'

export function ClassesHistoryTable({ classes }: ClassesHistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Clases Anteriores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tema</th>
                <th>Asistencia</th>
                <th>Materiales</th>
                <th>Tareas</th>
                <th>Engagement</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={cls.id}>
                  <td>
                    <div>
                      <strong>{new Date(cls.date).toLocaleDateString('es-ES')}</strong>
                      <br />
                      <small className="text-muted">
                        {new Date(cls.date).toLocaleDateString('es-ES', { weekday: 'long' })}
                      </small>
                    </div>
                  </td>
                  <td>
                    <strong>Clase {index + 1}</strong>
                    <br />
                    <span className="text-muted">{cls.topic}</span>
                  </td>
                  <td>
                    <div>
                      <strong>{cls.attendance}/{cls.totalStudents}</strong>
                      <br />
                      <span className={`badge ${
                        (cls.attendance / cls.totalStudents) > 0.8 ? 'bg-success' :
                        (cls.attendance / cls.totalStudents) > 0.6 ? 'bg-warning' :
                        'bg-danger'
                      }`}>
                        {Math.round((cls.attendance / cls.totalStudents) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-info">{cls.materials} archivos</span>
                  </td>
                  <td>
                    {cls.assignments > 0 ? (
                      <span className="badge bg-warning">{cls.assignments} tarea</span>
                    ) : (
                      <span className="text-muted">Sin tareas</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="progress me-2" style={{ width: '60px', height: '6px' }}>
                        <div 
                          className="progress-bar bg-primary" 
                          style={{ width: `${cls.averageEngagement}%` }}
                        />
                      </div>
                      <small>{cls.averageEngagement}%</small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
