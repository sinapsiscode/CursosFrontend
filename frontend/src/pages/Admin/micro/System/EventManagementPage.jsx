import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const EventManagementPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Reemplazar con llamada a API
    const timer = setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: 'Innovaciones en Metalurgia 4.0',
          description: 'Descubre las últimas tecnologías en la industria metalúrgica',
          type: 'webinar',
          area: 'metalurgia',
          date: '7/10/2025',
          registrations: 45,
          maxRegistrations: 100,
          status: 'active'
        },
        {
          id: 2,
          title: 'Técnicas Avanzadas de Exploración Minera',
          description: 'Masterclass exclusiva con expertos internacionales',
          type: 'masterclass',
          area: 'mineria',
          date: '14/10/2025',
          registrations: 38,
          maxRegistrations: 50,
          status: 'active'
        },
        {
          id: 3,
          title: 'Black Friday Geología',
          description: 'Todos los cursos de geología con 40% de descuento',
          type: 'promotion',
          area: 'geologia',
          date: 'N/A',
          registrations: null,
          maxRegistrations: null,
          status: 'scheduled'
        },
        {
          id: 4,
          title: 'Pack Completo Metalurgia',
          description: '3 cursos esenciales de metalurgia por el precio de 2',
          type: 'bundle',
          area: 'metalurgia',
          date: 'N/A',
          registrations: null,
          maxRegistrations: null,
          status: 'active'
        }
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Calcular estadísticas
  const stats = {
    total: events.length,
    webinars: events.filter(e => e.type === 'webinar').length,
    promotions: events.filter(e => e.type === 'promotion').length,
    totalRegistrations: events.reduce((sum, e) => sum + (e.registrations || 0), 0)
  }

  const getTypeBadge = (type) => {
    const badges = {
      webinar: { label: 'webinar', color: 'bg-blue-600' },
      masterclass: { label: 'masterclass', color: 'bg-purple-600' },
      promotion: { label: 'promotion', color: 'bg-green-600' },
      bundle: { label: 'bundle', color: 'bg-orange-600' }
    }
    return badges[type] || { label: type, color: 'bg-gray-600' }
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Gestión de Eventos"
      action={{
        label: "+ Crear Evento",
        href: "/admin/events/create"
      }}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-1">Total Eventos</p>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-surface rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-1">Webinars</p>
            <p className="text-4xl font-bold text-blue-400">{stats.webinars}</p>
          </div>

          <div className="bg-surface rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-1">Promociones</p>
            <p className="text-4xl font-bold text-green-400">{stats.promotions}</p>
          </div>

          <div className="bg-surface rounded-lg p-6">
            <p className="text-text-secondary text-sm mb-1">Registros Totales</p>
            <p className="text-4xl font-bold text-purple-400">{stats.totalRegistrations}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Gestión de Eventos</h2>
          <button
            onClick={() => console.log('Configurar tipos')}
            className="px-4 py-2 bg-surface border border-gray-600 text-white rounded-lg hover:bg-background transition-colors flex items-center gap-2"
          >
            ⚙️ Configurar Tipos
          </button>
        </div>

        {/* Events Table */}
        <div className="bg-surface rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="text-left p-4 text-white font-medium">Evento</th>
                <th className="text-left p-4 text-white font-medium">Tipo</th>
                <th className="text-left p-4 text-white font-medium">Área</th>
                <th className="text-left p-4 text-white font-medium">Fecha</th>
                <th className="text-left p-4 text-white font-medium">Registros</th>
                <th className="text-left p-4 text-white font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => {
                const badge = getTypeBadge(event.type)
                const progressPercentage = event.maxRegistrations
                  ? (event.registrations / event.maxRegistrations) * 100
                  : 0

                return (
                  <tr
                    key={event.id}
                    className={`${index !== events.length - 1 ? 'border-b border-gray-700' : ''}`}
                  >
                    {/* Evento */}
                    <td className="p-4">
                      <h3 className="text-white font-medium mb-1">{event.title}</h3>
                      <p className="text-text-secondary text-sm">{event.description}</p>
                    </td>

                    {/* Tipo */}
                    <td className="p-4">
                      <span className={`${badge.color} text-white px-3 py-1 rounded text-sm font-medium`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Área */}
                    <td className="p-4">
                      <span className="text-white">{event.area}</span>
                    </td>

                    {/* Fecha */}
                    <td className="p-4">
                      <span className="text-text-secondary">{event.date}</span>
                    </td>

                    {/* Registros */}
                    <td className="p-4">
                      {event.registrations !== null ? (
                        <div>
                          <div className="text-white font-medium mb-1">
                            {event.registrations}/{event.maxRegistrations}
                          </div>
                          <div className="w-24 bg-background rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-text-secondary">N/A</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => console.log('Ver detalles:', event.id)}
                          className="px-3 py-1 bg-accent hover:bg-accent/90 text-black font-medium rounded text-sm transition-colors"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => console.log('Notificar:', event.id)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition-colors"
                        >
                          Notificar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  )
}

export default EventManagementPage
