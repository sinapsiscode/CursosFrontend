// ===================================
// NOTIFICATION TOAST COMPONENT
// ===================================

import React from 'react'
import { NOTIFICATION_STYLES } from '../../constants/studentEnrollmentManagementConstants'

const NotificationToast = ({ notification }) => {
  const notificationStyle = NOTIFICATION_STYLES[notification.type] || NOTIFICATION_STYLES.success

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${notificationStyle}`}>
      <p className="text-white font-medium">{notification.message}</p>
    </div>
  )
}

export default NotificationToast