import { useState, useMemo } from 'react'
import { useApi } from '../hooks/useApi'
import { useProgressMetrics } from '../hooks/useProgressMetrics'
import { useRiskFlags } from '../hooks/useRiskFlags'
import { api } from '../services/api'
import { BarChart } from '../shared/components/charts/BarChart'
import { LineChart } from '../shared/components/charts/LineChart'
import { PieChart } from '../shared/components/charts/PieChart'
import { Card, CardContent, CardHeader, CardTitle, Button } from '../shared/components/ui'
import { exportToCsv, csvFormatters } from '../lib/exportCsv'
import { ChartData, TimeSeriesData, CourseReport, StudentReport } from '../types/reports'

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'cohorts'>('courses')
  
  const { data: courses, loading: coursesLoading } = useApi(() => api.getCourses())
  const { data: students, loading: studentsLoading } = useApi(() => api.getAllStudents())
  const progressMetrics = useProgressMetrics()
  const riskMetrics = useRiskFlags()

  // Generate course reports
  const courseReports = useMemo((): CourseReport[] => {
    if (!courses || !progressMetrics || !('byCourse' in progressMetrics)) return []
    
    return progressMetrics.byCourse.map(metrics => ({
      courseId: metrics.courseId,
      courseName: metrics.courseName,
      totalStudents: metrics.studentCount,
      totalCourses: 1,
      totalSubmissions: metrics.totalSubmissions,
      onTimeSubmissions: metrics.onTimeSubmissions,
      lateSubmissions: metrics.lateSubmissions,
      averageGrade: 85 + Math.random() * 10, // Mock grade
      completionRate: metrics.completionRate,
      onTimePercentage: metrics.onTimePercentage
    }))
  }, [courses, progressMetrics])

  // Generate student reports
  const studentReports = useMemo((): StudentReport[] => {
    if (!students || !riskMetrics) return []
    
    return riskMetrics.flags.map(flag => ({
      studentId: flag.studentId,
      studentName: flag.studentName,
      email: students.find(s => s.userId === flag.studentId)?.profile.emailAddress || '',
      courseId: flag.courseId,
      courseName: flag.courseName,
      submissionsCount: Math.floor(Math.random() * 10) + 5,
      onTimeSubmissions: Math.floor(Math.random() * 8) + 2,
      lateSubmissions: Math.floor(Math.random() * 3),
      averageGrade: 60 + Math.random() * 35,
      completionRate: Math.random() * 100,
      riskLevel: flag.riskLevel,
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }))
  }, [students, riskMetrics])

  // Chart data for courses
  const courseChartData: ChartData[] = courseReports.map(course => ({
    name: course.courseName.length > 15 ? course.courseName.substring(0, 15) + '...' : course.courseName,
    value: course.onTimePercentage,
    percentage: course.onTimePercentage
  }))

  // Risk distribution chart data
  const riskChartData: ChartData[] = riskMetrics ? [
    { name: 'Low Risk', value: riskMetrics.lowRisk, color: '#28a745' },
    { name: 'Medium Risk', value: riskMetrics.mediumRisk, color: '#ffc107' },
    { name: 'High Risk', value: riskMetrics.highRisk, color: '#dc3545' }
  ] : []

  // Mock time series data
  const timeSeriesData: TimeSeriesData[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString(),
      submissions: Math.floor(Math.random() * 50) + 20,
      onTimeSubmissions: Math.floor(Math.random() * 40) + 15,
      lateSubmissions: Math.floor(Math.random() * 10) + 2,
      averageGrade: 75 + Math.random() * 20
    }
  })

  const exportCourseData = () => {
    exportToCsv({
      filename: 'course_reports',
      columns: [
        { key: 'courseName', label: 'Course Name' },
        { key: 'totalStudents', label: 'Total Students' },
        { key: 'totalSubmissions', label: 'Total Submissions' },
        { key: 'onTimeSubmissions', label: 'On Time Submissions' },
        { key: 'lateSubmissions', label: 'Late Submissions' },
        { key: 'onTimePercentage', label: 'On Time %', formatter: csvFormatters.percentage },
        { key: 'completionRate', label: 'Completion Rate %', formatter: csvFormatters.percentage },
        { key: 'averageGrade', label: 'Average Grade' }
      ],
      data: courseReports
    })
  }

  const exportStudentData = () => {
    exportToCsv({
      filename: 'student_reports',
      columns: [
        { key: 'studentName', label: 'Student Name' },
        { key: 'email', label: 'Email' },
        { key: 'courseName', label: 'Course' },
        { key: 'submissionsCount', label: 'Total Submissions' },
        { key: 'onTimeSubmissions', label: 'On Time' },
        { key: 'lateSubmissions', label: 'Late' },
        { key: 'averageGrade', label: 'Average Grade' },
        { key: 'completionRate', label: 'Completion Rate %', formatter: csvFormatters.percentage },
        { key: 'riskLevel', label: 'Risk Level' },
        { key: 'lastActivity', label: 'Last Activity', formatter: csvFormatters.date }
      ],
      data: studentReports
    })
  }

  if (coursesLoading || studentsLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading reports...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-2">Reports & Analytics</h1>
          <p className="text-muted">Comprehensive insights and data exports</p>
        </div>
        <div className="d-flex gap-2">
          {activeTab === 'courses' && (
            <Button onClick={exportCourseData} variant="outline-primary">
              Export Course Data
            </Button>
          )}
          {activeTab === 'students' && (
            <Button onClick={exportStudentData} variant="outline-primary">
              Export Student Data
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'cohorts' ? 'active' : ''}`}
            onClick={() => setActiveTab('cohorts')}
          >
            Cohorts
          </button>
        </li>
      </ul>

      {/* Course Reports Tab */}
      {activeTab === 'courses' && (
        <div className="row">
          <div className="col-md-8 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={courseChartData}
                  title="On-Time Submission Rate by Course"
                  yAxisKey="value"
                  height={400}
                />
              </CardContent>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <h3 className="text-primary">{courseReports.length}</h3>
                  <small className="text-muted">Total Courses</small>
                </div>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td>Avg Completion Rate</td>
                        <td className="text-end">
                          <strong>
                            {courseReports.length > 0 
                              ? (courseReports.reduce((sum, c) => sum + c.completionRate, 0) / courseReports.length).toFixed(1)
                              : 0}%
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Avg On-Time Rate</td>
                        <td className="text-end">
                          <strong>
                            {courseReports.length > 0 
                              ? (courseReports.reduce((sum, c) => sum + c.onTimePercentage, 0) / courseReports.length).toFixed(1)
                              : 0}%
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Total Students</td>
                        <td className="text-end">
                          <strong>{courseReports.reduce((sum, c) => sum + c.totalStudents, 0)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-12">
            <Card>
              <CardHeader>
                <CardTitle>Submission Trends (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={timeSeriesData}
                  lines={[
                    { key: 'submissions', color: '#0d6efd', name: 'Total Submissions' },
                    { key: 'onTimeSubmissions', color: '#28a745', name: 'On Time' },
                    { key: 'lateSubmissions', color: '#dc3545', name: 'Late' }
                  ]}
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Student Reports Tab */}
      {activeTab === 'students' && (
        <div className="row">
          <div className="col-md-8 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={riskChartData}
                  height={400}
                />
              </CardContent>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3">
                  <h3 className="text-info">{studentReports.length}</h3>
                  <small className="text-muted">Total Students</small>
                </div>
                {riskMetrics && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-danger">High Risk:</span>
                      <strong>{riskMetrics.highRisk}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-warning">Medium Risk:</span>
                      <strong>{riskMetrics.mediumRisk}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-success">Low Risk:</span>
                      <strong>{riskMetrics.lowRisk}</strong>
                    </div>
                  </div>
                )}
                <div className="small">
                  <div>Avg Completion Rate: <strong>
                    {studentReports.length > 0 
                      ? (studentReports.reduce((sum, s) => sum + s.completionRate, 0) / studentReports.length).toFixed(1)
                      : 0}%
                  </strong></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-12">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Submissions</th>
                        <th>On Time</th>
                        <th>Completion Rate</th>
                        <th>Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentReports.slice(0, 20).map(student => (
                        <tr key={`${student.courseId}-${student.studentId}`}>
                          <td>{student.studentName}</td>
                          <td>{student.courseName}</td>
                          <td>{student.submissionsCount}</td>
                          <td>{student.onTimeSubmissions}</td>
                          <td>{student.completionRate.toFixed(1)}%</td>
                          <td>
                            <span className={`badge ${
                              student.riskLevel === 'high' ? 'bg-danger' :
                              student.riskLevel === 'medium' ? 'bg-warning' :
                              'bg-success'
                            }`}>
                              {student.riskLevel}
                            </span>
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
      )}

      {/* Cohorts Tab */}
      {activeTab === 'cohorts' && (
        <div className="row">
          <div className="col-12">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="alert alert-info">
                  <h5>Coming Soon</h5>
                  <p className="mb-0">
                    Cohort analysis will be available once we implement grouping functionality.
                    This will include cohort performance comparisons, retention rates, and progression tracking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
