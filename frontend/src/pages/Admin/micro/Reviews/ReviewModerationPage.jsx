import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import ReviewModeration from '../../ReviewModeration'

const ReviewModerationPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Moderación de Reseñas">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Gestión y control de reseñas publicadas por estudiantes
        </p>

        {/* Usar el componente existente */}
        <ReviewModeration />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📊 Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Reseñas pendientes:</span>
                <span className="text-yellow-400">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Aprobadas hoy:</span>
                <span className="text-green-400">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Rechazadas:</span>
                <span className="text-red-400">3</span>
              </div>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">⚡ Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                📝 Revisar Pendientes
              </button>
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                📊 Ver Reportes
              </button>
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                ⚙️ Configurar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default ReviewModerationPage