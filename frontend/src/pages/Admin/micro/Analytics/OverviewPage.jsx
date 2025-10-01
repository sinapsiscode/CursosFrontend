import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import DashboardStats from '../../../../components/AdminDashboard/DashboardStats'

const OverviewPage = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Analytics Overview"
      action={{
        label: "Ver Reportes",
        href: "/admin/analytics/reports"
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary">
            Métricas principales de la plataforma
          </p>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-surface border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="year">Último año</option>
          </select>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">Acciones Rápidas</h3>
            <div className="space-y-2">
              <a href="/admin/analytics/reports" className="block text-accent hover:underline">
                📊 Ver Reportes Detallados
              </a>
              <a href="/admin/analytics/exports" className="block text-accent hover:underline">
                📋 Exportar Datos
              </a>
            </div>
          </div>

          <div className="bg-surface p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">Resumen</h3>
            <p className="text-text-secondary text-sm">
              Datos actualizados cada 15 minutos
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default OverviewPage