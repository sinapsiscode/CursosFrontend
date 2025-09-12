import { useState, useEffect } from 'react'
import { notificationService } from '../../services/notificationService'
import { useUIStore } from '../../store'
import hardcodedValuesService from '../../services/hardcodedValuesService'

const AdminNotifications = () => {
  const { showToast } = useUIStore()
  const [hardcodedValues, setHardcodedValues] = useState({})
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

  useEffect(() => {
    const loadHardcodedValues = async () => {
      try {
        const values = await hardcodedValuesService.getValues()
        setHardcodedValues(values)
      } catch (error) {
        console.error('Error loading hardcoded values:', error)
        setHardcodedValues({
          examples: {
            registrationUrl: 'https://metsel.edu.co/webinars/registro'
          },
          contacts: {
            whatsappChannelUrl: 'https://chat.whatsapp.com/test-group'
          }
        })
      }
    }
    loadHardcodedValues()
  }, [])

  const notificationTypes = {
    info: { label: 'Información', icon: '👷‍♂️', color: 'blue' },
    success: { label: 'Éxito', icon: '✅', color: 'green' },
    warning: { label: 'Advertencia', icon: '⚠️', color: 'yellow' },
    error: { label: 'Error', icon: '❌', color: 'red' },
    promo: { label: 'Promoción', icon: '🚀', color: 'purple' },
    event: { label: 'Evento', icon: '📅', color: 'orange' },
    group: { label: 'Grupo', icon: '👥', color: 'green' },
    achievement: { label: 'Logro', icon: '🏆', color: 'yellow' }
  }

  const actionTypes = {
    none: 'Sin acción',
    course: 'Ir a curso',
    event: 'Ver evento',
    group: 'Unirse a grupo',
    custom: 'Link personalizado'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
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
    } catch (error) {
      console.error('Error sending notification:', error)
      showToast('Error al enviar la notificación', 'error')
    }
  }

  const handleTestNotification = (type) => {
    try {
      switch (type) {
        case 'promo':
          notificationService.showCoursePromotion({
            id: 'test-1',
            title: 'Curso de Metalurgia Avanzada',
            area: 'metalurgia'
          }, 25)
          showToast('Notificación de promoción enviada', 'info')
          break
        
        case 'webinar':
          notificationService.showWebinarInvitation({
            id: 'webinar-1',
            title: 'Innovaciones en Minería Sostenible',
            date: 'Viernes 20 de Enero, 7:00 PM',
            registrationUrl: hardcodedValues?.examples?.registrationUrl || 'https://metsel.edu.co/webinars/registro'
          })
          showToast('Notificación de webinar enviada', 'info')
          break
        
        case 'group':
          notificationService.showGroupInvitation({
            name: 'Metalurgistas Pro',
            description: 'Compartimos conocimientos y oportunidades laborales',
            whatsappLink: hardcodedValues?.contacts?.whatsappChannelUrl || 'https://chat.whatsapp.com/test-group'
          })
          showToast('Invitación a grupo enviada', 'info')
          break
        
        case 'achievement':
          notificationService.showAchievement({
            title: 'Primera Lección Completada',
            description: 'Has completado tu primera lección. ¡Sigue así!',
            icon: '🎉'
          })
          showToast('Notificación de logro enviada', 'info')
          break

        case 'welcome':
          notificationService.createNotification({
            type: 'info',
            title: '¡Bienvenido a METSEL!',
            message: 'Explora nuestros cursos y comienza tu aprendizaje profesional.',
            icon: '👋',
            persistent: true
          })
          showToast('Notificación de bienvenida enviada', 'info')
          break

        case 'maintenance':
          notificationService.createNotification({
            type: 'warning',
            title: 'Mantenimiento Programado',
            message: 'El sistema estará en mantenimiento el domingo de 2:00 AM a 4:00 AM.',
            icon: '🔧',
            persistent: true
          })
          showToast('Notificación de mantenimiento enviada', 'warning')
          break
      }
    } catch (error) {
      console.error('Error sending test notification:', error)
      showToast('Error al enviar notificación de prueba', 'error')
    }
  }

  const getColorClasses = (type) => {
    switch (type) {
      case 'info': return 'border-blue-500/50 bg-blue-900/20'
      case 'success': return 'border-green-500/50 bg-green-900/20'
      case 'warning': return 'border-yellow-500/50 bg-yellow-900/20'
      case 'error': return 'border-red-500/50 bg-red-900/20'
      case 'promo': return 'border-purple-500/50 bg-purple-900/20'
      case 'event': return 'border-orange-500/50 bg-orange-900/20'
      case 'group': return 'border-green-500/50 bg-green-900/20'
      case 'achievement': return 'border-yellow-500/50 bg-yellow-900/20'
      default: return 'border-blue-500/50 bg-blue-900/20'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Centro de Notificaciones</h1>
        <p className="text-text-secondary">
          Envía notificaciones personalizadas a usuarios específicos o a toda la comunidad
        </p>
      </div>

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
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                Título *
              </label>
              <input
                type="text"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Título de la notificación"
                required
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mensaje *
              </label>
              <textarea
                value={notificationForm.message}
                onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                  className="px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                    className="px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                    className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
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
                  className="mr-2 text-accent focus:ring-accent"
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
        <div className="space-y-6">
          {/* Notificaciones de prueba */}
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

              <button
                onClick={() => handleTestNotification('welcome')}
                className="w-full text-left p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg hover:bg-blue-600/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">👋</span>
                  <div>
                    <p className="font-medium text-white">Mensaje de Bienvenida</p>
                    <p className="text-sm text-gray-300">Para nuevos usuarios</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleTestNotification('maintenance')}
                className="w-full text-left p-4 bg-red-600/20 border border-red-500/50 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <p className="font-medium text-white">Mantenimiento</p>
                    <p className="text-sm text-gray-300">Aviso de mantenimiento programado</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Vista previa */}
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vista Previa</h3>
            <div className={`p-4 rounded-lg border ${getColorClasses(notificationForm.type)}`}>
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
                    <button className="mt-3 text-sm bg-accent/20 text-accent hover:bg-accent/30 px-4 py-2 rounded-lg transition-colors">
                      {notificationForm.actionLabel || 'Ver más'}
                    </button>
                  )}
                </div>
                {notificationForm.persistent && (
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="mt-4 text-xs text-gray-400 space-y-1">
              <p><strong>Audiencia:</strong> {
                notificationForm.targetAudience === 'all' ? 'Todos los usuarios' :
                notificationForm.targetAudience === 'area' ? `Área: ${notificationForm.targetValue || 'no especificada'}` :
                `Curso: ${notificationForm.targetValue || 'no especificado'}`
              }</p>
              <p><strong>Tipo:</strong> {notificationTypes[notificationForm.type].label}</p>
              <p><strong>Persistente:</strong> {notificationForm.persistent ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información y consejos */}
      <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
        <h4 className="text-blue-400 font-semibold mb-3">💡 Consejos para notificaciones efectivas:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-300">
          <ul className="space-y-2">
            <li>• <strong>Títulos concisos:</strong> Máximo 60 caracteres</li>
            <li>• <strong>Mensajes claros:</strong> Directo al punto, evita jerga técnica</li>
            <li>• <strong>Call-to-action:</strong> Usa verbos de acción en los botones</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Timing:</strong> Envía en horarios de actividad alta</li>
            <li>• <strong>Segmentación:</strong> Personaliza por área de interés</li>
            <li>• <strong>Testing:</strong> Prueba siempre antes de envíos masivos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminNotifications