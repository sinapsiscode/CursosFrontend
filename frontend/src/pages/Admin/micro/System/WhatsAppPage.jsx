import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import WhatsAppManagement from '../../../../components/AdminDashboard/WhatsAppManagement'

const WhatsAppPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Configuración WhatsApp">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Configuración de WhatsApp Business para lead generation y comunicaciones
        </p>

        {/* Usar el componente ya refactorizado */}
        <WhatsAppManagement />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">💡 Configuración Rápida</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Estado API:</span>
                <span className="text-green-400">✅ Conectado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Webhook:</span>
                <span className="text-green-400">✅ Configurado</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Templates:</span>
                <span className="text-white">3 activos</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📊 Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Mensajes enviados:</span>
                <span className="text-white">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Respuestas:</span>
                <span className="text-white">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Tasa de respuesta:</span>
                <span className="text-accent">38%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default WhatsAppPage