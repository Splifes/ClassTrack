import { Badge } from '../../../../shared/components/ui'
import type { TimelineEvent } from '../../types/timeline'
import { getEventIcon, getEventColor } from '../../../../shared/utils/timelineHelpers'

interface TimelineEventProps {
  event: TimelineEvent
  isLast: boolean
}

function getStatusBadge(status?: string) {
  switch (status) {
    case 'completed': return <Badge variant="success">Completado</Badge>
    case 'pending': return <Badge variant="warning">Pendiente</Badge>
    case 'overdue': return <Badge variant="danger">Vencido</Badge>
    case 'graded': return <Badge variant="info">Calificado</Badge>
    default: return null
  }
}

export function TimelineEventComponent({ event, isLast }: TimelineEventProps) {
  return (
    <div className="list-group-item px-0 border-0">
      <div className="d-flex align-items-start">
        {/* Timeline indicator */}
        <div className="flex-shrink-0 me-3">
          <div className="d-flex flex-column align-items-center">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: getEventColor(event.type),
                color: 'white',
                fontSize: '18px'
              }}
            >
              {getEventIcon(event.type)}
            </div>
            {!isLast && (
              <div 
                className="border-start border-2 opacity-25"
                style={{ height: '60px', marginTop: '8px' }}
              />
            )}
          </div>
        </div>
        
        {/* Event content */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h6 className="mb-1">{event.title}</h6>
            <div className="d-flex align-items-center gap-2">
              {getStatusBadge(event.status)}
              <small className="text-muted">
                {new Date(event.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
          </div>
          
          {event.description && (
            <p className="text-muted small mb-2">{event.description}</p>
          )}
          
          {/* Metadata */}
          {event.metadata && (
            <div className="d-flex flex-wrap gap-3 small text-muted">
              {event.metadata.submissionCount && (
                <span>👥 {event.metadata.submissionCount} participantes</span>
              )}
              {event.metadata.averageGrade && (
                <span>📊 Promedio: {event.metadata.averageGrade}%</span>
              )}
              {event.metadata.dueDate && (
                <span>⏰ Vence: {new Date(event.metadata.dueDate).toLocaleDateString('es-ES')}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
