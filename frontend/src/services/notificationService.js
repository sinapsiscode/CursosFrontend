// Sistema de Notificaciones Interactivas
import { whatsappService } from './whatsappService'
import CONFIG from '../constants/config'

export class NotificationService {
  constructor() {
    this.notifications = this.getStoredNotifications()
    this.notificationContainer = null
    this.initializeContainer()
  }

  // Obtener notificaciones almacenadas
  getStoredNotifications() {
    const stored = localStorage.getItem('user_notifications')
    return stored ? JSON.parse(stored) : []
  }

  // Guardar notificaciones
  saveNotifications() {
    localStorage.setItem('user_notifications', JSON.stringify(this.notifications))
  }

  // Inicializar contenedor de notificaciones
  initializeContainer() {
    if (typeof document !== 'undefined' && !document.getElementById('notification-container')) {
      const container = document.createElement('div')
      container.id = 'notification-container'
      container.className = 'fixed top-20 right-4 z-50 space-y-3 max-w-md'
      document.body.appendChild(container)
      this.notificationContainer = container
    }
  }

  // Crear notificación interactiva
  createNotification({
    id = Date.now().toString(),
    type = 'info', // info, success, warning, error, promo, event, group
    title,
    message,
    icon = null,
    actions = [], // [{ label: 'Ver más', url: 'https://...', target: '_blank' }]
    persistent = false,
    duration = 8000,
    timestamp = new Date().toISOString(),
    metadata = {},
    sound = false
  }) {
    const notification = {
      id,
      type,
      title,
      message,
      icon,
      actions,
      persistent,
      duration,
      timestamp,
      metadata,
      read: false,
      dismissed: false
    }

    // Agregar a la lista si es persistente
    if (persistent) {
      this.notifications.unshift(notification)
      this.saveNotifications()
    }

    // Mostrar notificación en pantalla
    this.displayNotification(notification, sound)

    return notification
  }

  // Mostrar notificación en pantalla
  displayNotification(notification, sound = false) {
    // Reproducir sonido si está habilitado
    if (sound) {
      this.playNotificationSound()
    }
    const notifElement = document.createElement('div')
    notifElement.id = `notif-${notification.id}`
    notifElement.className = this.getNotificationClasses(notification.type) + ' notification-enter'
    
    notifElement.innerHTML = `
      <div class="relative">
        ${notification.persistent ? `
          <button 
            onclick="notificationService.dismissNotification('${notification.id}')" 
            class="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1 hover:bg-gray-700 transition-colors"
          >
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ` : ''}
        
        <div class="flex space-x-3">
          ${notification.icon ? `
            <div class="flex-shrink-0">
              <div class="text-2xl">${notification.icon}</div>
            </div>
          ` : ''}
          
          <div class="flex-1">
            ${notification.title ? `
              <h4 class="font-semibold text-white mb-1">${notification.title}</h4>
            ` : ''}
            
            <p class="text-sm ${notification.title ? 'text-gray-300' : 'text-white'}">${notification.message}</p>
            
            ${notification.actions.length > 0 ? `
              <div class="mt-3 flex flex-wrap gap-2">
                ${notification.actions.map((action, index) => `
                  <button
                    onclick="notificationService.handleAction('${notification.id}', ${index})"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg 
                           ${this.getActionButtonClasses(notification.type)} 
                           transition-all duration-200 transform hover:scale-105"
                  >
                    ${action.icon ? `<span class="mr-1">${action.icon}</span>` : ''}
                    ${action.label}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="mt-2 text-xs text-gray-400">
          ${new Date(notification.timestamp).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    `

    // Agregar al contenedor
    if (this.notificationContainer) {
      this.notificationContainer.appendChild(notifElement)
    }

    // Animar entrada
    setTimeout(() => {
      notifElement.classList.add('animate-slide-in')
    }, 10)

    // Auto-remover si no es persistente
    if (!notification.persistent && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotificationElement(notification.id)
      }, notification.duration)
    }

    // Marcar como leída después de 3 segundos
    if (notification.persistent) {
      setTimeout(() => {
        this.markAsRead(notification.id)
      }, 3000)
    }
  }

  // Manejar acción de notificación
  handleAction(notificationId, actionIndex) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (!notification) return

    const action = notification.actions[actionIndex]
    if (!action) return

    // Registrar interacción
    console.log('📍 Notification Action:', {
      notificationId,
      action: action.label,
      url: action.url,
      timestamp: new Date().toISOString()
    })

    // Ejecutar acción
    if (action.url) {
      if (action.url.startsWith(CONFIG.WHATSAPP.WA_ME_BASE) || action.url.startsWith(CONFIG.WHATSAPP.CHAT_BASE)) {
        // WhatsApp link - manejar con el servicio
        whatsappService.showWhatsAppLinkModal(action.url, action.message || 'Únete a nuestro grupo')
      } else if (action.url.startsWith('/')) {
        // Navegación interna
        window.location.href = action.url
      } else {
        // Link externo
        window.open(action.url, action.target || '_blank')
      }
    }

    // Ejecutar callback si existe
    if (action.callback && typeof action.callback === 'function') {
      action.callback(notification)
    }

