import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'
import { useEventManagement } from '../../../../hooks/useEventManagement'
import { getEventStats, filterEvents, formatEventDate } from '../../../../utils/eventManagementUtils'
import { EVENT_TYPES, EVENT_AREAS, getEventTypeColor } from '../../../../constants/eventManagementConstants'
import EventFormModal from '../../../../components/Events/EventFormModal'
import EventRegistrations from '../../../../components/Events/EventRegistrations'

const EventManagementPage = () => {
  const {
    events,
    stats,
    loading,
    eventRegistrations,
    isCreating,
    selectedEvent,
    searchTerm,
    filters,
    formData,
    validationErrors,
    setIsCreating,
    setSearchTerm,
    setFilters,
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handlePublishToggle,
    handleCloseForm
  } = useEventManagement()

  const [showRegistrations, setShowRegistrations] = useState(false)
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState(null)

  const filteredEvents = filterEvents(events, searchTerm, filters)
  const eventStats = getEventStats(events, eventRegistrations)

  const handleViewRegistrations = (event) => {
    setSelectedEventForRegistrations(event)
    setShowRegistrations(true)
  }

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Gestión de Eventos">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md bg-card border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
            />
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="bg-card border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
            >
              <option value="all">Todos los tipos</option>
              {EVENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            + Crear Evento
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Total Eventos</p>
            <p className="text-2xl font-bold text-white">{eventStats.total}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Publicados</p>
            <p className="text-2xl font-bold text-green-400">{eventStats.published}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Borradores</p>
            <p className="text-2xl font-bold text-yellow-400">{eventStats.drafts}</p>
          </div>
          <div className="bg-card p-4 rounded-lg">
            <p className="text-text-secondary text-sm">Inscripciones</p>
            <p className="text-2xl font-bold text-blue-400">{eventStats.totalRegistrations}</p>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="text-left p-4 text-text-secondary font-medium">Evento</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Tipo</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Fecha</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Inscripciones</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Estado</th>
                  <th className="text-left p-4 text-text-secondary font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(event => {
                  const registrations = eventRegistrations[event.id] || []
                  const typeColor = getEventTypeColor(event.type)

                  return (
                    <tr key={event.id} className="border-t border-gray-700">
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{event.title}</p>
                          <p className="text-text-secondary text-sm truncate max-w-xs">
                            {event.description}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${typeColor}-900/20 text-${typeColor}-400`}>
                          {EVENT_TYPES.find(t => t.value === event.type)?.label || event.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-white">{formatEventDate(event.date, event.time)}</p>
                          <p className="text-text-secondary">Duración: {event.duration}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-center">
                          <p className="text-white font-medium">{registrations.length}</p>
                          <p className="text-text-secondary text-sm">/ {event.capacity}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'published' ? 'bg-green-900/20 text-green-400' :
                          event.status === 'draft' ? 'bg-yellow-900/20 text-yellow-400' :
                          'bg-gray-900/20 text-gray-400'
                        }`}>
                          {event.status === 'published' ? 'Publicado' :
                           event.status === 'draft' ? 'Borrador' : event.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-accent hover:text-accent/80 text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleViewRegistrations(event)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Ver Inscritos
                          </button>
                          <button
                            onClick={() => handlePublishToggle(event)}
                            className="text-yellow-400 hover:text-yellow-300 text-sm"
                          >
                            {event.status === 'published' ? 'Despublicar' : 'Publicar'}
                          </button>
                          <button
                            onClick={() => handleDuplicate(event)}
                            className="text-green-400 hover:text-green-300 text-sm"
                          >
                            Duplicar
                          </button>
                          <button
                            onClick={() => handleDelete(event)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Eliminar
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

        {filteredEvents.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            {events.length === 0 ? 'No hay eventos creados' : 'No se encontraron eventos con ese criterio'}
          </div>
        )}

        {/* Event Form Modal */}
        <EventFormModal
          isCreating={isCreating}
          selectedEvent={selectedEvent}
          formData={formData}
          validationErrors={validationErrors}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleCloseForm={handleCloseForm}
        />

        {/* Event Registrations Modal */}
        <EventRegistrations
          show={showRegistrations}
          event={selectedEventForRegistrations}
          registrations={eventRegistrations[selectedEventForRegistrations?.id] || []}
          onClose={() => setShowRegistrations(false)}
        />
      </div>
    </PageLayout>
  )
}

export default EventManagementPage