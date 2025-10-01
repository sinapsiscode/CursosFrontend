import { useState } from 'react'

const NotificationManagement = () => {
  const [formData, setFormData] = useState({
    type: 'info',
    title: '',
    message: '',
    audience: 'all',
    action: 'none',
    persistent: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Enviar notificación:', formData)
    // TODO: Conectar con API
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Notificaciones de ejemplo
  const sampleNotifications = [
    {
      id: 1,
      icon: '🎁',
      title: 'Promoción de Curso',
      subtitle: 'Notificación con descuento especial',
      color: 'border-purple-500'
    },
    {
      id: 2,
      icon: '🎥',
      title: 'Invitación a Webinar',
      subtitle: 'Evento en vivo con registro',
      color: 'border-orange-700'
    },
    {
      id: 3,
      icon: '👥',
      title: 'Invitación a Grupo',
      subtitle: 'Únete a la comunidad WhatsApp',
      color: 'border-teal-600'
    },
    {
      id: 4,
      icon: '🏆',
      title: 'Logro Desbloqueado',
      subtitle: 'Celebrar progreso del estudiante',
      color: 'border-yellow-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna Izquierda - Formulario */}
      <div className="lg:col-span-1">
        <div className="bg-surface rounded-lg p-6">
          <h3 className="text-xl font-medium text-white mb-6">
            Crear Nueva Notificación
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Notificación */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Tipo de Notificación
              </label>
              <select
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
              >
                <option value="info">💡 Información</option>
                <option value="success">✅ Éxito</option>
                <option value="warning">⚠️ Advertencia</option>
                <option value="error">❌ Error</option>
                <option value="promo">🎯 Promoción</option>
                <option value="event">📅 Evento</option>
                <option value="group">👥 Grupo</option>
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Título de la notificación"
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Mensaje
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Contenido del mensaje..."
                rows={4}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {/* Audiencia */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Audiencia
              </label>
              <select
                value={formData.audience}
                onChange={(e) => updateField('audience', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
              >
                <option value="all">Todos los usuarios</option>
                <option value="area">Por área</option>
                <option value="course">Por curso</option>
              </select>
            </div>

            {/* Acción al hacer click */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Acción al hacer click
              </label>
              <select
                value={formData.action}
                onChange={(e) => updateField('action', e.target.value)}
                className="w-full bg-background border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
              >
                <option value="none">Sin acción</option>
                <option value="course">Ir a curso</option>
                <option value="event">Ver evento</option>
                <option value="group">Unirse a grupo</option>
                <option value="custom">Link personalizado</option>
              </select>
            </div>

            {/* Checkbox Persistente */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="persistent"
                checked={formData.persistent}
                onChange={(e) => updateField('persistent', e.target.checked)}
                className="w-4 h-4 text-accent bg-background border-gray-600 rounded focus:ring-accent focus:ring-2"
              />
              <label htmlFor="persistent" className="ml-2 text-sm text-text-secondary">
                Notificación persistente
              </label>
            </div>

            {/* Botón Enviar */}
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-background font-medium py-2.5 rounded-lg transition-colors"
            >
              Enviar Notificación
            </button>
          </form>
        </div>
      </div>

      {/* Columna Derecha - Notificaciones de Prueba + Vista Previa */}
      <div className="lg:col-span-2 space-y-6">
        {/* Notificaciones de Prueba */}
        <div className="bg-surface rounded-lg p-6">
          <h3 className="text-xl font-medium text-white mb-4">
            Notificaciones de Prueba
          </h3>

          <div className="space-y-3">
            {sampleNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-background border-l-4 ${notif.color} rounded-lg p-4 cursor-pointer hover:bg-background/80 transition-colors`}
                onClick={() => {
                  updateField('title', notif.title)
                  updateField('message', notif.subtitle)
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{notif.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{notif.title}</h4>
                    <p className="text-text-secondary text-sm mt-1">{notif.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default NotificationManagement