    // Remover notificación si la acción lo indica
    if (action.dismissOnClick) {
      this.dismissNotification(notificationId)
    }
  }

  // Marcar como leída
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      this.saveNotifications()
    }
  }

  // Descartar notificación
  dismissNotification(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId)
    if (index > -1) {
      this.notifications[index].dismissed = true
      this.saveNotifications()
    }
    this.removeNotificationElement(notificationId)
  }

  // Remover elemento de notificación
  removeNotificationElement(notificationId) {
    const element = document.getElementById(`notif-${notificationId}`)
    if (element) {
      element.classList.add('animate-slide-out')
      setTimeout(() => {
        element.remove()
      }, 300)
    }
  }

  // Reproducir sonido de notificación
  playNotificationSound() {
    try {
      // Usar un tono simple en lugar de archivo de audio
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      gainNode.gain.value = 0.1
      
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.log('No se pudo reproducir el sonido de notificación')
    }
  }

  // Obtener clases CSS según tipo
  getNotificationClasses(type) {
    const baseClasses = 'bg-gray-800 border rounded-xl p-4 shadow-xl transform transition-all duration-300 hover:shadow-2xl'
    
    const typeClasses = {
      info: 'border-blue-500/50',
      success: 'border-green-500/50',
      warning: 'border-yellow-500/50',
      error: 'border-red-500/50',
      promo: 'border-purple-500/50 bg-gradient-to-r from-gray-800 to-purple-900/20',
      event: 'border-orange-500/50 bg-gradient-to-r from-gray-800 to-orange-900/20',
      group: 'border-green-500/50 bg-gradient-to-r from-gray-800 to-green-900/20'
    }

    return `${baseClasses} ${typeClasses[type] || typeClasses.info}`
  }

  // Obtener clases de botón según tipo
  getActionButtonClasses(type) {
    const typeClasses = {
      info: 'bg-blue-600 hover:bg-blue-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      error: 'bg-red-600 hover:bg-red-700 text-white',
      promo: 'bg-purple-600 hover:bg-purple-700 text-white',
      event: 'bg-orange-600 hover:bg-orange-700 text-white',
      group: 'bg-green-600 hover:bg-green-700 text-white'
    }

    return typeClasses[type] || typeClasses.info
  }

  // Obtener notificaciones no leídas
  getUnreadCount() {
    return this.notifications.filter(n => !n.read && !n.dismissed).length
  }

  // Obtener todas las notificaciones activas
  getActiveNotifications() {
    return this.notifications.filter(n => !n.dismissed)
  }

  // Limpiar notificaciones antiguas (más de 7 días)
  cleanOldNotifications() {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    this.notifications = this.notifications.filter(n => {
      const notifDate = new Date(n.timestamp)
      return notifDate > oneWeekAgo || !n.dismissed
    })
    
    this.saveNotifications()
  }

  // Notificaciones predefinidas para eventos comunes
  showCoursePromotion(course, discount = 20) {
    return this.createNotification({
      type: 'promo',
      title: '🎯 ¡Oferta Especial!',
      message: `${course.title} con ${discount}% de descuento por tiempo limitado`,
      icon: '💰',
      actions: [
        {
          label: 'Ver Curso',
          url: `/course/${course.id}`,
          icon: '👀'
        },
        {
          label: 'Inscribirse Ahora',
          url: `/enroll/${course.id}?promo=${discount}`,
          icon: '🚀',
          dismissOnClick: true
        }
      ],
      persistent: true
    })
  }

  showWebinarInvitation(webinar) {
    return this.createNotification({
      type: 'event',
      title: '📹 Webinar Gratuito',
      message: `${webinar.title} - ${webinar.date}`,
      icon: '🎓',
      actions: [
        {
          label: 'Registrarse',
          url: webinar.registrationUrl,
          icon: '✍️',
          target: '_blank'
        },
        {
          label: 'Ver Detalles',
          url: `/events/webinar/${webinar.id}`,
          icon: '📋'
        }
      ],
      persistent: true
    })
  }

  showGroupInvitation(group) {
    return this.createNotification({
      type: 'group',
      title: '👥 Únete a la Comunidad',
      message: `Grupo de ${group.name}: ${group.description}`,
      icon: '💬',
      actions: [
        {
          label: 'Unirse al Grupo',
          url: group.whatsappLink,
          icon: '📱',
          message: `Hola! Me gustaría unirme al grupo de ${group.name}`
        }
      ],
      persistent: true
    })
  }

  showNewContentAlert(content) {
    return this.createNotification({
      type: 'info',
      title: '🆕 Nuevo Contenido',
      message: `${content.type}: ${content.title}`,
      icon: '📚',
      actions: [
        {
          label: 'Explorar',
          url: content.url,
          icon: '🔍'
        }
      ],
      duration: 10000
    })
  }

  showAchievement(achievement) {
    return this.createNotification({
      type: 'success',
      title: '🏆 ¡Logro Desbloqueado!',
      message: achievement.description,
      icon: achievement.icon || '⭐',
      actions: [
        {
          label: 'Ver Mis Logros',
          url: '/profile/achievements',
          icon: '🎯'
        }
      ],
      persistent: true
    })
  }
}

// Instancia singleton
export const notificationService = new NotificationService()

// Exponer globalmente para uso en onclick
if (typeof window !== 'undefined') {
  window.notificationService = notificationService
}

// Estilos CSS para animaciones
if (typeof document !== 'undefined' && !document.getElementById('notification-styles')) {
  const style = document.createElement('style')
  style.id = 'notification-styles'
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .animate-slide-in {
      animation: slideIn 0.3s ease-out forwards;
    }
    
    .animate-slide-out {
      animation: slideOut 0.3s ease-out forwards;
    }
  `
  document.head.appendChild(style)
}