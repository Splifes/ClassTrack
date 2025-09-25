export interface ReportMetrics {
  totalStudents: number
  totalCourses: number
  totalSubmissions: number
  onTimeSubmissions: number
  lateSubmissions: number
  averageGrade: number
  completionRate: number
  onTimePercentage: number
}

export interface CourseReport extends ReportMetrics {
  courseId: string
  courseName: string
  teacherName?: string
  startDate?: string
  endDate?: string
}

export interface StudentReport {
  studentId: string
  studentName: string
  email: string
  courseId: string
  courseName: string
  submissionsCount: number
  onTimeSubmissions: number
  lateSubmissions: number
  averageGrade: number
  completionRate: number
  riskLevel: 'low' | 'medium' | 'high'
  lastActivity?: string
}

export interface TimeSeriesData {
  date: string
  submissions: number
  onTimeSubmissions: number
  lateSubmissions: number
  averageGrade: number
}

export interface ChartData {
  name: string
  value: number
  percentage?: number
  color?: string
  [key: string]: any // Index signature for Recharts compatibility
}

export interface ReportFilters {
  dateRange: {
    start: string
    end: string
  }
  courseIds: string[]
  teacherIds: string[]
  studentIds: string[]
  riskLevels: ('low' | 'medium' | 'high')[]
}

export type ReportType = 'courses' | 'students' | 'cohorts'

export interface ExportOptions {
  format: 'csv' | 'png' | 'pdf'
  includeCharts: boolean
  includeFilters: boolean
}
