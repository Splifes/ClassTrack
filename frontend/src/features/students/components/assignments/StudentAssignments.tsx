import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../../../shared/components/ui'
import type { StudentAssignmentsProps } from '../../types'

export function StudentAssignments({ studentData }: StudentAssignmentsProps) {
  return (
    <div className="row">
      <div className="col-12">
        <Card>
          <CardHeader>
            <CardTitle>My Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {studentData.coursework_limitation ? (
              <div className="alert alert-warning">
                <h6 className="alert-heading">⚠️ {studentData.coursework_limitation.message}</h6>
                <p>{studentData.coursework_limitation.explanation}</p>
                <details className="mt-3">
                  <summary className="fw-bold">Available Alternatives</summary>
                  <ul className="mt-2">
                    {studentData.coursework_limitation.available_alternatives?.map((alt: string, index: number) => (
                      <li key={index}>{alt}</li>
                    ))}
                  </ul>
                </details>
                <div className="mt-3">
                  <small className="text-muted">
                    <strong>Why limited:</strong> {studentData.coursework_limitation.why_limited}
                  </small>
                </div>
              </div>
            ) : (studentData.my_coursework && studentData.my_coursework.length > 0) ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Points</th>
                      <th>Grade</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.my_coursework.map((work: any, index: number) => {
                      const submission = studentData.my_submissions?.find((s: any) => s.courseWorkId === work.id)
                      return (
                        <tr key={index}>
                          <td>
                            <strong>{work.title}</strong>
                            {work.description && (
                              <div className="small text-muted">{work.description.substring(0, 100)}...</div>
                            )}
                          </td>
                          <td>
                            {work.dueDate ? 
                              `${work.dueDate.year}-${work.dueDate.month}-${work.dueDate.day}` : 
                              'No due date'
                            }
                          </td>
                          <td>
                            <Badge variant={
                              submission?.state === 'TURNED_IN' ? 'success' :
                              submission?.state === 'RETURNED' ? 'info' :
                              'warning'
                            }>
                              {submission?.state || 'Not submitted'}
                            </Badge>
                          </td>
                          <td>{work.maxPoints || 'N/A'}</td>
                          <td>
                            {submission?.assignedGrade ? 
                              `${submission.assignedGrade}/${work.maxPoints}` : 
                              'Not graded'
                            }
                          </td>
                          <td>
                            {submission?.updateTime ? 
                              new Date(submission.updateTime).toLocaleDateString() : 
                              'Not submitted'
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="mb-3">
                  <i className="fas fa-tasks fa-3x text-muted"></i>
                </div>
                <h5>No Assignments Available</h5>
                <p className="text-muted">
                  Either there are no assignments in this course yet, or they are not accessible with your current permissions.
                </p>
                <div className="alert alert-info mt-3">
                  <strong>💡 Tip:</strong> Check Google Classroom directly for the most up-to-date assignment information.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
