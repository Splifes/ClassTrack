import { Card, CardContent, CardHeader, CardTitle, Badge } from '../../../../shared/components/ui'
import { BarChart } from '../../../../shared/components/charts/BarChart'
import type { StudentGradesProps } from '../../types'

export function StudentGrades({ studentData, chartData, analytics }: StudentGradesProps) {
  return (
    <div className="row">
      <div className="col-md-8 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>My Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData?.myGradeDistribution && chartData.myGradeDistribution.length > 0 ? (
              <BarChart 
                data={chartData.myGradeDistribution}
                title=""
                height={300}
                color="#28a745"
              />
            ) : (
              <p className="text-muted text-center">No grades available yet</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-md-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Grade Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.performance ? (
              <div>
                <div className="mb-3">
                  <strong>Total Points: </strong>
                  <span>{analytics.performance.total_points_earned}/{analytics.performance.total_points_possible}</span>
                </div>
                <div className="mb-3">
                  <strong>Highest: </strong>
                  <span className="text-success">{analytics.performance.highest_grade}</span>
                </div>
                <div className="mb-3">
                  <strong>Lowest: </strong>
                  <span className="text-danger">{analytics.performance.lowest_grade}</span>
                </div>
                <div className="mb-3">
                  <strong>Late Submissions: </strong>
                  <span className="text-warning">{analytics.performance.late_submissions}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted">No grade data available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="col-12">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Points Earned</th>
                    <th>Max Points</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.my_grades?.map((grade: any, index: number) => (
                    <tr key={index}>
                      <td>{grade.coursework_title}</td>
                      <td className="text-success">{grade.earned_points}</td>
                      <td>{grade.max_points}</td>
                      <td>
                        <span className={`fw-bold ${
                          grade.percentage >= 90 ? 'text-success' :
                          grade.percentage >= 80 ? 'text-info' :
                          grade.percentage >= 70 ? 'text-warning' :
                          'text-danger'
                        }`}>
                          {grade.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td>
                        <div>
                          <Badge variant={grade.state === 'TURNED_IN' ? 'success' : 'info'}>
                            {grade.state}
                          </Badge>
                          {grade.late && (
                            <Badge variant="warning" className="ms-1">Late</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        {grade.submission_date ? 
                          new Date(grade.submission_date).toLocaleDateString() : 
                          'N/A'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
