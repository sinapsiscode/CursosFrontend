import { useState, useEffect } from 'react'
import PageLayout from '../../../../components/Admin/Layout/PageLayout'

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateSection, setShowCreateSection] = useState(false)
  const [showTypesSection, setShowTypesSection] = useState(false)

  const [eventTypes, setEventTypes] = useState([
    { id: 1, name: 'Webinar', value: 'webinar', color: 'bg-blue-600' },
    { id: 2, name: 'Masterclass', value: 'masterclass', color: 'bg-purple-600' },
    { id: 3, name: 'Promoción', value: 'promotion', color: 'bg-green-600' },
    { id: 4, name: 'Bundle de Cursos', value: 'bundle', color: 'bg-orange-600' }
  ])

  const [formData, setFormData] = useState({
    type: 'webinar',
    area: 'metalurgia',
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    duration: '',
    capacity: '',
    extraComments: '',
    tags: '',
    benefits: '',
    pdfUrl: '',
    videoUrl: '',
    redirectUrl: ''
  })

  const [organizers, setOrganizers] = useState([])
  const [newOrganizer, setNewOrganizer] = useState('')

  const [newType, setNewType] = useState({
    name: '',
    value: '',
    color: 'bg-blue-600'
  })

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddOrganizer = () => {
    if (newOrganizer.trim()) {
      setOrganizers([...organizers, newOrganizer.trim()])
      setNewOrganizer('')
    }
  }

  const handleCreateEvent = (e) => {
    e.preventDefault()
    const newEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      area: formData.area,
      date: formData.startDate,
      registrations: 0,
      maxRegistrations: parseInt(formData.capacity),
      status: 'active'
    }
    setEvents([...events, newEvent])
    setShowCreateSection(false)
    setFormData({
      type: 'webinar',
      area: 'metalurgia',
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      duration: '',
      capacity: '',
      extraComments: '',
      tags: '',
      benefits: '',
      pdfUrl: '',
      videoUrl: '',
      redirectUrl: ''
    })
    setOrganizers([])
  }

  const handleAddType = (e) => {
    e.preventDefault()
    if (newType.name.trim() && newType.value.trim()) {
      const type = {
        id: Date.now(),
        name: newType.name.trim(),
        value: newType.value.trim(),
        color: newType.color
      }
      setEventTypes([...eventTypes, type])
      setNewType({ name: '', value: '', color: 'bg-blue-600' })
    }
  }

  const handleDeleteType = (id) => {
    if (confirm('¿Estás seguro de eliminar este tipo de evento?')) {
      setEventTypes(eventTypes.filter(t => t.id !== id))
    }
  }

  const colorOptions = [
    { label: 'Azul', value: 'bg-blue-600' },
    { label: 'Morado', value: 'bg-purple-600' },
    { label: 'Verde', value: 'bg-green-600' },
    { label: 'Naranja', value: 'bg-orange-600' },
    { label: 'Rojo', value: 'bg-red-600' },
    { label: 'Amarillo', value: 'bg-yellow-600' },
    { label: 'Rosa', value: 'bg-pink-600' },
    { label: 'Cyan', value: 'bg-cyan-600' }
  ]

  if (loading) {
    return <PageLayout.Loading />
  }

  return (
    <PageLayout title="Gestión de Eventos">
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
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowTypesSection(!showTypesSection)
                setShowCreateSection(false)
              }}
              className="px-4 py-2 bg-surface border border-gray-600 text-white rounded-lg hover:bg-background transition-colors flex items-center gap-2"
            >
              ⚙️ Configurar Tipos
            </button>
            <button
              onClick={() => {
                setShowCreateSection(!showCreateSection)
                setShowTypesSection(false)
              }}
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
            >
              + Crear Evento
            </button>
          </div>
        </div>

        {/* Sección: Crear Evento (colapsable) */}
        {showCreateSection && (
          <div className="bg-surface rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Nuevo Evento</h3>

            <form onSubmit={handleCreateEvent} className="space-y-6">
              {/* Tipo de Evento y Área */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Tipo de Evento</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  >
                    {eventTypes.map(type => (
                      <option key={type.id} value={type.value}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Área</label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  >
                    <option value="metalurgia">Metalurgia</option>
                    <option value="mineria">Minería</option>
                    <option value="geologia">Geología</option>
                    <option value="ingenieria-civil">Ingeniería Civil</option>
                  </select>
                </div>
              </div>

              {/* Título del Evento */}
              <div>
                <label className="block text-white text-sm mb-2">Título del Evento</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="🔥 Innovaciones en Metalurgia 4.0"
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-white text-sm mb-2">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción breve del evento..."
                  rows={4}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
                  required
                />
              </div>

              {/* Inicio, Hora, Duración */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Inicio</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Hora</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Duración</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="2 horas"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              {/* Organizaciones */}
              <div>
                <label className="block text-white text-sm mb-2">Organizaciones</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    placeholder="Nombre del organizador"
                    className="flex-1 p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={handleAddOrganizer}
                    className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                  >
                    Agregar
                  </button>
                </div>
                {organizers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {organizers.map((org, index) => (
                      <span key={index} className="px-3 py-1 bg-background text-white rounded-lg text-sm">
                        {org}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Capacidad y Comentario Extra */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-2">Capacidad</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm mb-2">Comentario Extra</label>
                  <textarea
                    name="extraComments"
                    value={formData.extraComments}
                    onChange={handleChange}
                    placeholder="Ingrese cualquier información adicional sobre el evento..."
                    rows={3}
                    className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Este texto aparecerá como comentario adicional en los detalles del evento.</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white text-sm mb-2">Tags (separados por coma)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="metalurgia, tecnología, industria 4.0"
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Beneficios */}
              <div>
                <label className="block text-white text-sm mb-2">Beneficios (uno por línea)</label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Certificado de participación&#10;Material descargable&#10;Descuento en curso"
                  rows={5}
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* URL del PDF descargable */}
              <div>
                <label className="block text-white text-sm mb-2">📄 URL del PDF descargable</label>
                <input
                  type="url"
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/material.pdf"
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              {/* URL del video de YouTube */}
              <div>
                <label className="block text-white text-sm mb-2">🎥 URL del video de YouTube</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=abc123"
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              {/* URL de redirección después de inscripción */}
              <div>
                <label className="block text-white text-sm mb-2">🔗 URL de redirección después de inscripción</label>
                <input
                  type="url"
                  name="redirectUrl"
                  value={formData.redirectUrl}
                  onChange={handleChange}
                  placeholder="https://zoom.us/j/123456789 o https://teams.microsoft.com/..."
                  className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateSection(false)}
                  className="px-6 py-3 bg-surface border border-gray-600 text-white rounded-lg hover:bg-background transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                >
                  Crear Evento
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sección de Configurar Tipos (colapsable) */}
        {showTypesSection && (
          <div className="bg-surface rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-6">Configurar Tipos de Evento</h3>

            {/* Tipos Existentes */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-4">Tipos Existentes</h4>
              <div className="space-y-3">
                {eventTypes.map(type => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between bg-background p-4 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${type.color}`} />
                      <div>
                        <h5 className="text-white font-medium">{type.name}</h5>
                        <p className="text-text-secondary text-sm">Valor: {type.value}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteType(type.id)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Agregar Nuevo Tipo */}
            <div>
              <h4 className="text-white font-medium mb-4">Agregar Nuevo Tipo</h4>
              <form onSubmit={handleAddType} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white text-sm mb-2">Nombre del Tipo</label>
                    <input
                      type="text"
                      value={newType.name}
                      onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                      placeholder="Workshop"
                      className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">Valor (slug)</label>
                    <input
                      type="text"
                      value={newType.value}
                      onChange={(e) => setNewType({ ...newType, value: e.target.value })}
                      placeholder="workshop"
                      className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">Color</label>
                    <select
                      value={newType.color}
                      onChange={(e) => setNewType({ ...newType, color: e.target.value })}
                      className="w-full p-3 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent"
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
                  >
                    Agregar Tipo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                          onClick={() => window.location.href = `/admin/events/${event.id}`}
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

export default EventsPage
