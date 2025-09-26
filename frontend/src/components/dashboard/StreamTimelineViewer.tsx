import { useApi } from '../../hooks/useApi'
import { api } from '../../services/api'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../shared/components/ui'

export function StreamTimelineViewer() {
  const { data, loading, error } = useApi(() => api.getStreamTimeline(), [])

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-5">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading timeline...</span>
          </div>
          <p className="mt-2 text-muted small">Loading recent activity...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="alert alert-danger mb-0">
            <h6 className="alert-heading small">Error Loading Timeline</h6>
            <p className="small mb-0">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const timeline = data?.stream_timeline || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>📱 Recent Activity Stream</CardTitle>
        <p className="text-muted mb-0">
          Latest assignments and materials from all your courses.
        </p>
      </CardHeader>
      <CardContent>
        {timeline.length > 0 ? (
          <div className="timeline-condensed">
            {timeline.map((item: any, index: number) => (
              <div key={index} className="card mb-3 border-start border-4" 
                   style={{
                     borderLeftColor: 
                       item.type === 'coursework' ? '#007bff' :
                       item.type === 'material' ? '#28a745' : 
                       '#ffc107'
                   }}>
                <div className="card-body py-2 px-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-muted">{item.course_name}</small>
                      <h6 className="card-title mb-1 small">
                        <span className="me-2">
                          {item.type === 'coursework' ? '📝' : 
                           item.type === 'material' ? '📄' : '📢'}
                        </span>
                        {item.title}
                      </h6>
                    </div>
                    <small className="text-muted">
                      {new Date(item.creationTime).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </small>
                  </div>
                  {item.alternateLink && (
                    <a href={item.alternateLink} target="_blank" rel="noopener noreferrer" 
                       className="stretched-link"></a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mb-3">
              <i className="fas fa-stream fa-2x text-muted"></i>
            </div>
            <h6 className="mb-1">No Recent Activity</h6>
            <p className="text-muted small mb-0">
              No new assignments or materials found in your courses.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
