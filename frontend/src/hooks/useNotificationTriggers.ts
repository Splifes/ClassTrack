import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { notificationService } from '../services/notifications'

export function useNotificationTriggers() {
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || !user) return

    // Simulate notification triggers for demo purposes
    const simulateNotifications = () => {
      // Simulate assignment created notification after 5 seconds
      setTimeout(() => {
        notificationService.notifyAssignmentCreated('course-1', 'assignment-1', user.id)
      }, 5000)

      // Simulate deadline reminder after 10 seconds
      setTimeout(() => {
        notificationService.notifyReminder('course-1', 'assignment-2', user.id, 'tomorrow')
      }, 10000)

      // Simulate grade posted after 15 seconds (only for students)
      if (user.role === 'student') {
        setTimeout(() => {
          notificationService.notifyGradePosted('course-1', 'assignment-3', user.id)
        }, 15000)
      }

      // Simulate system alert for coordinators after 20 seconds
      if (user.role === 'coordinator') {
        setTimeout(() => {
          notificationService.notifySystemAlert(
            user.id, 
            'Low attendance detected in Mathematics course. Please review attendance reports.',
            'high'
          )
        }, 20000)
      }

      // Simulate assignment updated for teachers after 25 seconds
      if (user.role === 'teacher') {
        setTimeout(() => {
          notificationService.notifyAssignmentUpdated('course-2', 'assignment-4', user.id)
        }, 25000)
      }
    }

    // Start simulation
    simulateNotifications()

    // In a real app, this would:
    // 1. Poll the backend for new assignments/updates
    // 2. Listen to WebSocket events
    // 3. Check for upcoming deadlines
    // 4. Monitor system health for alerts

  }, [isAuthenticated, user])

  // Manual trigger functions for testing
  const triggerTestNotification = () => {
    if (!user) return
    
    notificationService.notifyAssignmentCreated('test-course', 'test-assignment', user.id)
  }

  const triggerDeadlineReminder = () => {
    if (!user) return
    
    notificationService.notifyReminder('test-course', 'test-assignment', user.id, 'in 2 hours')
  }

  const triggerSystemAlert = () => {
    if (!user) return
    
    notificationService.notifySystemAlert(
      user.id, 
      'This is a test system alert to demonstrate the notification system.',
      'medium'
    )
  }

  return {
    triggerTestNotification,
    triggerDeadlineReminder,
    triggerSystemAlert
  }
}
