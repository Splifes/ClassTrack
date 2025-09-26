import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { useFilters } from '../../hooks/useFilters'
import { api } from '../../services/api'
import { SearchBox } from '../../components/filters/SearchBox'
import { MultiSelect } from '../../components/filters/MultiSelect'

export default function TeacherCoursesPage() {
  const { data: courses, loading, error } = useApi(() => api.getTeachingCourses())

  const filterCourses = (course: any, filters: any) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = course.name.toLowerCase().includes(searchLower)
      if (!matchesName) return false
    }
    if (filters.status.length > 0) {
      if (!filters.status.includes(course.courseState)) return false
    }
    return true
  }

  const { 
    filteredData: filteredCourses, 
    updateFilter, 
    clearFilters, 
    hasActiveFilters, 
    totalCount, 
    filteredCount 
  } = useFilters(courses, filterCourses)

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ARCHIVED', label: 'Archived' },
  ]

  if (loading) {
    return (
      <div className="container-narrow">
        <h1 className="mb-3">Teaching Courses</h1>
        <div className="d-flex justify-content-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger">Error loading courses: {error}</div>
  }

  return (
    <div className="container-narrow">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Teaching Courses</h1>
          <p className="text-muted mb-0">Showing {filteredCount} of {totalCount} courses</p>
        </div>
        <button className="btn btn-primary">Create Course</button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <SearchBox onSearch={(query) => updateFilter('search', query)} placeholder="Search courses..." />
            </div>
            <div className="col-md-4">
              <MultiSelect options={statusOptions} selected={[]} onChange={(status) => updateFilter('status', status)} placeholder="Filter by status" />
            </div>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="alert alert-info">{hasActiveFilters ? 'No courses match filters.' : 'You are not teaching any courses.'}</div>
      ) : (
        <div className="row">
          {filteredCourses.map(course => (
            <div key={course.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text text-muted">{course.section}</p>
                  <Link className="btn btn-primary btn-sm" to={`/courses/${course.id}`}>Manage Course</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
