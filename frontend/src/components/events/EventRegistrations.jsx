import { exportRegistrationsToExcel } from '../../utils/eventManagementUtils'

const EventRegistrations = ({ show, event, registrations, onClose }) => {
  if (!show || !event) return null

  const handleExportRegistrations = () => {
    exportRegistrationsToExcel(event.id, { [event.id]: registrations }, event.title)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              Inscripciones - {event.title}
            </h3>
            <p className="text-secondary">
              {registrations.length} inscritos de {event.capacity} disponibles
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportRegistrations}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📊 Exportar Excel
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {registrations.length > 0 ? (
          <div className="bg-card rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="text-left p-4 text-secondary font-medium">#</th>
                    <th className="text-left p-4 text-secondary font-medium">Participante</th>
                    <th className="text-left p-4 text-secondary font-medium">Contacto</th>
                    <th className="text-left p-4 text-secondary font-medium">Área de Interés</th>
                    <th className="text-left p-4 text-secondary font-medium">Fecha de Inscripción</th>
                    <th className="text-left p-4 text-secondary font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr key={registration.id} className="border-t border-gray-700">
                      <td className="p-4 text-secondary">
                        {index + 1}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{registration.name}</p>
                          <p className="text-secondary text-sm">{registration.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {registration.phone && (
                            <p className="text-white">📱 {registration.phone}</p>
                          )}
                          {registration.email && (
                            <p className="text-secondary">✉️ {registration.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          registration.area === 'metalurgia' ? 'bg-blue-900/20 text-blue-400' :
                          registration.area === 'mineria' ? 'bg-green-900/20 text-green-400' :
                          registration.area === 'geologia' ? 'bg-orange-900/20 text-orange-400' :
                          'bg-gray-900/20 text-gray-400'
                        }`}>
                          {registration.area ?
                            registration.area.charAt(0).toUpperCase() + registration.area.slice(1) :
                            'No especificada'
                          }
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">
                            {new Date(registration.registeredAt).toLocaleDateString('es-PE')}
                          </p>
                          <p className="text-secondary">
                            {new Date(registration.registeredAt).toLocaleTimeString('es-PE', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          registration.status === 'confirmed' ? 'bg-green-900/20 text-green-400' :
                          registration.status === 'pending' ? 'bg-yellow-900/20 text-yellow-400' :
                          registration.status === 'cancelled' ? 'bg-red-900/20 text-red-400' :
                          'bg-blue-900/20 text-blue-400'
                        }`}>
                          {registration.status === 'confirmed' ? 'Confirmado' :
                           registration.status === 'pending' ? 'Pendiente' :
                           registration.status === 'cancelled' ? 'Cancelado' :
                           'Confirmado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <h4 className="text-lg font-medium text-white mb-2">
              Sin inscripciones aún
            </h4>
            <p className="text-secondary">
              Este evento aún no tiene participantes inscritos.
            </p>
          </div>
        )}

        {/* Estadísticas rápidas */}
        {registrations.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-secondary text-sm">Total Inscritos</p>
              <p className="text-2xl font-bold text-white">{registrations.length}</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-secondary text-sm">Confirmados</p>
              <p className="text-2xl font-bold text-green-400">
                {registrations.filter(r => r.status === 'confirmed' || !r.status).length}
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-secondary text-sm">Disponibles</p>
              <p className="text-2xl font-bold text-blue-400">
                {event.capacity - registrations.length}
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-secondary text-sm">% Ocupación</p>
              <p className="text-2xl font-bold text-accent">
                {Math.round((registrations.length / event.capacity) * 100)}%
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventRegistrations