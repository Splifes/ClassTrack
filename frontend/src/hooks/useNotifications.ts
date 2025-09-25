import { useState, useEffect } from 'react'
import { notificationService, Notification } from '../services/notifications'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load initial notifications
    const loadNotifications = () => {
      const stored = notificationService.getStoredNotifications()
      setNotifications(stored)
      setUnreadCount(notificationService.getUnreadCount())
    }

    loadNotifications()

    // Listen for new notifications
    const handleNewNotification = (event: CustomEvent) => {
      loadNotifications()
    }

    window.addEventListener('notification', handleNewNotification as EventListener)

    return () => {
      window.removeEventListener('notification', handleNewNotification as EventListener)
    }
  }, [])

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId)
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        notificationService.markAsRead(n.id)
      }
    })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  }
}
