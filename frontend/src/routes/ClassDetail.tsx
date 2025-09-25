import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'

export default function ClassDetail() {
  const { courseId, classId } = useParams<{ courseId: string; classId: string }>()
  
  const { data: coursework, loading: courseworkLoading, error: courseworkError } = useApi(
    () => api.getCoursework(courseId!).then(cw => cw.find(c => c.id === classId)), 
    [courseId, classId]
  )
  
  const { data: submissions, loading: submissionsLoading } = useApi(
    () => coursework ? api.getSubmissions(courseId!, classId!) : Promise.resolve([]), 
    [courseId, classId, coursework]
  )

  if (courseworkLoading) {
    return (
      <div className="container-narrow">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading coursework...</span>
          </div>
        </div>
      </div>
    )
  }

  if (courseworkError || !coursework) {
    return (
      <div className="container-narrow">
        <div className="alert alert-danger">
          Error loading coursework: {courseworkError || 'Coursework not found'}
        </div>
        <Link to={`/courses/${courseId}`} className="btn btn-secondary">Back to Course</Link>
      </div>
    )
  }

  const formatDate = (dateObj: any, timeObj?: any) => {
    if (!dateObj) return 'No due date'
    const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
    if (timeObj) {
      date.setHours(timeObj.hours || 0, timeObj.minutes || 0)
    }
    return date.toLocaleDateString() + (timeObj ? ` ${date.toLocaleTimeString()}` : '')
  }

  const getSubmissionStats = () => {
    if (!submissions) return { total: 0, submitted: 0, late: 0, pending: 0 }
    
    const total = submissions.length
    const submitted = submissions.filter(s => s.state === 'TURNED_IN').length
    const late = submissions.filter(s => s.late).length
    const pending = submissions.filter(s => s.state === 'NEW' || s.state === 'CREATED').length
    
    return { total, submitted, late, pending }
  }

  const stats = getSubmissionStats()

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="mb-2">{coursework.title}</h1>
          <p className="text-muted">Coursework ID: {coursework.id}</p>
        </div>
        <Link to={`/courses/${courseId}`} className="btn btn-secondary">Back to Course</Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Assignment Details</h5>
              {coursework.description && (
                <p className="card-text">{coursework.description}</p>
              )}
              <div className="row">
                <div className="col-sm-6">
                  <strong>State:</strong> <span className="badge bg-secondary">{coursework.state}</span>
                </div>
                <div className="col-sm-6">
                  <strong>Due Date:</strong> {formatDate(coursework.dueDate, coursework.dueTime)}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-sm-6">
                  <strong>Created:</strong> {new Date(coursework.creationTime).toLocaleDateString()}
                </div>
                <div className="col-sm-6">
                  <strong>Updated:</strong> {new Date(coursework.updateTime).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Submission Stats</h5>
              {submissionsLoading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between">
                    <span>Total Students:</span>
                    <strong>{stats.total}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Submitted:</span>
                    <strong className="text-success">{stats.submitted}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Late:</span>
                    <strong className="text-warning">{stats.late}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Pending:</span>
                    <strong className="text-danger">{stats.pending}</strong>
                  </div>
                  {stats.total > 0 && (
                    <div className="mt-2">
                      <div className="progress" style={{ height: '20px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${(stats.submitted / stats.total) * 100}%` }}
                        >
                          {Math.round((stats.submitted / stats.total) * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Student Submissions {submissionsLoading ? '...' : `(${submissions?.length || 0})`}</h5>
        </div>
        <div className="card-body">
          {submissionsLoading ? (
            <div className="text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading submissions...</span>
              </div>
            </div>
          ) : submissions && submissions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>State</th>
                    <th>Submitted</th>
                    <th>Late</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(submission => (
                    <tr key={submission.id}>
                      <td>{submission.userId}</td>
                      <td>
                        <span className={`badge ${
                          submission.state === 'TURNED_IN' ? 'bg-success' :
                          submission.state === 'NEW' ? 'bg-secondary' :
                          submission.state === 'CREATED' ? 'bg-warning' :
                          'bg-info'
                        }`}>
                          {submission.state}
                        </span>
                      </td>
                      <td>{new Date(submission.creationTime).toLocaleDateString()}</td>
                      <td>
                        {submission.late ? (
                          <span className="badge bg-warning">Late</span>
                        ) : (
                          <span className="badge bg-success">On Time</span>
                        )}
                      </td>
                      <td>{new Date(submission.updateTime).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No submissions found</p>
          )}
        </div>
      </div>
    </div>
  )
}
