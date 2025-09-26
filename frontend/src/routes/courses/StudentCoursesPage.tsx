import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { useFilters } from '../../hooks/useFilters'
import { api } from '../../services/api'
import { SearchBox } from '../../components/filters/SearchBox'
import { MultiSelect } from '../../components/filters/MultiSelect'

export default function StudentCoursesPage() {
  const { data: courses, loading, error } = useApi(() => api.getCourses())

  // Filter function for courses
  const filterCourses = (course: any, filters: any) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = course.name.toLowerCase().includes(searchLower)
      const matchesSection = course.section?.toLowerCase().includes(searchLower)
      const matchesDescription = course.description?.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesSection && !matchesDescription) return false
    }

    // Status filter
    if (filters.status.length > 0) {
      if (!filters.status.includes(course.courseState)) return false
    }

    return true
  }

  const {
    filters,
    filteredData: filteredCourses,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    totalCount,
    filteredCount
  } = useFilters(courses, filterCourses)

  // Get status options for filter
  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ARCHIVED', label: 'Archived' },
    { value: 'PROVISIONED', label: 'Provisioned' },
    { value: 'DECLINED', label: 'Declined' },
    { value: 'SUSPENDED', label: 'Suspended' }
  ]

  if (loading) {
    return (
      <div className="container-narrow">
        <h1 className="mb-3">My Courses</h1>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading courses...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-narrow">
        <h1 className="mb-3">My Courses</h1>
        <div className="alert alert-danger">
          Error loading courses: {error}
        </div>
      </div>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="container-narrow">
        <h1 className="mb-3">My Courses</h1>
        <div className="alert alert-info">
          No courses found. Make sure you are enrolled in Google Classroom courses.
        </div>
      </div>
    )
  }

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">My Courses</h1>
          <p className="text-muted mb-0">
            Showing {filteredCount} of {totalCount} courses
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
            <div className="col-md-8">
              <label className="form-label">Search Courses</label>
              <SearchBox
                placeholder="Search by name, section, or description..."
                onSearch={(query) => updateFilter('search', query)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Filter by Status</label>
              <MultiSelect
                options={statusOptions}
                selected={filters.status}
                onChange={(status) => updateFilter('status', status)}
                placeholder="All statuses"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredCourses.length === 0 ? (
        <div className="alert alert-info">
          {hasActiveFilters 
            ? "No courses match your filters."
            : "No courses found."
          }
        </div>
      ) : (
        <div className="row">
          {filteredCourses.map(course => (
            <div key={course.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.name}</h5>
                  {course.section && (
                    <p className="card-text text-muted">{course.section}</p>
                  )}
                  <div className="flex-grow-1">
                    {course.description && (
                      <p className="card-text small">{course.description.substring(0, 120)}...</p>
                    )}
                  </div>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        State: <span className={`badge ${course.courseState === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                          {course.courseState}
                        </span>
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <Link className="btn btn-primary btn-sm flex-grow-1" to={`/courses/${course.id}`}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
