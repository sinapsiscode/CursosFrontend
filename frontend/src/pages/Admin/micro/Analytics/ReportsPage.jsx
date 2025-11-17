import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const ReportsPage = () => {
  const [activeReport, setActiveReport] = useState('access-times')
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)

  // TODO: Reemplazar con llamada real a API cuando esté disponible
  // Ejemplo: const data = await apiService.getReportData(activeReport)
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true)

      // Simular carga de datos
      // TODO: Reemplazar con: await apiService.getReportData(activeReport)
      await new Promise(resolve => setTimeout(resolve, 500))

      // Estructura de datos esperada del backend
      // Estos datos deberán venir del backend/JSON Server
      const mockData = {
        'access-times': {
          chartData: generatePlaceholderChartData(),
          metrics: {
            peakHour: { label: '19:00 - 20:00', value: 450, unit: 'estudiantes' },
            avgPerHour: { label: 'Promedio por Hora', value: 247, unit: 'estudiantes activos' },
            preferredTime: { label: 'Horario Preferido', value: '17:00 - 21:00', percentage: 62 }
          }
        },
        'popular-courses': {
          // TODO: Estos datos deben venir del backend
          courses: [
            { rank: 1, name: 'Metalurgia Básica', views: 3450, enrollments: 892, completion: 78 },
            { rank: 2, name: 'Minería Subterránea', views: 2890, enrollments: 756, completion: 82 },
            { rank: 3, name: 'Geología Estructural', views: 2340, enrollments: 623, completion: 75 },
            { rank: 4, name: 'Procesamiento de Minerales', views: 2120, enrollments: 548, completion: 80 },
            { rank: 5, name: 'Seguridad Minera', views: 1980, enrollments: 512, completion: 88 },
            { rank: 6, name: 'Hidrogeología', views: 1750, enrollments: 423, completion: 71 },
            { rank: 7, name: 'Metalurgia Extractiva', views: 1620, enrollments: 398, completion: 74 },
            { rank: 8, name: 'Geofísica Aplicada', views: 1480, enrollments: 367, completion: 69 },
            { rank: 9, name: 'Control de Calidad', views: 1350, enrollments: 334, completion: 85 },
            { rank: 10, name: 'Mineralogía', views: 1200, enrollments: 298, completion: 72 }
          ]
        },
        'time-spent': {
          // TODO: Estos datos deben venir del backend
          timeRanges: [
            { range: '0-15 min', students: 120, percentage: 8, color: 'bg-red-500' },
            { range: '15-30 min', students: 280, percentage: 18, color: 'bg-orange-500' },
            { range: '30-60 min', students: 450, percentage: 29, color: 'bg-yellow-500' },
            { range: '1-2 horas', students: 380, percentage: 25, color: 'bg-green-500' },
            { range: '2-4 horas', students: 220, percentage: 14, color: 'bg-blue-500' },
            { range: '4+ horas', students: 90, percentage: 6, color: 'bg-purple-500' }
          ],
          stats: {
            avgSession: '1h 32min',
            activeToday: 1540,
            longSessions: 20
          }
        }
      }

      setReportData(mockData[activeReport])
      setLoading(false)
    }

    loadReportData()
  }, [activeReport])

  // Generar datos de ejemplo para el gráfico
  // TODO: Eliminar cuando backend esté listo
  const generatePlaceholderChartData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    // Simular distribución realista de accesos por hora
    return hours.map(hour => ({
      hour: `${hour}:00`,
      value: Math.floor(Math.random() * 300) + 50,
      isHighlight: hour >= 17 && hour <= 21 // Horario preferido
    }))
  }

  const reportTypes = [
    { id: 'access-times', name: 'Horarios de Acceso'},
    { id: 'popular-courses', name: 'Cursos Populares'},
    { id: 'time-spent', name: 'Tiempo de Uso' }
  ]

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Reportes Detallados"
      action={{
        label: "Exportar Actual",
        href: "/admin/analytics/exports"
      }}
    >
      <div className="space-y-6">
        {/* Tabs de reportes */}
        <div className="flex gap-4">
          {reportTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveReport(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeReport === type.id
                  ? 'bg-accent text-background font-medium'
                  : 'bg-surface text-white hover:bg-surface/80'
              }`}
            >
              <span>{type.icon}</span>
              {type.name}
            </button>
          ))}
        </div>

        {/* Contenido del reporte activo */}
        <div className="overflow-hidden rounded-lg bg-surface">
          {/* Horarios de Acceso */}
          {activeReport === 'access-times' && reportData && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-medium text-white">
                  Horarios de Mayor Actividad
                </h3>
                <p className="text-secondary">
                  Distribución de estudiantes activos por hora del día
                </p>
              </div>

              {/* Gráfico de barras */}
              <div className="p-6 rounded-lg bg-background">
                <div className="flex items-end justify-between h-64 gap-1">
                  {reportData.chartData?.map((data, index) => {
                    const maxValue = Math.max(...(reportData.chartData?.map(d => d.value) || [1]))
                    const heightPercentage = (data.value / maxValue) * 100

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1 gap-2 group"
                      >
                        <div className="relative w-full">
                          <div
                            className={`w-full rounded-t transition-all ${
                              data.isHighlight
                                ? 'bg-accent'
                                : 'bg-accent/60 group-hover:bg-accent/80'
                            }`}
                            style={{ height: `${heightPercentage * 2}px` }}
                          >
                            <div className="absolute transition-opacity -translate-x-1/2 opacity-0 -top-8 left-1/2 group-hover:opacity-100">
                              <div className="px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap">
                                {data.value}
                              </div>
                            </div>
                          </div>
                        </div>
                        {index % 3 === 0 && (
                          <span className="text-xs text-secondary">
                            {data.hour}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Métricas destacadas */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Hora Pico */}
                <div className="p-4 rounded-lg bg-background">
                  <div className="mb-1 text-sm text-secondary">Hora Pico</div>
                  <div className="mb-1 text-2xl font-bold text-accent">
                    {reportData?.metrics?.peakHour?.label || 'N/A'}
                  </div>
                  <div className="text-sm text-secondary">
                    {reportData?.metrics?.peakHour?.value || 0} {reportData?.metrics?.peakHour?.unit || ''}
                  </div>
                </div>

                {/* Promedio por Hora */}
                <div className="p-4 rounded-lg bg-background">
                  <div className="mb-1 text-sm text-secondary">
                    {reportData.metrics.avgPerHour.label}
                  </div>
                  <div className="mb-1 text-2xl font-bold text-accent">
                    {reportData.metrics.avgPerHour.value}
                  </div>
                  <div className="text-sm text-secondary">
                    {reportData.metrics.avgPerHour.unit}
                  </div>
                </div>

                {/* Horario Preferido */}
                <div className="p-4 rounded-lg bg-background">
                  <div className="mb-1 text-sm text-secondary">Horario Preferido</div>
                  <div className="mb-1 text-2xl font-bold text-accent">
                    {reportData.metrics.preferredTime.value}
                  </div>
                  <div className="text-sm text-secondary">
                    {reportData.metrics.preferredTime.percentage}% del tráfico
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cursos Populares */}
          {activeReport === 'popular-courses' && reportData && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-medium text-white">
                  Top 10 Cursos Más Populares
                </h3>
                <p className="text-secondary">
                  Ranking basado en vistas, inscripciones y tasa de completado
                </p>
              </div>

              {/* Tabla de cursos */}
              <div className="overflow-hidden rounded-lg bg-background">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="p-4 text-sm font-medium text-left text-secondary">#</th>
                        <th className="p-4 text-sm font-medium text-left text-secondary">Curso</th>
                        <th className="p-4 text-sm font-medium text-left text-secondary">Vistas</th>
                        <th className="p-4 text-sm font-medium text-left text-secondary">Popularidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* TODO: reportData.courses debe venir del backend */}
                      {reportData.courses?.map((course) => {
                        // Calcular color del porcentaje de completado
                        const getCompletionColor = (percentage) => {
                          if (percentage >= 80) return 'text-green-500'
                          if (percentage >= 70) return 'text-yellow-500'
                          return 'text-red-500'
                        }

                        // Calcular ancho de barra de popularidad (basado en vistas)
                        const maxViews = Math.max(...reportData.courses.map(c => c.views))
                        const popularityWidth = (course.views / maxViews) * 100

                        return (
                          <tr key={course.rank} className="transition-colors border-b border-gray-700/50 hover:bg-surface/30">
                            <td className="p-4 font-medium text-white">{course.rank}</td>
                            <td className="p-4 font-medium text-white">{course.name}</td>
                            <td className="p-4 text-secondary">{course.views}</td>
                            <td className="p-4">
                              <div className="w-full h-2 overflow-hidden rounded-full bg-surface">
                                <div
                                  className="h-full transition-all duration-500 rounded-full bg-accent"
                                  style={{ width: `${popularityWidth}%` }}
                                />
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tiempo de Uso */}
          {activeReport === 'time-spent' && reportData && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-medium text-white">
                  Tiempo de Permanencia en la Plataforma
                </h3>
                <p className="text-secondary">
                  Distribución del tiempo que los estudiantes pasan en la plataforma por sesión
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Gráfico de barras horizontales */}
                <div className="p-6 rounded-lg lg:col-span-2 bg-background">
                  <div className="space-y-4">
                    {/* TODO: reportData.timeRanges debe venir del backend */}
                    {reportData.timeRanges?.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-white">{item.range}</span>
                          <span className="text-secondary">
                            {item.students} estudiantes ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-3 overflow-hidden rounded-full bg-surface">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.percentage * 3}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel de Estadísticas Clave */}
                <div className="p-6 rounded-lg bg-background">
                  <h4 className="mb-4 font-medium text-white">Estadísticas Clave</h4>

                  <div className="space-y-6">
                    {/* Tiempo Promedio por Sesión */}
                    <div>
                      <div className="mb-1 text-sm text-secondary">
                        Tiempo Promedio por Sesión
                      </div>
                      <div className="text-3xl font-bold text-accent">
                        {reportData.stats?.avgSession || '--'}
                      </div>
                    </div>

                    {/* Estudiantes Activos Hoy */}
                    <div>
                      <div className="mb-1 text-sm text-secondary">
                        Estudiantes Activos Hoy
                      </div>
                      <div className="text-3xl font-bold text-white">
                        {reportData.stats?.activeToday || '--'}
                      </div>
                    </div>

                    {/* Sesiones Largas */}
                    <div>
                      <div className="mb-1 text-sm text-secondary">
                        Sesiones Largas (+2h)
                      </div>
                      <div className="text-3xl font-bold text-accent">
                        {reportData.stats?.longSessions || '--'}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default ReportsPage
