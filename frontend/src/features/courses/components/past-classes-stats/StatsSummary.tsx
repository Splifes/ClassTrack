import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui'
import type { StatsSummaryProps } from '../../types/pastClassesStats'

export function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Clases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="row text-center">
          <div className="col-6 mb-3">
            <h3 className="text-primary mb-1">{stats.totalClasses}</h3>
            <small className="text-muted">Clases Dictadas</small>
          </div>
          <div className="col-6 mb-3">
            <h3 className="text-success mb-1">{stats.attendanceRate}%</h3>
            <small className="text-muted">Asistencia Promedio</small>
          </div>
          <div className="col-6">
            <h3 className="text-info mb-1">{stats.totalMaterials}</h3>
            <small className="text-muted">Materiales Compartidos</small>
          </div>
          <div className="col-6">
            <h3 className="text-warning mb-1">{stats.totalAssignments}</h3>
            <small className="text-muted">Tareas Asignadas</small>
          </div>
        </div>
        
        <hr />
        
        <div className="text-center">
          <div className="mb-2">
            <strong>Engagement Promedio</strong>
          </div>
          <div className="progress" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${stats.avgEngagement}%` }}
            />
          </div>
          <small className="text-muted">{stats.avgEngagement}% de participación</small>
        </div>
      </CardContent>
    </Card>
  )
}
