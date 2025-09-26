import type { TimelineFilterType } from '../../types/timeline'

interface TimelineFiltersProps {
  filter: TimelineFilterType
  onFilterChange: (filter: TimelineFilterType) => void
}

export function TimelineFilters({ filter, onFilterChange }: TimelineFiltersProps) {
  return (
    <div className="d-flex gap-2">
      <select 
        className="form-select form-select-sm" 
        value={filter} 
        onChange={(e) => onFilterChange(e.target.value as TimelineFilterType)}
      >
        <option value="all">Todos los eventos</option>
        <option value="classes">Solo clases</option>
        <option value="assignments">Solo tareas</option>
        <option value="announcements">Solo anuncios</option>
      </select>
    </div>
  )
}
