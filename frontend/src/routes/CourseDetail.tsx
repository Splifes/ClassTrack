import { Link, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { api } from '../services/api'

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>()
  
  const { data: course, loading: courseLoading, error: courseError } = useApi(
    () => api.getCourse(courseId!), 
    [courseId]
  )
  
  const { data: coursework, loading: courseworkLoading } = useApi(
    () => api.getCoursework(courseId!), 
    [courseId]
  )
  
  const { data: students, loading: studentsLoading } = useApi(
    () => api.getCourseStudents(courseId!), 
    [courseId]
  )
  
  const { data: teachers, loading: teachersLoading } = useApi(
    () => api.getCourseTeachers(courseId!), 
    [courseId]
  )

  if (courseLoading) {
    return (
      <div className="container-narrow">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading course...</span>
          </div>
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className="container-narrow">
        <div className="alert alert-danger">
          Error loading course: {courseError || 'Course not found'}
        </div>
        <Link to="/courses" className="btn btn-secondary">Back to Courses</Link>
      </div>
    )
  }

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="mb-2">{course.name}</h1>
          {course.section && <p className="text-muted mb-1">Section: {course.section}</p>}
          <p className="text-muted">Course ID: {course.id}</p>
        </div>
        <Link to="/courses" className="btn btn-secondary">Back to Courses</Link>
      </div>

      {course.description && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Description</h5>
            <p className="card-text">{course.description}</p>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Teachers {teachersLoading ? '...' : `(${teachers?.length || 0})`}</h5>
            </div>
            <div className="card-body">
              {teachersLoading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : teachers && teachers.length > 0 ? (
                <div className="list-group list-group-flush">
                  {teachers.map(teacher => (
                    <div key={teacher.userId} className="list-group-item px-0">
                      <div className="d-flex align-items-center">
                        {teacher.profile.photoUrl && (
                          <img 
                            src={teacher.profile.photoUrl} 
                            alt={teacher.profile.name.fullName}
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                        )}
                        <div>
                          <div className="fw-medium">{teacher.profile.name.fullName}</div>
                          <small className="text-muted">{teacher.profile.emailAddress}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No teachers found</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Students {studentsLoading ? '...' : `(${students?.length || 0})`}</h5>
            </div>
            <div className="card-body">
              {studentsLoading ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : students && students.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div className="list-group list-group-flush">
                    {students.map(student => (
                      <div key={student.userId} className="list-group-item px-0">
                        <div className="d-flex align-items-center">
                          {student.profile.photoUrl && (
                            <img 
                              src={student.profile.photoUrl} 
                              alt={student.profile.name.fullName}
                              className="rounded-circle me-2"
                              width="24"
                              height="24"
                            />
                          )}
                          <div>
                            <div className="small fw-medium">{student.profile.name.fullName}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted">No students enrolled</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Coursework {courseworkLoading ? '...' : `(${coursework?.length || 0})`}</h5>
        </div>
        <div className="card-body">
          {courseworkLoading ? (
            <div className="text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : coursework && coursework.length > 0 ? (
            <div className="list-group list-group-flush">
              {coursework.map(work => (
                <Link 
                  key={work.id} 
                  className="list-group-item list-group-item-action px-0"
                  to={`/courses/${courseId}/classes/${work.id}`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{work.title}</h6>
                      {work.description && (
                        <p className="mb-1 text-muted small">{work.description}</p>
                      )}
                      <small className="text-muted">State: {work.state}</small>
                    </div>
                    <div className="text-end">
                      {work.dueDate && (
                        <small className="text-muted">
                          Due: {work.dueDate.year}-{work.dueDate.month.toString().padStart(2, '0')}-{work.dueDate.day.toString().padStart(2, '0')}
                        </small>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted">No coursework found</p>
          )}
        </div>
      </div>
    </div>
  )
}
