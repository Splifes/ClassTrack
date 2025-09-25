import { useMemo } from 'react'
import { useApi } from './useApi'
import { api } from '../services/api'

export interface RiskFlag {
  studentId: string
  studentName: string
  courseId: string
  courseName: string
  riskLevel: 'low' | 'medium' | 'high'
  reasons: string[]
  score: number // 0-100, higher is more at risk
}

export interface RiskMetrics {
  totalStudents: number
  lowRisk: number
  mediumRisk: number
  highRisk: number
  flags: RiskFlag[]
}

export function useRiskFlags(courseId?: string) {
  const { data: courses } = useApi(() => api.getCourses())
  const { data: students } = useApi(() => api.getAllStudents())

  const riskMetrics = useMemo(() => {
    if (!courses || !students) return null

    const calculateStudentRisk = (student: any): RiskFlag => {
      const course = courses.find(c => c.id === student.courseId)
      const reasons: string[] = []
      let score = 0

      // Mock attendance data - in real app would fetch from API
      const attendanceRate = Math.random() * 100
      const submissionRate = Math.random() * 100
      const averageGrade = Math.random() * 40 + 60
      const lateSubmissions = Math.floor(Math.random() * 5)

      // Risk calculation rules
      if (attendanceRate < 70) {
        reasons.push(`Low attendance: ${attendanceRate.toFixed(1)}%`)
        score += 30
      } else if (attendanceRate < 85) {
        reasons.push(`Moderate attendance: ${attendanceRate.toFixed(1)}%`)
        score += 15
      }

      if (submissionRate < 60) {
        reasons.push(`Low submission rate: ${submissionRate.toFixed(1)}%`)
        score += 25
      } else if (submissionRate < 80) {
        reasons.push(`Moderate submission rate: ${submissionRate.toFixed(1)}%`)
        score += 10
      }

      if (averageGrade < 70) {
        reasons.push(`Low average grade: ${averageGrade.toFixed(1)}`)
        score += 20
      } else if (averageGrade < 80) {
        reasons.push(`Moderate average grade: ${averageGrade.toFixed(1)}`)
        score += 10
      }

      if (lateSubmissions > 2) {
        reasons.push(`Multiple late submissions: ${lateSubmissions}`)
        score += 15
      } else if (lateSubmissions > 0) {
        reasons.push(`Some late submissions: ${lateSubmissions}`)
        score += 5
      }

      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high'
      if (score >= 50) {
        riskLevel = 'high'
      } else if (score >= 25) {
        riskLevel = 'medium'
      } else {
        riskLevel = 'low'
      }

      // Add positive indicators for low risk
      if (riskLevel === 'low' && reasons.length === 0) {
        reasons.push('Good attendance and performance')
      }

      return {
        studentId: student.userId,
        studentName: student.profile.name.fullName,
        courseId: student.courseId,
        courseName: course?.name || 'Unknown Course',
        riskLevel,
        reasons,
        score: Math.min(score, 100)
      }
    }

    const filteredStudents = courseId 
      ? students.filter(s => s.courseId === courseId)
      : students

    const flags = filteredStudents.map(calculateStudentRisk)

    const metrics: RiskMetrics = {
      totalStudents: flags.length,
      lowRisk: flags.filter(f => f.riskLevel === 'low').length,
      mediumRisk: flags.filter(f => f.riskLevel === 'medium').length,
      highRisk: flags.filter(f => f.riskLevel === 'high').length,
      flags: flags.sort((a, b) => b.score - a.score) // Sort by risk score descending
    }

    return metrics
  }, [courses, students, courseId])

  return riskMetrics
}

export function useHighRiskStudents(limit: number = 10) {
  const riskMetrics = useRiskFlags()
  
  return useMemo(() => {
    if (!riskMetrics) return []
    
    return riskMetrics.flags
      .filter(flag => flag.riskLevel === 'high' || flag.riskLevel === 'medium')
      .slice(0, limit)
  }, [riskMetrics, limit])
}
