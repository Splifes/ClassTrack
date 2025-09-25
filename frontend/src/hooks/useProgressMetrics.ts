import { useMemo } from 'react'
import { useApi } from './useApi'
import { api } from '../services/api'

export interface ProgressMetrics {
  totalSubmissions: number
  onTimeSubmissions: number
  lateSubmissions: number
  onTimePercentage: number
  averageGrade?: number
  completionRate: number
}

export interface CourseMetrics extends ProgressMetrics {
  courseId: string
  courseName: string
  studentCount: number
}

export function useProgressMetrics(courseId?: string) {
  const { data: courses } = useApi(() => api.getCourses())
  const { data: students } = useApi(() => api.getAllStudents())

  const metrics = useMemo(() => {
    if (!courses || !students) return null

    const calculateCourseMetrics = (cId: string): CourseMetrics => {
      const course = courses.find(c => c.id === cId)
      const courseStudents = students.filter(s => s.courseId === cId)
      
      // Mock submission data - in real app would fetch from API
      const mockSubmissions = generateMockSubmissions(cId, courseStudents.length)
      
      const totalSubmissions = mockSubmissions.length
      const onTimeSubmissions = mockSubmissions.filter(s => !s.late).length
      const lateSubmissions = mockSubmissions.filter(s => s.late).length
      const onTimePercentage = totalSubmissions > 0 ? (onTimeSubmissions / totalSubmissions) * 100 : 0
      const completionRate = courseStudents.length > 0 ? (totalSubmissions / (courseStudents.length * 5)) * 100 : 0 // Assuming 5 assignments per course

      return {
        courseId: cId,
        courseName: course?.name || 'Unknown Course',
        studentCount: courseStudents.length,
        totalSubmissions,
        onTimeSubmissions,
        lateSubmissions,
        onTimePercentage,
        completionRate: Math.min(completionRate, 100)
      }
    }

    if (courseId) {
      return calculateCourseMetrics(courseId)
    }

    // Calculate global metrics across all courses
    const allCourseMetrics = courses.map(course => calculateCourseMetrics(course.id))
    
    const globalMetrics: ProgressMetrics = {
      totalSubmissions: allCourseMetrics.reduce((sum, m) => sum + m.totalSubmissions, 0),
      onTimeSubmissions: allCourseMetrics.reduce((sum, m) => sum + m.onTimeSubmissions, 0),
      lateSubmissions: allCourseMetrics.reduce((sum, m) => sum + m.lateSubmissions, 0),
      onTimePercentage: 0,
      completionRate: 0
    }

    globalMetrics.onTimePercentage = globalMetrics.totalSubmissions > 0 
      ? (globalMetrics.onTimeSubmissions / globalMetrics.totalSubmissions) * 100 
      : 0

    const totalPossibleSubmissions = allCourseMetrics.reduce((sum, m) => sum + (m.studentCount * 5), 0)
    globalMetrics.completionRate = totalPossibleSubmissions > 0 
      ? (globalMetrics.totalSubmissions / totalPossibleSubmissions) * 100 
      : 0

    return {
      global: globalMetrics,
      byCourse: allCourseMetrics
    }
  }, [courses, students, courseId])

  return metrics
}

// Mock function to generate submission data
function generateMockSubmissions(courseId: string, studentCount: number) {
  const submissions = []
  const assignmentCount = 5 // Mock 5 assignments per course
  
  for (let i = 0; i < studentCount; i++) {
    for (let j = 0; j < assignmentCount; j++) {
      // 80% chance of submission, 15% chance of being late
      if (Math.random() > 0.2) {
        submissions.push({
          id: `${courseId}-${i}-${j}`,
          studentId: `student-${i}`,
          assignmentId: `assignment-${j}`,
          courseId,
          late: Math.random() < 0.15,
          submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          grade: Math.floor(Math.random() * 40) + 60 // Random grade between 60-100
        })
      }
    }
  }
  
  return submissions
}
