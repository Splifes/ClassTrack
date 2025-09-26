import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/components/ui'
import { PieChart } from '../../../../shared/components/charts/PieChart'
import type { StudentOverviewProps } from '../../types'

export function StudentOverview({ analytics, chartData }: StudentOverviewProps) {
  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>My Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="row text-center">
              <div className="col-6 mb-3">
                <h3 className="text-primary">{analytics.overview?.total_assignments || 0}</h3>
                <small className="text-muted">Total Assignments</small>
              </div>
              <div className="col-6 mb-3">
                <h3 className="text-success">{analytics.overview?.completed_assignments || 0}</h3>
                <small className="text-muted">Completed</small>
              </div>
              <div className="col-6">
                <h3 className="text-warning">{analytics.overview?.pending_assignments || 0}</h3>
                <small className="text-muted">Pending</small>
              </div>
              <div className="col-6">
                <h3 className="text-info">{analytics.overview?.graded_assignments || 0}</h3>
                <small className="text-muted">Graded</small>
              </div>
            </div>
            <hr />
            <div className="text-center">
              <div className="mb-2">
                <strong>Completion Rate</strong>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${analytics.overview?.completion_rate || 0}%` }}
                />
              </div>
              <small className="text-muted">{analytics.overview?.completion_rate?.toFixed(1) || 0}%</small>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="col-md-6 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Assignment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData?.assignmentStatus && chartData.assignmentStatus.length > 0 ? (
              <PieChart 
                data={chartData.assignmentStatus}
                height={250}
                showLabels={false}
              />
            ) : (
              <p className="text-muted text-center">No assignment data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="col-12 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>My Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="row">
              <div className="col-md-3 text-center mb-3">
                <h4 className="text-primary">{analytics.performance?.overall_percentage?.toFixed(1) || 'N/A'}%</h4>
                <small className="text-muted">Overall Grade</small>
              </div>
              <div className="col-md-3 text-center mb-3">
                <h4 className="text-success">{analytics.performance?.average_grade?.toFixed(1) || 'N/A'}</h4>
                <small className="text-muted">Average Score</small>
              </div>
              <div className="col-md-3 text-center mb-3">
                <h4 className="text-info">{analytics.engagement?.participation_rate?.toFixed(1) || 0}%</h4>
                <small className="text-muted">Participation</small>
              </div>
              <div className="col-md-3 text-center mb-3">
                <h4 className="text-warning">{analytics.engagement?.punctuality_rate?.toFixed(1) || 0}%</h4>
                <small className="text-muted">On-Time Rate</small>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
