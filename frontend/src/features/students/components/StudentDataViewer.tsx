import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '../../../shared/components/ui'
import { useStudentData } from '../hooks/useStudentData'
import { StudentOverview } from './overview/StudentOverview'
import { StudentAssignments } from './assignments/StudentAssignments'
import { StudentGrades } from './grades/StudentGrades'
import { StudentClassmates } from './classmates/StudentClassmates'

interface StudentDataViewerProps {
  courseId: string
}

export function StudentDataViewer({ courseId }: StudentDataViewerProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'assignments' | 'grades' | 'classmates'>('overview')
  const [showRawData, setShowRawData] = useState(false)
  
  const { studentData, chartData, loading, error, analytics, accessInfo } = useStudentData(courseId)

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading your course data...</span>
          </div>
          <p className="mt-3 text-muted">Fetching your personal course information...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="alert alert-danger">
            <h5>Error Loading Your Data</h5>
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!studentData) {
    return (
      <Card>
        <CardContent>
          <p className="text-muted">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>My Course Dashboard</h2>
          <p className="text-muted">Your personal view of this course</p>
        </div>
        <div className="d-flex gap-2">
          <Badge variant="info">Student View</Badge>
          <Button 
            variant={showRawData ? 'primary' : 'outline-primary'}
            onClick={() => setShowRawData(!showRawData)}
          >
            {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
          </Button>
        </div>
      </div>

      {/* Access Info */}
      <div className="alert alert-info mb-4">
        <h6 className="alert-heading">📋 Data Access Summary</h6>
        <div className="row">
          <div className="col-md-6">
            <strong>✅ Available Data:</strong>
            <ul className="small mb-0 mt-1">
              {accessInfo.accessible_data?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          {accessInfo.restricted_data?.length > 0 && (
            <div className="col-md-6">
              <strong>❌ Restricted Data:</strong>
              <ul className="small mb-0 mt-1">
                {accessInfo.restricted_data?.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Section Navigation */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 My Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'assignments' ? 'active' : ''}`}
            onClick={() => setActiveSection('assignments')}
          >
            📝 My Assignments
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'grades' ? 'active' : ''}`}
            onClick={() => setActiveSection('grades')}
          >
            🎯 My Grades
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeSection === 'classmates' ? 'active' : ''}`}
            onClick={() => setActiveSection('classmates')}
          >
            👥 Classmates
          </button>
        </li>
      </ul>

      {/* Render active section */}
      {activeSection === 'overview' && <StudentOverview analytics={analytics} chartData={chartData} />}
      {activeSection === 'assignments' && <StudentAssignments studentData={studentData} />}
      {activeSection === 'grades' && <StudentGrades studentData={studentData} chartData={chartData} analytics={analytics} />}
      {activeSection === 'classmates' && <StudentClassmates studentData={studentData} />}

      {/* Raw Data Section */}
      {showRawData && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Raw Student Data from Google Classroom API</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-light p-3" style={{ maxHeight: '500px', overflow: 'auto' }}>
                {JSON.stringify(studentData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
