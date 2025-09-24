import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import LoyaltyManagement from '../../LoyaltyManagement'

const LoyaltyManagementPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Programa de Fidelización">
      <div className="space-y-6">
        <p className="text-text-secondary">
          Gestión del programa de fidelización y recompensas para estudiantes
        </p>

        {/* Usar el componente existente */}
        <LoyaltyManagement />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">🎯 Estadísticas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Puntos canjeados:</span>
                <span className="text-green-400">8,524</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Miembros activos:</span>
                <span className="text-blue-400">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Recompensas disponibles:</span>
                <span className="text-yellow-400">15</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">⚡ Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                🎁 Crear Recompensa
              </button>
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                📊 Ver Reportes
              </button>
              <button className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors">
                ⚙️ Configurar Puntos
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default LoyaltyManagementPage