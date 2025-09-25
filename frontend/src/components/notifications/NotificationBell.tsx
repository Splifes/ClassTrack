import { useState } from 'react'
import { useNotifications } from '../../hooks/useNotifications'

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment_created':
        return '📝'
      case 'assignment_updated':
        return '✏️'
      case 'deadline_reminder':
        return '⏰'
      case 'grade_posted':
        return '📊'
      case 'system_alert':
        return '⚠️'
      default:
        return '🔔'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger'
      case 'medium':
        return 'text-warning'
      case 'low':
        return 'text-info'
      default:
        return 'text-muted'
    }
  }

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-light position-relative"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu dropdown-menu-end show" style={{ width: '350px', maxHeight: '400px', overflowY: 'auto' }}>
          <div className="dropdown-header d-flex justify-content-between align-items-center">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="dropdown-item-text text-center text-muted py-3">
              No notifications yet
            </div>
          ) : (
            notifications.slice(0, 10).map(notification => (
              <div
                key={notification.id}
                className={`dropdown-item ${!notification.read ? 'bg-light' : ''}`}
                style={{ whiteSpace: 'normal', cursor: 'pointer' }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="d-flex align-items-start">
                  <span className="me-2" style={{ fontSize: '1.2em' }}>
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1 fw-bold">{notification.title}</h6>
                      <small className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </small>
                    </div>
                    <p className="mb-1 small">{notification.message}</p>
                    <small className="text-muted">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                    {!notification.read && (
                      <span className="badge bg-primary ms-2">New</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {notifications.length > 10 && (
            <div className="dropdown-divider"></div>
          )}
          {notifications.length > 10 && (
            <div className="dropdown-item-text text-center">
              <small className="text-muted">
                Showing 10 of {notifications.length} notifications
              </small>
            </div>
          )}
        </div>
      )}
      
      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ zIndex: -1 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
