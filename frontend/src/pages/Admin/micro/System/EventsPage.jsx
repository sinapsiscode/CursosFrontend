import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de eventos
    const timer = setTimeout(() => {
      setEvents([
        { id: 1, title: 'Promoción de Verano', type: 'promotion', status: 'active', startDate: '2024-06-01', endDate: '2024-08-31', participants: 145 },
        { id: 2, title: 'Webinar de Metalurgia', type: 'webinar', status: 'scheduled', startDate: '2024-07-15', endDate: '2024-07-15', participants: 0 },
        { id: 3, title: 'Descuento Black Friday', type: 'promotion', status: 'draft', startDate: '2024-11-29', endDate: '2024-12-02', participants: 0 }
      ])
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'scheduled': return 'bg-blue-500/20 text-blue-400'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400'
      case 'ended': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'scheduled': return 'Programado'
      case 'draft': return 'Borrador'
      case 'ended': return 'Finalizado'
      default: return 'Desconocido'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'promotion': return '🎯'
      case 'webinar': return '🎥'
      case 'workshop': return '🛠️'
      case 'conference': return '🎤'
      default: return '📅'
    }
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout
      title="Gestión de Eventos"
      action={{
        label: "Nuevo Evento",
        href: "/admin/events/create"
      }}
    >
      <div className="space-y-6">
        <p className="text-text-secondary">
          Administración de eventos, promociones y webinars
        </p>

        <div className="grid grid-cols-1 gap-4">
          {events.map(event => (
            <div key={event.id} className="bg-card p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{getTypeIcon(event.type)}</span>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">{event.title}</h3>
                    <p className="text-text-secondary text-sm mb-2">
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                      <span className="text-text-secondary text-sm">
                        👥 {event.participants} participantes
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => console.log('Ver estadísticas:', event.id)}
                    className="px-3 py-1 bg-accent/20 text-accent rounded text-sm hover:bg-accent/30 transition-colors"
                  >
                    Ver Stats
                  </button>
                  <button
                    onClick={() => console.log('Editar evento:', event.id)}
                    className="px-3 py-1 bg-card border border-gray-600 text-white rounded text-sm hover:bg-background transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">📊 Estadísticas Generales</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Eventos activos:</span>
                <span className="text-green-400">{events.filter(e => e.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Programados:</span>
                <span className="text-blue-400">{events.filter(e => e.status === 'scheduled').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Total participantes:</span>
                <span className="text-white">{events.reduce((sum, e) => sum + e.participants, 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg">
            <h3 className="font-medium text-white mb-2">🎯 Acciones Rápidas</h3>
            <div className="space-y-2">
              <button
                onClick={() => console.log('Crear promoción')}
                className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors"
              >
                🎯 Crear Promoción
              </button>
              <button
                onClick={() => console.log('Programar webinar')}
                className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors"
              >
                🎥 Programar Webinar
              </button>
              <button
                onClick={() => console.log('Ver calendario')}
                className="w-full text-left px-3 py-2 text-accent hover:bg-accent/10 rounded transition-colors"
              >
                📅 Ver Calendario
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default EventsPage