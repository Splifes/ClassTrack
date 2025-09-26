import type { TimelineEvent } from '../../features/courses/types/timeline'

/**
 * Utilidades para el manejo de eventos del timeline
 */

export function getEventIcon(type: string): string {
  switch (type) {
    case 'class': return '🎓'
    case 'assignment': return '📝'
    case 'announcement': return '📢'
    case 'material': return '📚'
    case 'submission': return '✅'
    default: return '📅'
  }
}

export function getEventColor(type: string): string {
  switch (type) {
    case 'class': return '#0ea5e9'
    case 'assignment': return '#f59e0b'
    case 'announcement': return '#8b5cf6'
    case 'material': return '#10b981'
    case 'submission': return '#06b6d4'
    default: return '#6b7280'
  }
}

export function sortEventsByDate(events: TimelineEvent[]): TimelineEvent[] {
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function filterEventsByType(
  events: TimelineEvent[], 
  filter: string
): TimelineEvent[] {
  if (filter === 'all') return events
  
  const filterMap = {
    'assignments': 'assignment',
    'classes': 'class', 
    'announcements': 'announcement'
  }
  
  const eventType = filterMap[filter as keyof typeof filterMap]
  return events.filter(event => event.type === eventType)
}

export function filterPastEvents(
  events: TimelineEvent[], 
  showPastEvents: boolean
): TimelineEvent[] {
  if (showPastEvents) return events
  
  const now = new Date()
  return events.filter(event => new Date(event.date) >= now)
}

export function limitEvents(events: TimelineEvent[], maxEvents: number): TimelineEvent[] {
  return events.slice(0, maxEvents)
}
