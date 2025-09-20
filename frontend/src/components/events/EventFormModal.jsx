import { EVENT_TYPES, EVENT_AREAS, EVENT_DURATIONS } from '../../constants/eventManagementConstants'

const EventFormModal = ({
  isCreating,
  selectedEvent,
  formData,
  validationErrors,
  handleInputChange,
  handleSubmit,
  handleCloseForm
}) => {
  if (!isCreating) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            {selectedEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h3>
          <button
            onClick={handleCloseForm}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Título del Evento *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.title
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                placeholder="Ej: Webinar de Metalurgia Avanzada"
                required
              />
              {validationErrors.title && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Tipo de Evento *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                required
              >
                {EVENT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                placeholder="Describe el evento, sus objetivos y beneficios..."
                rows={3}
                required
              />
              {validationErrors.description && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.description}</p>
              )}
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.date
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                required
              />
              {validationErrors.date && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Hora *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.time
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                required
              />
              {validationErrors.time && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.time}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Duración
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
              >
                {EVENT_DURATIONS.map(duration => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Configuración del evento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Área
              </label>
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
              >
                {EVENT_AREAS.map(area => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Capacidad *
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.capacity
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                min="1"
                placeholder="100"
                required
              />
              {validationErrors.capacity && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.capacity}</p>
              )}
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Precio (S/)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className={`w-full bg-background border rounded-lg px-3 py-2 text-white focus:outline-none ${
                  validationErrors.price
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-accent'
                }`}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              {validationErrors.price && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.price}</p>
              )}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                URL de Inscripción
              </label>
              <input
                type="url"
                value={formData.registrationUrl}
                onChange={(e) => handleInputChange('registrationUrl', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                placeholder="https://ejemplo.com/inscripcion"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                URL de Imagen
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                PDF Descargable
              </label>
              <input
                type="url"
                value={formData.pdfUrl}
                onChange={(e) => handleInputChange('pdfUrl', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                placeholder="https://ejemplo.com/material.pdf"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Video de YouTube
              </label>
              <input
                type="url"
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-accent text-background py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              {selectedEvent ? 'Actualizar' : 'Crear'} Evento
            </button>
            <button
              type="button"
              onClick={handleCloseForm}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventFormModal