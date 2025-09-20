import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState('access-times')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLayout.Loading />
  }

  const reportTypes = [
    { id: 'access-times', name: 'Horarios de Acceso', icon: '🕐' },
    { id: 'popular-courses', name: 'Cursos Populares', icon: '📚' },
    { id: 'time-spent', name: 'Tiempo de Uso', icon: '⏱️' }
  ]

  return (
    <PageLayout
      title="Reportes Detallados"
      action={{
        label: "Exportar Actual",
        href: "/admin/analytics/exports"
      }}
    >
      <div className="space-y-6">
        <div className="flex gap-4">
          {reportTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveReport(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeReport === type.id
                  ? 'bg-accent text-background'
                  : 'bg-card text-white hover:bg-card/80'
              }`}
            >
              <span>{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>

        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">
            {reportTypes.find(t => t.id === activeReport)?.name}
          </h3>

          {activeReport === 'access-times' && (
            <div className="space-y-4">
              <p className="text-text-secondary">Horarios de mayor actividad en la plataforma</p>
              <div className="h-64 bg-background/50 rounded-lg flex items-center justify-center">
                <span className="text-text-secondary">📊 Gráfico de horarios de acceso</span>
              </div>
            </div>
          )}

          {activeReport === 'popular-courses' && (
            <div className="space-y-4">
              <p className="text-text-secondary">Cursos con mayor demanda</p>
              <div className="h-64 bg-background/50 rounded-lg flex items-center justify-center">
                <span className="text-text-secondary">📈 Ranking de cursos populares</span>
              </div>
            </div>
          )}

          {activeReport === 'time-spent' && (
            <div className="space-y-4">
              <p className="text-text-secondary">Tiempo promedio de uso por usuario</p>
              <div className="h-64 bg-background/50 rounded-lg flex items-center justify-center">
                <span className="text-text-secondary">⏰ Métricas de tiempo de uso</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default ReportsPage