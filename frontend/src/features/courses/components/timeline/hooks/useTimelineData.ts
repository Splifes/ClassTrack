import { useMemo } from 'react'
import { useApi } from '../../../../../hooks/useApi'
import { api } from '../../../../../services/api'
import type { TimelineEvent, TimelineFilterType } from '../../../types/timeline'
import { getClassTopic } from '../utils/mockDataGenerators'
import { 
  sortEventsByDate, 
  filterEventsByType, 
  filterPastEvents, 
  limitEvents 
} from '../../../../../shared/utils/timelineHelpers'

interface UseTimelineDataProps {
  courseId: string
  filter: TimelineFilterType
  showPastEvents: boolean
  maxEvents: number
}

export function useTimelineData({ 
  courseId, 
  filter, 
  showPastEvents, 
  maxEvents 
}: UseTimelineDataProps) {
  // Fetch real data from Google Classroom
  const { data: coursework, loading: courseworkLoading } = useApi(
    () => api.getCoursework(courseId), 
    [courseId]
  )
  const { data: students } = useApi(
    () => api.getCourseStudents(courseId), 
    [courseId]
  )
  
  // Build timeline from real Classroom data
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    const events: TimelineEvent[] = []
    
    // Add coursework (assignments) from Google Classroom
    if (coursework) {
      coursework.forEach(work => {
        const creationDate = work.creationTime
        const dueDate = work.dueDate ? 
          new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day) : 
          null
        
        events.push({
          id: work.id,
          type: 'assignment',
          title: work.title,
          description: work.description || 'Assignment from Google Classroom',
          date: creationDate,
          status: dueDate && dueDate < new Date() ? 'completed' : 'pending',
          metadata: {
            dueDate: dueDate?.toISOString(),
            submissionCount: students?.length || 0,
            workType: 'ASSIGNMENT'
          }
        })
      })
    }
    
    // Add mock class sessions (since Google Classroom doesn't track actual class meetings)
    const now = new Date()
    for (let i = 0; i < 15; i++) {
      const classDate = new Date(now)
      classDate.setDate(classDate.getDate() - (i * 3)) // Classes every 3 days
      
      // Only add classes on weekdays
      if ([1, 2, 3, 4, 5].includes(classDate.getDay())) {
        events.push({
          id: `class-${i}`,
          type: 'class',
          title: `Clase ${i + 1}: ${getClassTopic(i)}`,
          description: 'Sesión de clase presencial',
          date: classDate.toISOString(),
          status: 'completed',
          metadata: {
            submissionCount: students?.length || 0,
            attendanceRate: Math.floor(Math.random() * 20) + 80 // 80-100%
          }
        })
      }
    }
    
    return sortEventsByDate(events)
  }, [coursework, students])
  
  // Apply filters and limits
  const filteredEvents = useMemo(() => {
    let filtered = timelineEvents
    filtered = filterEventsByType(filtered, filter)
    filtered = filterPastEvents(filtered, showPastEvents)
    return limitEvents(filtered, maxEvents)
  }, [timelineEvents, filter, showPastEvents, maxEvents])
  
  return {
    events: filteredEvents,
    loading: courseworkLoading,
    totalEvents: timelineEvents.length
  }
}
