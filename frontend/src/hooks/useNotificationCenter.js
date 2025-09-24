import { useState, useEffect, useCallback } from 'react'
import { notificationService } from '../services/notificationService'
import { NOTIFICATION_CONFIG } from '../constants/notificationConstants.jsx'

export const useNotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = useCallback(() => {
    setNotifications(notificationService.getActiveNotifications())
    setUnreadCount(notificationService.getUnreadCount())
  }, [])

  useEffect(() => {
    loadNotifications()

    const interval = setInterval(loadNotifications, NOTIFICATION_CONFIG.updateInterval)

    const cleanupInterval = setInterval(() => {
      notificationService.cleanOldNotifications()
      loadNotifications()
    }, NOTIFICATION_CONFIG.cleanupInterval)

    return () => {
      clearInterval(interval)
      clearInterval(cleanupInterval)
    }
  }, [loadNotifications])

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleNotificationAction = useCallback((notification, actionIndex) => {
    notificationService.handleAction(notification.id, actionIndex)
    loadNotifications()
  }, [loadNotifications])

  const handleDismiss = useCallback((notificationId) => {
    notificationService.dismissNotification(notificationId)
    loadNotifications()
  }, [loadNotifications])

  const handleMarkAllAsRead = useCallback(() => {
    notifications.forEach(notif => {
      notificationService.markAsRead(notif.id)
    })
    loadNotifications()
  }, [notifications, loadNotifications])

  return {
    isOpen,
    notifications,
    unreadCount,
    toggleOpen,
    close,
    handleNotificationAction,
    handleDismiss,
    handleMarkAllAsRead
  }
}