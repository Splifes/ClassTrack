export interface NotificationConfig {
  email: boolean
  whatsapp: boolean
  telegram: boolean
  push: boolean
}

export interface Notification {
  id: string
  type: 'assignment_created' | 'assignment_updated' | 'deadline_reminder' | 'grade_posted' | 'system_alert'
  title: string
  message: string
  courseId?: string
  courseworkId?: string
  userId: string
  createdAt: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface NotificationProvider {
  name: string
  send(notification: Notification, config: NotificationConfig): Promise<boolean>
}

// Email Provider (stub)
class EmailProvider implements NotificationProvider {
  name = 'email'
  
  async send(notification: Notification, config: NotificationConfig): Promise<boolean> {
    if (!config.email) return false
    
    console.log(`📧 Email notification sent:`, {
      to: notification.userId,
      subject: notification.title,
      body: notification.message,
      type: notification.type
    })
    
    // In real implementation, would use SendGrid, AWS SES, etc.
    return true
  }
}

// WhatsApp Provider (stub)
class WhatsAppProvider implements NotificationProvider {
  name = 'whatsapp'
  
  async send(notification: Notification, config: NotificationConfig): Promise<boolean> {
    if (!config.whatsapp) return false
    
    console.log(`📱 WhatsApp notification sent:`, {
      to: notification.userId,
      message: `${notification.title}\n\n${notification.message}`,
      type: notification.type
    })
    
    // In real implementation, would use Twilio WhatsApp API
    return true
  }
}

// Telegram Provider (stub)
class TelegramProvider implements NotificationProvider {
  name = 'telegram'
  
  async send(notification: Notification, config: NotificationConfig): Promise<boolean> {
    if (!config.telegram) return false
    
    console.log(`📨 Telegram notification sent:`, {
      to: notification.userId,
      message: `*${notification.title}*\n\n${notification.message}`,
      type: notification.type
    })
    
    // In real implementation, would use Telegram Bot API
    return true
  }
}

// Push Notification Provider (stub)
class PushProvider implements NotificationProvider {
  name = 'push'
  
  async send(notification: Notification, config: NotificationConfig): Promise<boolean> {
    if (!config.push) return false
    
    console.log(`🔔 Push notification sent:`, {
      to: notification.userId,
      title: notification.title,
      body: notification.message,
      type: notification.type
    })
    
    // In real implementation, would use Firebase Cloud Messaging, OneSignal, etc.
    return true
  }
}

export class NotificationService {
  private providers: NotificationProvider[] = [
    new EmailProvider(),
    new WhatsAppProvider(),
    new TelegramProvider(),
    new PushProvider()
  ]
  
  private defaultConfig: NotificationConfig = {
    email: true,
    whatsapp: false,
    telegram: false,
    push: true
  }

  async notifyAssignmentCreated(courseId: string, courseworkId: string, userId: string): Promise<void> {
    const notification: Notification = {
      id: `assignment_created_${Date.now()}`,
      type: 'assignment_created',
      title: 'New Assignment Available',
      message: `A new assignment has been posted in your course. Check it out now!`,
      courseId,
      courseworkId,
      userId,
      createdAt: new Date().toISOString(),
      read: false,
      priority: 'medium'
    }
    
    await this.sendNotification(notification)
  }

  async notifyAssignmentUpdated(courseId: string, courseworkId: string, userId: string): Promise<void> {
    const notification: Notification = {
      id: `assignment_updated_${Date.now()}`,
      type: 'assignment_updated',
      title: 'Assignment Updated',
      message: `An assignment in your course has been updated. Please review the changes.`,
      courseId,
      courseworkId,
      userId,
      createdAt: new Date().toISOString(),
      read: false,
      priority: 'medium'
    }
    
    await this.sendNotification(notification)
  }

  async notifyReminder(courseId: string, courseworkId: string, userId: string, when: string): Promise<void> {
    const notification: Notification = {
      id: `reminder_${Date.now()}`,
      type: 'deadline_reminder',
      title: 'Assignment Deadline Reminder',
      message: `Don't forget! Your assignment is due ${when}. Submit it before the deadline.`,
      courseId,
      courseworkId,
      userId,
      createdAt: new Date().toISOString(),
      read: false,
      priority: 'high'
    }
    
    await this.sendNotification(notification)
  }

  async notifyGradePosted(courseId: string, courseworkId: string, userId: string): Promise<void> {
    const notification: Notification = {
      id: `grade_posted_${Date.now()}`,
      type: 'grade_posted',
      title: 'Grade Posted',
      message: `Your assignment has been graded. Check your results now!`,
      courseId,
      courseworkId,
      userId,
      createdAt: new Date().toISOString(),
      read: false,
      priority: 'medium'
    }
    
    await this.sendNotification(notification)
  }

  async notifySystemAlert(userId: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    const notification: Notification = {
      id: `system_alert_${Date.now()}`,
      type: 'system_alert',
      title: 'System Alert',
      message,
      userId,
      createdAt: new Date().toISOString(),
      read: false,
      priority
    }
    
    await this.sendNotification(notification)
  }

  private async sendNotification(notification: Notification, config?: NotificationConfig): Promise<void> {
    const notificationConfig = config || this.defaultConfig
    
    // Send via all enabled providers
    const promises = this.providers.map(provider => 
      provider.send(notification, notificationConfig).catch(error => {
        console.error(`Failed to send notification via ${provider.name}:`, error)
        return false
      })
    )
    
    await Promise.all(promises)
    
    // Store notification in local storage for UI display
    this.storeNotification(notification)
  }

  private storeNotification(notification: Notification): void {
    const stored = this.getStoredNotifications()
    stored.unshift(notification)
    
    // Keep only last 50 notifications
    const trimmed = stored.slice(0, 50)
    localStorage.setItem('classtrack_notifications', JSON.stringify(trimmed))
    
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('notification', { detail: notification }))
  }

  getStoredNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem('classtrack_notifications')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  markAsRead(notificationId: string): void {
    const stored = this.getStoredNotifications()
    const updated = stored.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    localStorage.setItem('classtrack_notifications', JSON.stringify(updated))
  }

  getUnreadCount(): number {
    return this.getStoredNotifications().filter(n => !n.read).length
  }
}

export const notificationService = new NotificationService()
