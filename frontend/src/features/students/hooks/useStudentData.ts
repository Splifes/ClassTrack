import { useMemo } from 'react'
import { useApi } from '../../../hooks/useApi'
import { api } from '../../../services/api'

export function useStudentData(courseId: string) {
  const { data: studentData, loading, error } = useApi(() => api.getStudentViewData(courseId), [courseId])

  const chartData = useMemo(() => {
    if (!studentData?.student_analytics) return null

    const analytics = studentData.student_analytics

    // Assignment status chart
    const assignmentStatusData = analytics.overview ? [
      { name: 'Completed', value: analytics.overview.completed_assignments, color: '#28a745' },
      { name: 'Pending', value: analytics.overview.pending_assignments, color: '#ffc107' },
      { name: 'Graded', value: analytics.overview.graded_assignments, color: '#17a2b8' }
    ] : []

    // Grade distribution for my assignments
    const myGrades = studentData.my_grades || []
    const gradeRanges = {
      'A (90-100)': myGrades.filter((g: any) => g.percentage >= 90).length,
      'B (80-89)': myGrades.filter((g: any) => g.percentage >= 80 && g.percentage < 90).length,
      'C (70-79)': myGrades.filter((g: any) => g.percentage >= 70 && g.percentage < 80).length,
      'D (60-69)': myGrades.filter((g: any) => g.percentage >= 60 && g.percentage < 70).length,
      'F (<60)': myGrades.filter((g: any) => g.percentage < 60).length
    }

    const myGradeDistribution = Object.entries(gradeRanges).map(([name, value]) => ({
      name, value
    })).filter(item => item.value > 0)

    return {
      assignmentStatus: assignmentStatusData,
      myGradeDistribution
    }
  }, [studentData])

  return {
    studentData,
    chartData,
    loading,
    error,
    analytics: studentData?.student_analytics || {},
    accessInfo: studentData?.access_info || {}
  }
}
