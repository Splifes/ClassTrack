import { useApi } from '../hooks/useApi'
import { useFilters } from '../hooks/useFilters'
import { api } from '../services/api'
import { SearchBox } from '../components/filters/SearchBox'
import { MultiSelect } from '../components/filters/MultiSelect'

export default function Students() {
  const { data: students, loading, error } = useApi(() => api.getAllStudents())
  const { data: courses } = useApi(() => api.getCourses())

  // Filter function for students
  const filterStudents = (student: any, filters: any) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = student.profile.name.fullName.toLowerCase().includes(searchLower)
      const matchesEmail = student.profile.emailAddress.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesEmail) return false
    }

    // Course filter
    if (filters.courses.length > 0) {
      if (!filters.courses.includes(student.courseId)) return false
    }

    return true
  }

  const {
    filters,
    filteredData: filteredStudents,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    totalCount,
    filteredCount
  } = useFilters(students, filterStudents)

  // Get course options for filter
  const courseOptions = courses?.map(course => ({
    value: course.id,
    label: course.name
  })) || []

  if (loading) {
    return (
      <div className="container-narrow">
        <h1 className="mb-3">Students</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading students...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-narrow">
        <h1 className="mb-3">Students</h1>
        <div className="alert alert-danger">
          Error loading students: {error}
        </div>
      </div>
    )
  }

  if (!students || students.length === 0) {
    return (
      <div className="container-narrow">
        <h1 className="mb-3">Students</h1>
        <div className="alert alert-info">
          No students found. Make sure you have access to courses with enrolled students.
        </div>
      </div>
    )
  }

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Students</h1>
          <p className="text-muted mb-0">
            Showing {filteredCount} of {totalCount} students
            {hasActiveFilters && <span className="text-info"> (filtered)</span>}
          </p>
        </div>
        {hasActiveFilters && (
          <button className="btn btn-outline-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Search Students</label>
              <SearchBox
                placeholder="Search by name or email..."
                onSearch={(query) => updateFilter('search', query)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Filter by Course</label>
              <MultiSelect
                options={courseOptions}
                selected={filters.courses}
                onChange={(courses) => updateFilter('courses', courses)}
                placeholder="All courses"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredStudents.length === 0 ? (
        <div className="alert alert-info">
          {hasActiveFilters 
            ? "No students match your current filters. Try adjusting your search criteria."
            : "No students found."
          }
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={`${student.courseId}-${student.userId}-${index}`}>
                  <td>
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
                        <small className="text-muted">ID: {student.userId}</small>
                      </div>
                    </div>
                  </td>
                  <td>{student.profile.emailAddress}</td>
                  <td>
                    <span className="badge bg-primary">{student.courseName}</span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" title="View Profile">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                          <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1H1Z"/>
                        </svg>
                      </button>
                      <button className="btn btn-outline-info" title="View Progress">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
