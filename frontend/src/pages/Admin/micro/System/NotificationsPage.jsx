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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📱 Push Notifications</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Enviadas hoy:</span>
                <span className="text-white">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tasa de apertura:</span>
                <span className="text-accent">67%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Clicks:</span>
                <span className="text-white">89</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📧 Email</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Emails enviados:</span>
                <span className="text-white">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Entregados:</span>
                <span className="text-green-400">229</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Rebotes:</span>
                <span className="text-red-400">5</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">⚙️ Sistema</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Cola de envío:</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Plantillas activas:</span>
                <span className="text-white">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Estado API:</span>
                <span className="text-green-400">✅ OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default NotificationsPage