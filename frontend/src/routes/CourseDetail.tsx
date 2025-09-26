import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { api, CourseWork, CourseMaterial } from '../services/api';
import { PastClassesStats } from '../features/courses/components/past-classes-stats/PastClassesStats';
import { CourseTimeline, CompleteDataViewer } from '../features/courses';
import InsightsPage from '../features/courses/insights/InsightsPage';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const { userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'history' | 'complete' | 'classmates' | 'insights'>('overview');

  const { data: course, loading: courseLoading, error: courseError } = useApi(
    () => api.getCourse(courseId!),
    [courseId]
  );

  const { data: coursework, loading: courseworkLoading } = useApi(
    () => api.getCoursework(courseId!),
    [courseId]
  );

  const { data: materials, loading: materialsLoading } = useApi(
    () => api.getCourseMaterials(courseId!),
    [courseId]
  );

  type Activity = (CourseWork & { type: 'assignment' }) | (CourseMaterial & { type: 'material' });

  const combinedActivities: Activity[] = [
    ...(Array.isArray(coursework) ? coursework.map(item => ({ ...item, type: 'assignment' as const })) : []),
    ...(Array.isArray(materials) ? materials.map(item => ({ ...item, type: 'material' as const })) : [])
  ].sort((a, b) => new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime());

  const isLoadingActivities = courseworkLoading || materialsLoading;

  const { data: students, loading: studentsLoading } = useApi(
    () => api.getCourseStudents(courseId!),
    [courseId]
  );

  const { data: teachers, loading: teachersLoading } = useApi(
    () => api.getCourseTeachers(courseId!),
    [courseId]
  );

  const { data: studentViewData, loading: studentViewLoading } = useApi(
    () => api.getStudentViewData(courseId!),
    [courseId]
  );

  if (courseLoading) {
    return (
      <div className="container-narrow">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading course...</span>
          </div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="container-narrow">
        <div className="alert alert-danger">
          Error loading course: {courseError?.toString() || 'Course not found'}
        </div>
        <Link to="/courses" className="btn btn-secondary">Back to Courses</Link>
      </div>
    );
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

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📋 Overview
          </button>
        </li>
        {userRole === 'student' && (
          <>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'classmates' ? 'active' : ''}`}
                onClick={() => setActiveTab('classmates')}
              >
                👥 Classmates
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'insights' ? 'active' : ''}`}
                onClick={() => setActiveTab('insights')}
              >
                📊 Insights
              </button>
            </li>
          </>
        )}

        {userRole !== 'student' && (
          <>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                📅 Timeline
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                📊 Clases Anteriores
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'complete' ? 'active' : ''}`}
                onClick={() => setActiveTab('complete')}
              >
                🔍 Datos Completos
              </button>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/courses/${courseId}/attendance`}
              >
                📋 Attendance
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
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
              <h5 className="mb-0">Course Activities {isLoadingActivities ? '...' : `(${combinedActivities.length})`}</h5>
            </div>
            <div className="card-body">
              {isLoadingActivities ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : combinedActivities.length > 0 ? (
                <div className="list-group list-group-flush">
                  {combinedActivities.map(activity => (
                    <Link
                      key={activity.id}
                      className="list-group-item list-group-item-action px-0"
                      to={activity.type === 'assignment' ? `/courses/${courseId}/classes/${activity.id}` : activity.alternateLink}
                      target={activity.type === 'material' ? '_blank' : '_self'}
                      rel={activity.type === 'material' ? 'noopener noreferrer' : ''}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-center">
                          <span className="me-2">
                            {activity.type === 'assignment' ? '📝' : '📎'}
                          </span>
                          <div>
                            <h6 className="mb-1">{activity.title}</h6>
                            {activity.description && (
                              <p className="mb-1 text-muted small">{activity.description.substring(0, 150)}...</p>
                            )}
                            <small className="text-muted">Type: {activity.type}</small>
                          </div>
                        </div>
                        <div className="text-end">
                          {activity.type === 'assignment' && activity.dueDate && (
                            <small className="text-muted">
                              Due: {activity.dueDate.year}-{activity.dueDate.month.toString().padStart(2, '0')}-{activity.dueDate.day.toString().padStart(2, '0')}
                            </small>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No activities found</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'insights' && userRole === 'student' && (
        <InsightsPage />
      )}

      {activeTab === 'classmates' && userRole === 'student' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Classmates</h5>
          </div>
          <div className="card-body">
            {studentViewLoading ? (
              <div className="text-center"><div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div></div>
            ) : studentViewData && studentViewData.classmates && studentViewData.classmates.length > 0 ? (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <div className="list-group list-group-flush">
                  {studentViewData.classmates.map((student: any) => (
                    <div key={student.userId} className="list-group-item px-0">
                      <div className="d-flex align-items-center">
                        {student.profile.photoUrl && (
                          <img
                            src={student.profile.photoUrl}
                            alt={student.profile.name.fullName}
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                        )}
                        <div>
                          <div className="fw-medium">{student.profile.name.fullName}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted">No classmates found.</p>
            )}
          </div>
        </div>
      )}

      {userRole !== 'student' && (
        <>
          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <CourseTimeline courseId={courseId!} />
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <PastClassesStats courseId={courseId!} />
          )}

          {/* Complete Data Tab */}
          {activeTab === 'complete' && (
            <CompleteDataViewer courseId={courseId!} />
          )}
        </>
      )}
    </div>
  );
}
