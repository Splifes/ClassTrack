export interface TimelineEvent {
  id: string
  type: 'assignment' | 'announcement' | 'material' | 'submission' | 'class'
  title: string
  description?: string
  date: string
  status?: 'completed' | 'pending' | 'overdue' | 'graded'
  metadata?: TimelineEventMetadata
}

export interface TimelineEventMetadata {
  dueDate?: string
  submissionCount?: number
  averageGrade?: number
  attachments?: number
  workType?: string
  attendanceRate?: number
}

export interface CourseTimelineProps {
  courseId: string
  showPastEvents?: boolean
  maxEvents?: number
}

export type TimelineFilterType = 'all' | 'assignments' | 'classes' | 'announcements'
