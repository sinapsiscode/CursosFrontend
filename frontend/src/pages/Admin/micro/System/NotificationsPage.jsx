import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import NotificationManagement from '../../../../components/AdminDashboard/NotificationManagement'

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Centro de Notificaciones">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Gestión de notificaciones push, email y sistema de mensajería
        </p>

        {/* Usar el componente ya refactorizado */}
        <NotificationManagement />
      </div>
    </PageLayout>
  )
}

export default NotificationsPage