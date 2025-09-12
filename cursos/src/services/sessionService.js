import { useAuthStore } from '../store/authStore'

class SessionService {
  constructor() {
    this.updateInterval = null
    this.updateIntervalTime = 30000 // 30 segundos
  }

  startTracking() {
    if (this.updateInterval) {
      this.stopTracking()
    }

    // Iniciar sesión
    const authStore = useAuthStore.getState()
    if (authStore.isAuthenticated && !authStore.sessionStartTime) {
      authStore.startSession()
    }

    // Actualizar tiempo de actividad cada 30 segundos
    this.updateInterval = setInterval(() => {
      const currentAuthState = useAuthStore.getState()
      if (currentAuthState.isAuthenticated) {
        currentAuthState.updateActivityTime()
      } else {
        this.stopTracking()
      }
    }, this.updateIntervalTime)

    // Event listeners para pause/resume cuando la ventana pierde foco
    this.setupVisibilityHandlers()
    
    console.log('🕒 Session tracking started')
  }

  stopTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
      console.log('🕒 Session tracking stopped')
    }
  }

  setupVisibilityHandlers() {
    // Pausar tracking cuando la ventana no está visible
    document.addEventListener('visibilitychange', () => {
      const authStore = useAuthStore.getState()
      if (document.hidden) {
        // Ventana oculta - pausar y guardar tiempo actual
        if (authStore.isAuthenticated) {
          authStore.updateActivityTime()
        }
      } else {
        // Ventana visible - reiniciar tracking
        if (authStore.isAuthenticated && !authStore.sessionStartTime) {
          authStore.startSession()
        }
      }
    })

    // Antes de cerrar la ventana, guardar el tiempo
    window.addEventListener('beforeunload', () => {
      const authStore = useAuthStore.getState()
      if (authStore.isAuthenticated) {
        authStore.updateActivityTime()
      }
    })
  }

  // Obtener estadísticas de sesión actual
  getCurrentSessionStats() {
    const authStore = useAuthStore.getState()
    return {
      currentSessionDuration: authStore.getCurrentSessionDuration(),
      totalUsageTime: authStore.getTotalUsageTime(),
      isTracking: !!this.updateInterval
    }
  }

  // Formatear tiempo en formato legible
  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }
}

export const sessionService = new SessionService()