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
        <p className="text-secondary">
          Configuración de WhatsApp Business para lead generation y comunicaciones
        </p>

        {/* Usar el componente ya refactorizado */}
        <WhatsAppManagement />
      </div>
    </PageLayout>
  )
}

export default WhatsAppPage