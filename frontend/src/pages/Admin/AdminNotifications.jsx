import { useState } from 'react'
import { notificationService } from '../../services/notificationService'
import { useUIStore } from '../../store'

const AdminNotifications = () => {
  const { showToast } = useUIStore()
  const [notificationForm, setNotificationForm] = useState({
    type: 'info',
    title: '',
    message: '',
    targetAudience: 'all', // all, area, course
    targetValue: '',
    actionType: 'none', // none, course, event, group, custom
    actionUrl: '',
    actionLabel: 'Ver más',
    persistent: true,
    scheduledDate: ''
  })

  const notificationTypes = {
    info: { label: 'Información', icon: '👷‍♂️', color: 'blue' },
    success: { label: 'Éxito', icon: '✅', color: 'green' },
    warning: { label: 'Advertencia', icon: '⚠️', color: 'yellow' },
    error: { label: 'Error', icon: '❌', color: 'red' },
    promo: { label: 'Promoción', icon: '🚀', color: 'purple' },
    event: { label: 'Evento', icon: '📅', color: 'orange' },
    group: { label: 'Grupo', icon: '👥', color: 'green' }
  }

  const actionTypes = {
    none: 'Sin acción',
    course: 'Ir a curso',
    event: 'Ver evento',
    group: 'Unirse a grupo',
    custom: 'Link personalizado'
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Construir acciones basadas en el tipo
    const actions = []
    if (notificationForm.actionType !== 'none') {
      let url = notificationForm.actionUrl
      let label = notificationForm.actionLabel
      let icon = '➡️'

      switch (notificationForm.actionType) {
        case 'course':
          icon = '📚'
          if (!url.startsWith('/')) url = `/course/${url}`
          break
        case 'event':
          icon = '📅'
          if (!url.startsWith('/')) url = `/events/${url}`
          break
        case 'group':
          icon = '📱'
          if (!url.startsWith('https://')) url = `https://chat.whatsapp.com/${url}`
          break
        case 'custom':
          icon = '🔗'
          break
      }

      actions.push({
        label,
        url,
        icon,
        target: url.startsWith('http') ? '_blank' : '_self'
      })
    }

    // Crear notificación
    const notification = notificationService.createNotification({
      type: notificationForm.type,
      title: notificationForm.title,
      message: notificationForm.message,
      icon: notificationTypes[notificationForm.type].icon,
      actions,
      persistent: notificationForm.persistent,
      metadata: {
        targetAudience: notificationForm.targetAudience,
        targetValue: notificationForm.targetValue,
        scheduledDate: notificationForm.scheduledDate,
        createdBy: 'admin'
      }
    })

    showToast('Notificación enviada exitosamente', 'success')
    
    // Reset form
    setNotificationForm({
      type: 'info',
      title: '',
      message: '',
      targetAudience: 'all',
      targetValue: '',
      actionType: 'none',
      actionUrl: '',
      actionLabel: 'Ver más',
      persistent: true,
      scheduledDate: ''
    })
  }

  const handleTestNotification = (type) => {
    switch (type) {
      case 'promo':
        notificationService.showCoursePromotion({
          id: 'test-1',
          title: 'Curso de Metalurgia Avanzada',
          area: 'metalurgia'
        }, 25)
        break
      
      case 'webinar':
        notificationService.showWebinarInvitation({
          id: 'webinar-1',
          title: 'Innovaciones en Minería Sostenible',
          date: 'Viernes 20 de Enero, 7:00 PM',
          registrationUrl: 'https://metsel.edu.co/webinars/registro'
        })
        break
      
      case 'group':
        notificationService.showGroupInvitation({
          name: 'Metalurgistas Pro',
          description: 'Compartimos conocimientos y oportunidades laborales',
          whatsappLink: 'https://chat.whatsapp.com/test-group'
        })
        break
      
      case 'achievement':
        notificationService.showAchievement({
          title: 'Primera Lección Completada',
          description: 'Has completado tu primera lección. ¡Sigue así!',
          icon: '🎉'
        })
        break
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Centro de Notificaciones</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de nueva notificación */}
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Crear Nueva Notificación</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de notificación */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Notificación
              </label>
              <select
                value={notificationForm.type}
                onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
              >
                {Object.entries(notificationTypes).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.icon} {value.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                placeholder="Título de la notificación"
                required
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mensaje
              </label>
              <textarea
                value={notificationForm.message}
                onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                placeholder="Contenido del mensaje..."
                rows="3"
                required
              />
            </div>

            {/* Audiencia objetivo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audiencia
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={notificationForm.targetAudience}
                  onChange={(e) => setNotificationForm({...notificationForm, targetAudience: e.target.value})}
                  className="px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                >
                  <option value="all">Todos los usuarios</option>
                  <option value="area">Por área</option>
                  <option value="course">Por curso</option>
                </select>
                
                {notificationForm.targetAudience !== 'all' && (
                  <input
                    type="text"
                    value={notificationForm.targetValue}
                    onChange={(e) => setNotificationForm({...notificationForm, targetValue: e.target.value})}
                    className="px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    placeholder={notificationForm.targetAudience === 'area' ? 'metalurgia, mineria...' : 'ID del curso'}
                  />
                )}
              </div>
            </div>

            {/* Tipo de acción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Acción al hacer click
              </label>
              <select
                value={notificationForm.actionType}
                onChange={(e) => setNotificationForm({...notificationForm, actionType: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
              >
                {Object.entries(actionTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* URL de acción */}
            {notificationForm.actionType !== 'none' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL/ID
                  </label>
                  <input
                    type="text"
                    value={notificationForm.actionUrl}
                    onChange={(e) => setNotificationForm({...notificationForm, actionUrl: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    placeholder={
                      notificationForm.actionType === 'course' ? 'ID del curso' :
                      notificationForm.actionType === 'event' ? 'ID del evento' :
                      notificationForm.actionType === 'group' ? 'ID del grupo' :
                      'https://...'
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Texto del botón
                  </label>
                  <input
                    type="text"
                    value={notificationForm.actionLabel}
                    onChange={(e) => setNotificationForm({...notificationForm, actionLabel: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white"
                    placeholder="Ver más"
                  />
                </div>
              </div>
            )}

            {/* Opciones adicionales */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={notificationForm.persistent}
                  onChange={(e) => setNotificationForm({...notificationForm, persistent: e.target.checked})}
                  className="mr-2"
                />
                Notificación persistente
              </label>
            </div>

            {/* Botón enviar */}
            <button
              type="submit"
              className="w-full bg-accent text-background py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Enviar Notificación
            </button>
          </form>
        </div>

        {/* Panel de pruebas */}
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notificaciones de Prueba</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => handleTestNotification('promo')}
              className="w-full text-left p-4 bg-purple-600/20 border border-purple-500/50 rounded-lg hover:bg-purple-600/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium text-white">Promoción de Curso</p>
                  <p className="text-sm text-gray-300">Notificación con descuento especial</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleTestNotification('webinar')}
              className="w-full text-left p-4 bg-orange-600/20 border border-orange-500/50 rounded-lg hover:bg-orange-600/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📹</span>
                <div>
                  <p className="font-medium text-white">Invitación a Webinar</p>
                  <p className="text-sm text-gray-300">Evento en vivo con registro</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleTestNotification('group')}
              className="w-full text-left p-4 bg-green-600/20 border border-green-500/50 rounded-lg hover:bg-green-600/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👥</span>
                <div>
                  <p className="font-medium text-white">Invitación a Grupo</p>
                  <p className="text-sm text-gray-300">Únete a la comunidad WhatsApp</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleTestNotification('achievement')}
              className="w-full text-left p-4 bg-yellow-600/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-600/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium text-white">Logro Desbloqueado</p>
                  <p className="text-sm text-gray-300">Celebrar progreso del estudiante</p>
                </div>
              </div>
            </button>
          </div>

          {/* Vista previa */}
          <div className="mt-6 p-4 bg-background rounded-lg">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Vista Previa</h4>
            <div className={`p-3 rounded-lg border ${
              notificationForm.type === 'promo' ? 'border-purple-500/50 bg-purple-900/20' :
              notificationForm.type === 'event' ? 'border-orange-500/50 bg-orange-900/20' :
              notificationForm.type === 'group' ? 'border-green-500/50 bg-green-900/20' :
              'border-blue-500/50 bg-blue-900/20'
            }`}>
              <div className="flex space-x-3">
                <span className="text-2xl">{notificationTypes[notificationForm.type].icon}</span>
                <div className="flex-1">
                  <h5 className="font-medium text-white">
                    {notificationForm.title || 'Título de la notificación'}
                  </h5>
                  <p className="text-sm text-gray-300 mt-1">
                    {notificationForm.message || 'Mensaje de la notificación...'}
                  </p>
                  {notificationForm.actionType !== 'none' && (
                    <button className="mt-2 text-xs bg-gray-700 px-3 py-1 rounded-lg">
                      {notificationForm.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminNotifications