import { useState, useMemo } from 'react'

export interface FilterState {
  search: string
  courses: string[]
  status: string[]
  dateRange?: {
    start: string
    end: string
  }
}

export function useFilters<T>(
  data: T[] | null,
  filterFn: (item: T, filters: FilterState) => boolean
) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    courses: [],
    status: []
  })

  const filteredData = useMemo(() => {
    if (!data) return []
    
    return data.filter(item => filterFn(item, filters))
  }, [data, filters, filterFn])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      courses: [],
      status: []
    })
  }

  const hasActiveFilters = useMemo(() => {
    return filters.search !== '' || 
           filters.courses.length > 0 || 
           filters.status.length > 0 ||
           (filters.dateRange && (filters.dateRange.start || filters.dateRange.end))
  }, [filters])

  return {
    filters,
    filteredData,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    totalCount: data?.length || 0,
    filteredCount: filteredData.length
  }
}
