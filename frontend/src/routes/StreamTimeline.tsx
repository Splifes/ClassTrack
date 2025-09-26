import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../shared/components/ui';

interface CourseStreamTimelineProps {
  courseId: string;
}

export function CourseStreamTimeline({ courseId }: CourseStreamTimelineProps) {
  const { data, loading, error } = useApi(() => api.getCourseTimeline(courseId, 90), [courseId]);

  return (
    <div className="mt-4">
      {loading && (
        <div className="text-center">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading timeline...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-warning small">
          <h6 className="alert-heading">Could not load activity stream</h6>
          <p className="mb-0">{error.toString()}</p>
        </div>
      )}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Stream</CardTitle>
          </CardHeader>
          <CardContent>
            {data && data.length > 0 ? (
              <ul className="list-group list-group-flush">
                {data.map((item: any) => (
                  <li key={item.id} className="list-group-item px-0 d-flex align-items-start">
                    <div className="me-3 text-center">
                      {item.type === 'assignment' ? (
                        <span title="Assignment" className="d-block bg-primary text-white rounded-circle" style={{ width: '32px', height: '32px', lineHeight: '32px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16"><path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>
                        </span>
                      ) : item.type === 'material' ? (
                        <span title="Material" className="d-block bg-success text-white rounded-circle" style={{ width: '32px', height: '32px', lineHeight: '32px' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16"><path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/></svg>
                        </span>
                      ) : (
                        <span title="Announcement" className="d-block bg-info text-white rounded-circle" style={{ width: '32px', height: '32px', lineHeight: '32px' }}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-megaphone" viewBox="0 0 16 16"><path d="M4 1.5A2.5 2.5 0 0 0 1.5 4v8A2.5 2.5 0 0 0 4 14.5h1a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H2.354a.25.25 0 0 1-.177-.427l2-2a.25.25 0 0 1 .354 0l2 2a.25.25 0 0 1-.177.427H4.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h1A2.5 2.5 0 0 0 7.5 12V4A2.5 2.5 0 0 0 5 1.5H4zM8 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13A.5.5 0 0 1 8 1z"/><path d="M10 1.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2h-.5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8h-.5a.5.5 0 0 1-.5-.5z"/></svg>
                        </span>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">{item.title}</h6>
                        <small className="text-muted">{new Date(item.date).toLocaleDateString()}</small>
                      </div>
                      {item.description && <p className="mb-1 text-muted small">{item.description}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted py-3">
                <p>No recent activity to display.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
