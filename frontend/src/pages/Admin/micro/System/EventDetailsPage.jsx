import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState([])

  useEffect(() => {
    // TODO: Reemplazar con llamada a API
    const timer = setTimeout(() => {
      // Datos de ejemplo del evento
      setEvent({
        id: 1,
        title: 'Innovaciones en Metalurgia 4.0',
        description: 'Descubre las últimas tecnologías en la industria metalúrgica',
        type: 'webinar',
        area: 'Metalurgia',
        date: 'martes, 7 de octubre de 2025',
        time: '19:00',
        registrations: 45,
        maxRegistrations: 100,
        tags: ['metalurgia', 'tecnología', 'industria 4.0', 'fundamentos', 'acero'],
        benefits: [
          'Certificado de participación',
          '20% descuento en curso relacionado',
          'Material descargable exclusivo'
        ]
      })

      // Datos de ejemplo de participantes
      setRegistrations([
        {
          id: 1,
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          email: 'carlos.rodriguez@email.com',
          phone: '987654321',
          registeredAt: '29/09/2025, 13:10'
        },
        {
          id: 2,
          firstName: 'María',
          lastName: 'González',
          email: 'maria.gonzalez@email.com',
          phone: '912345678',
          registeredAt: '30/09/2025, 13:10'
        },
        {
          id: 3,
          firstName: 'Ana',
          lastName: 'Martínez',
          email: 'ana.martinez@email.com',
          phone: '956781234',
          registeredAt: '01/10/2025, 10:10'
        }
      ])

      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [id])

  const handleDownloadExcel = () => {
    console.log('Descargar Excel de participantes')
    // TODO: Implementar descarga de Excel
  }

  const progressPercentage = event ? (event.registrations / event.maxRegistrations) * 100 : 0

  if (loading) {
    return <PageLayout.Loading />
  }

  if (!event) {
    return (
      <PageLayout title="Evento no encontrado">
        <div className="text-center py-12">
          <p className="text-white text-lg mb-4">No se encontró el evento</p>
          <button
            onClick={() => navigate('/admin/events')}
            className="px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
          >
            Volver a la lista
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Detalles del Evento">
      <div className="space-y-6">
        {/* Botón Volver */}
        <button
          onClick={() => navigate('/admin/events')}
          className="text-accent hover:text-accent/80 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a la lista
        </button>

        {/* Información del Evento */}
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
          <p className="text-text-secondary mb-6">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              <div>
                <p className="text-text-secondary text-sm mb-1">Tipo</p>
                <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
                  {event.type}
                </span>
              </div>

              <div>
                <p className="text-text-secondary text-sm mb-1">Fecha</p>
                <p className="text-white font-medium">{event.date}</p>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              <div>
                <p className="text-text-secondary text-sm mb-1">Área</p>
                <span className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium">
                  {event.area}
                </span>
              </div>

              <div>
                <p className="text-text-secondary text-sm mb-1">Hora</p>
                <p className="text-white font-medium">{event.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Registros */}
        <div className="bg-surface rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Registros</h3>
          <div className="mb-2">
            <div className="flex justify-between text-white font-medium mb-2">
              <span>{event.registrations} / {event.maxRegistrations}</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-3">
              <div
                className="bg-accent h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-surface rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Participantes Registrados */}
        <div className="bg-surface rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Participantes Registrados ({registrations.length})
            </h3>
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="text-left p-4 text-white font-medium">Nombre</th>
                  <th className="text-left p-4 text-white font-medium">Apellidos</th>
                  <th className="text-left p-4 text-white font-medium">Correo</th>
                  <th className="text-left p-4 text-white font-medium">Teléfono</th>
                  <th className="text-left p-4 text-white font-medium">Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration, index) => (
                  <tr
                    key={registration.id}
                    className={`${index !== registrations.length - 1 ? 'border-b border-gray-700' : ''}`}
                  >
                    <td className="p-4 text-white">{registration.firstName}</td>
                    <td className="p-4 text-white">{registration.lastName}</td>
                    <td className="p-4 text-blue-400">{registration.email}</td>
                    <td className="p-4 text-white">{registration.phone}</td>
                    <td className="p-4 text-text-secondary">{registration.registeredAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default EventDetailsPage
