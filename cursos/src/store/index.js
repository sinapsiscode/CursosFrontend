/**
 * Barrel exports para todos los stores
 * Facilita las importaciones en componentes
 */

export { useAuthStore } from './auth.store'
export { useConfigStore } from './config.store' 
export { useUIStore } from './ui.store'

// Re-export default stores para compatibilidad
import useAuthStore from './auth.store'
import useConfigStore from './config.store'
import useUIStore from './ui.store'

export {
  useAuthStore as default,
  useConfigStore as configStore,
  useUIStore as uiStore,
}

/**
 * Helper para reset de todos los stores (útil para testing)
 */
export const resetAllStores = () => {
  useAuthStore.getState().reset?.()
  useConfigStore.getState().reset?.()
  useUIStore.getState().reset?.()
}

/**
 * Helper para obtener estado global combinado (debugging)
 */
export const getGlobalState = () => {
  return {
    auth: useAuthStore.getState(),
    config: useConfigStore.getState(),
    ui: useUIStore.getState(),
  }
}