/**
 * Barrel exports para todos los stores
 * Facilita las importaciones en componentes
 */

export { useAuthStore } from './auth.store'
export { useConfigStore } from './config.store' 
export { useUIStore } from './ui.store'
export { useAdminStore } from './adminStore'
export { useProgressStore } from './progressStore'
export { useCourseStore } from './courseStore'
export { useReviewStore } from './reviewStore'

// Re-export default stores para compatibilidad
import useAuthStore from './auth.store'
import useConfigStore from './config.store'
import useUIStore from './ui.store'
import useAdminStore from './adminStore'
import useProgressStore from './progressStore'
import useCourseStore from './courseStore'
import useReviewStore from './reviewStore'

export {
  useAuthStore as default,
  useConfigStore as configStore,
  useUIStore as uiStore,
  useAdminStore as adminStore,
  useProgressStore as progressStore,
  useCourseStore as courseStore,
  useReviewStore as reviewStore,
}

/**
 * Helper para reset de todos los stores (útil para testing)
 */
export const resetAllStores = () => {
  useAuthStore.getState().reset?.()
  useConfigStore.getState().reset?.()
  useUIStore.getState().reset?.()
  useAdminStore.getState().reset?.()
  useProgressStore.getState().reset?.()
  useCourseStore.getState().reset?.()
  useReviewStore.getState().reset?.()
}

/**
 * Helper para obtener estado global combinado (debugging)
 */
export const getGlobalState = () => {
  return {
    auth: useAuthStore.getState(),
    config: useConfigStore.getState(),
    ui: useUIStore.getState(),
    admin: useAdminStore.getState(),
    progress: useProgressStore.getState(),
    course: useCourseStore.getState(),
    review: useReviewStore.getState(),
  }
}