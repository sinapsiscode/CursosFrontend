import { NOTIFICATION_CONFIG, DATE_FORMAT_OPTIONS } from '../constants/notificationConstants'

export const formatUnreadCount = (count) => {
  return count > NOTIFICATION_CONFIG.maxUnreadDisplay
    ? `${NOTIFICATION_CONFIG.maxUnreadDisplay}+`
    : count
}

export const formatNotificationDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('es-ES', DATE_FORMAT_OPTIONS)
}

export const isNotificationUnread = (notification) => {
  return !notification.read
}