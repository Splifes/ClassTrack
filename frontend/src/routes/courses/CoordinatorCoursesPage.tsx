import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'
import { useFilters } from '../../hooks/useFilters'
import { api } from '../../services/api'
import { SearchBox } from '../../components/filters/SearchBox'
import { MultiSelect } from '../../components/filters/MultiSelect'

export default function CoordinatorCoursesPage() {
  const { data: courses, loading, error } = useApi(() => api.getAllCourses())

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
    filters,
    clearFilters, 
    hasActiveFilters, 
    totalCount, 
    filteredCount 
  } = useFilters(courses, filterCourses)

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
        <h1 className="mb-3">All Courses</h1>
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
          <h1 className="mb-1">All Domain Courses</h1>
          <p className="text-muted mb-0">Showing {filteredCount} of {totalCount} courses</p>
        </div>
        <button className="btn btn-primary">Create New Course</button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <SearchBox onSearch={(query) => updateFilter('search', query)} placeholder="Search all courses..." />
            </div>
            <div className="col-md-4">
              <MultiSelect options={statusOptions} selected={filters.status} onChange={(status) => updateFilter('status', status)} placeholder="Filter by status" />
            </div>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="alert alert-info">{hasActiveFilters ? 'No courses match filters.' : 'No courses found in the domain.'}</div>
      ) : (
        <div className="list-group">
          {filteredCourses.map(course => (
            <Link key={course.id} to={`/courses/${course.id}`} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{course.name}</h5>
                <small>{course.courseState}</small>
              </div>
              <p className="mb-1">{course.section || 'No section'}</p>
              <small>ID: {course.id}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
