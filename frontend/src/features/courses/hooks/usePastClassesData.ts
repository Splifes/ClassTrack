import { useMemo } from 'react'
import { useApi } from '../../../hooks/useApi'
import { api } from '../../../services/api'
import { getClassTopic } from '../utils/pastClassesHelpers'

interface ClassSession {
  id: string
  date: string
  topic: string
  attendance: number
  totalStudents: number
  materials: number
  assignments: number
  averageEngagement: number
}

export function usePastClassesData(courseId: string, maxClasses: number = 10) {
  const { data: coursework } = useApi(() => api.getCoursework(courseId), [courseId])
  const { data: students } = useApi(() => api.getCourseStudents(courseId), [courseId])
  
  const pastClasses = useMemo((): ClassSession[] => {
    const classes: ClassSession[] = []
    const now = new Date()
    
    for (let i = 1; i <= maxClasses; i++) {
      const classDate = new Date(now)
      classDate.setDate(classDate.getDate() - (i * 3)) // Clases cada 3 días
      
      const totalStudents = students?.length || 20
      const attendanceVariation = Math.floor(Math.random() * 6) - 3 // ±3 students
      const attendance = Math.max(1, Math.min(totalStudents, totalStudents + attendanceVariation))
      
      classes.push({
        id: `class-${i}`,
        date: classDate.toISOString(),
        topic: getClassTopic(i),
        attendance: attendance,
        totalStudents: totalStudents,
        materials: Math.floor(Math.random() * 3) + 1,
        assignments: coursework ? Math.floor(coursework.length / maxClasses) : 0,
        averageEngagement: Math.floor(Math.random() * 30) + 70 // 70-100%
      })
    }
    
    return classes.reverse() // Más recientes primero
  }, [courseId, maxClasses, students, coursework])
  
  const stats = useMemo(() => {
    const totalClasses = pastClasses.length
    if (totalClasses === 0) {
        return {
            totalClasses: 0,
            avgAttendance: 0,
            attendanceRate: 0,
            totalMaterials: 0,
            totalAssignments: 0,
            avgEngagement: 0
        }
    }
    const avgAttendance = pastClasses.reduce((sum, cls) => sum + cls.attendance, 0) / totalClasses
    const avgTotalStudents = pastClasses.reduce((sum, cls) => sum + cls.totalStudents, 0) / totalClasses
    const attendanceRate = avgTotalStudents > 0 ? (avgAttendance / avgTotalStudents) * 100 : 0
    const totalMaterials = pastClasses.reduce((sum, cls) => sum + cls.materials, 0)
    const totalAssignments = pastClasses.reduce((sum, cls) => sum + cls.assignments, 0)
    const avgEngagement = pastClasses.reduce((sum, cls) => sum + cls.averageEngagement, 0) / totalClasses
    
    return {
      totalClasses,
      avgAttendance: Math.round(avgAttendance),
      attendanceRate: Math.round(attendanceRate),
      totalMaterials,
      totalAssignments,
      avgEngagement: Math.round(avgEngagement)
    }
  }, [pastClasses])
  
  const attendanceChartData = pastClasses.slice(-8).map(cls => ({
    name: `Clase ${pastClasses.indexOf(cls) + 1}`,
    value: Math.round((cls.attendance / cls.totalStudents) * 100),
    percentage: Math.round((cls.attendance / cls.totalStudents) * 100)
  }))

  return {
    pastClasses,
    stats,
    attendanceChartData
  }
}
