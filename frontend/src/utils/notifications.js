import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// Configuración de tema dark por defecto
const defaultConfig = {
  background: '#1c2a4a',
  color: '#ffffff',
  confirmButtonColor: '#98d932',
  cancelButtonColor: '#6b7280',
  customClass: {
    popup: 'rounded-xl border border-gray-600',
    title: 'text-white font-bold',
    content: 'text-gray-300',
    confirmButton: 'rounded-lg px-6 py-2 font-medium',
    cancelButton: 'rounded-lg px-6 py-2 font-medium'
  }
}

export const notifications = {
  
  // Notificación de éxito
  success: (title, text = '') => {
    return MySwal.fire({
      icon: 'success',
      title,
      text,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...defaultConfig
    })
  },

  // Notificación de error
  error: (title, text = '') => {
    return MySwal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Entendido',
      ...defaultConfig
    })
  },

  // Notificación de advertencia
  warning: (title, text = '') => {
    return MySwal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'Entendido',
      ...defaultConfig
    })
  },

  // Notificación de información
  info: (title, text = '') => {
    return MySwal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText: 'Entendido',
      ...defaultConfig
    })
  },

  // Confirmación simple
  confirm: (title, text = '', confirmText = 'Confirmar', cancelText = 'Cancelar') => {
    return MySwal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      ...defaultConfig
    })
  },

  // Confirmación de eliminación
  confirmDelete: (itemName = 'este elemento') => {
    return MySwal.fire({
      title: '¿Estás seguro?',
      text: `Esta acción eliminará ${itemName} permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      reverseButtons: true,
      ...defaultConfig
    })
  },

  // Toast (notificación pequeña)
  toast: (title, icon = 'success', position = 'top-end') => {
    return MySwal.fire({
      toast: true,
      position,
      icon,
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      ...defaultConfig,
      customClass: {
        popup: 'rounded-lg border border-gray-600 shadow-lg'
      }
    })
  },

  // Notificación de bienvenida
  welcome: (userName, selectedArea) => {
    const areaEmojis = {
      metalurgia: '⚒️',
      mineria: '⛏️',
      geologia: '🪨'
    }

    return MySwal.fire({
      title: `¡Bienvenido${userName ? `, ${userName}` : ''}! ${areaEmojis[selectedArea] || '🎓'}`,
      html: `
        <div class="space-y-4">
          <p class="text-gray-300">Has seleccionado el área de <strong class="text-accent">${selectedArea?.charAt(0).toUpperCase() + selectedArea?.slice(1)}</strong></p>
          <p class="text-gray-300">¡Estás listo para comenzar tu viaje de aprendizaje!</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Comenzar a explorar',
      ...defaultConfig
    })
  },

  // Progreso de curso completado
  courseCompleted: (courseName, area) => {
    const areaColors = {
      metalurgia: '#ff6b6b',
      mineria: '#4ecdc4',
      geologia: '#45b7d1'
    }

    return MySwal.fire({
      title: '🎉 ¡Felicitaciones!',
      html: `
        <div class="space-y-4">
          <p class="text-gray-300">Has completado el curso:</p>
          <h3 class="text-xl font-bold" style="color: ${areaColors[area]}">${courseName}</h3>
          <p class="text-gray-300">¡Tu certificado está siendo generado!</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Ver certificado',
      showCancelButton: true,
      cancelButtonText: 'Continuar estudiando',
      ...defaultConfig
    })
  },

  // Límite de demo alcanzado
  demoLimitReached: () => {
    return MySwal.fire({
      title: '🔒 Límite de demos alcanzado',
      html: `
        <div class="space-y-4">
          <p class="text-gray-300">Has visto 3 videos demo gratuitos.</p>
          <p class="text-gray-300">Regístrate para acceder a contenido completo y seguir aprendiendo.</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Registrarse ahora',
      showCancelButton: true,
      cancelButtonText: 'Explorar otros cursos',
      ...defaultConfig
    })
  },

  // Nueva racha de estudio
  studyStreak: (days) => {
    return MySwal.fire({
      title: `🔥 ¡${days} días seguidos!`,
      text: 'Mantén tu racha de estudio activa. ¡Excelente trabajo!',
      icon: 'success',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      ...defaultConfig
    })
  },

  // Subida de nivel en ranking
  rankingUp: (newPosition, points) => {
    return MySwal.fire({
      title: '📈 ¡Subiste en el ranking!',
      html: `
        <div class="space-y-4">
          <p class="text-gray-300">Nueva posición: <strong class="text-accent">#${newPosition}</strong></p>
          <p class="text-gray-300">Puntos esta semana: <strong>${points}</strong></p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Ver ranking completo',
      timer: 5000,
      timerProgressBar: true,
      ...defaultConfig
    })
  },

  // Carga con progreso
  loading: (title = 'Cargando...') => {
    return MySwal.fire({
      title,
      html: `
        <div class="flex justify-center items-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      ...defaultConfig
    })
  },

  // Input personalizado
  input: (title, inputType = 'text', placeholder = '') => {
    return MySwal.fire({
      title,
      input: inputType,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido'
        }
      },
      ...defaultConfig
    })
  },

  // Notificación de suscripción
  subscriptionRequired: (featureName) => {
    return MySwal.fire({
      title: '🚀 Función Premium',
      html: `
        <div class="space-y-4">
          <p class="text-gray-300">La función <strong class="text-accent">${featureName}</strong> requiere una suscripción premium.</p>
          <p class="text-gray-300">Desbloquea contenido exclusivo y herramientas avanzadas.</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Ver planes',
      showCancelButton: true,
      cancelButtonText: 'Tal vez después',
      ...defaultConfig
    })
  },

  // Recordatorio de estudio
  studyReminder: () => {
    return MySwal.fire({
      title: '📚 ¡Hora de estudiar!',
      text: 'No olvides continuar con tu aprendizaje hoy.',
      icon: 'info',
      confirmButtonText: 'Continuar curso',
      showCancelButton: true,
      cancelButtonText: 'Recordar más tarde',
      timer: 10000,
      timerProgressBar: true,
      ...defaultConfig
    })
  }
}

// Helper para mostrar mensajes de error de API
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error.response?.status === 401) {
    notifications.warning(
      'Sesión expirada',
      'Por favor, inicia sesión nuevamente'
    )
  } else if (error.response?.status === 403) {
    notifications.error(
      'Acceso denegado',
      'No tienes permisos para realizar esta acción'
    )
  } else if (error.response?.status >= 500) {
    notifications.error(
      'Error del servidor',
      'Ocurrió un problema. Intenta nuevamente en unos minutos.'
    )
  } else {
    notifications.error(
      'Algo salió mal',
      error.message || 'Ocurrió un error inesperado'
    )
  }
}

export default notifications