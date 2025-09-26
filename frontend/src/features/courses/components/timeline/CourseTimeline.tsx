import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui'
import type { CourseTimelineProps, TimelineFilterType } from '../../types/timeline'
import { useTimelineData } from './hooks/useTimelineData'
import { TimelineFilters } from './TimelineFilters'
import { TimelineEventComponent } from './TimelineEvent'

export function CourseTimeline({ 
  courseId, 
  showPastEvents = true, 
  maxEvents = 20 
}: CourseTimelineProps) {
  const [filter, setFilter] = useState<TimelineFilterType>('all')
  
  const { events, loading } = useTimelineData({
    courseId,
    filter,
    showPastEvents,
    maxEvents
  })
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <CardTitle>Timeline del Curso</CardTitle>
          <TimelineFilters filter={filter} onFilterChange={setFilter} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="timeline">
          {events.length === 0 ? (
            <div className="text-center text-muted py-4">
              <p>No hay eventos para mostrar</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {events.map((event, index) => (
                <TimelineEventComponent
                  key={event.id}
                  event={event}
                  isLast={index === events.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
