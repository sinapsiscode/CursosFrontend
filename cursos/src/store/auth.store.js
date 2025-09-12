import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { USER_ROLES, STORAGE_KEYS } from '../config/constants'

/**
 * Store de autenticación sin hardcode
 * Maneja estado de usuario, tokens y permisos
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      isAuthenticated: false,
      selectedArea: null,
      isGuest: false,
      deviceId: null,
      sessionStartTime: null,
      totalSessionTime: 0,
      
      // Preferencias de usuario
      preferences: {
        theme: 'dark',
        language: 'es',
        notifications: true,
      },

      // Actions
      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
          isGuest: false,
          sessionStartTime: Date.now(),
        })
        
        // Guardar token por separado para interceptors
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
      },

      logout: () => {
        const state = get()
        
        // Calcular tiempo de sesión final
        if (state.sessionStartTime) {
          const sessionDuration = Date.now() - state.sessionStartTime
          const newTotalTime = state.totalSessionTime + sessionDuration
          
          // Aquí podrías enviar estadísticas a la API antes de limpiar
        }

        // Limpiar estado
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isGuest: false,
          sessionStartTime: null,
        })

        // Limpiar localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      },

      setGuest: (area, deviceId) => {
        set({
          isGuest: true,
          selectedArea: area,
          deviceId: deviceId || `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sessionStartTime: Date.now(),
        })
      },

      setSelectedArea: (area) => {
        set({ selectedArea: area })
      },

      updateProfile: (profileData) => {
        set((state) => ({
          user: { ...state.user, ...profileData }
        }))
      },

      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        }))
      },

      // Session management
      startSession: () => {
        set({ sessionStartTime: Date.now() })
      },

      updateSessionTime: () => {
        const state = get()
        if (state.sessionStartTime) {
          const currentDuration = Date.now() - state.sessionStartTime
          set({
            totalSessionTime: state.totalSessionTime + currentDuration,
            sessionStartTime: Date.now(), // Reset for next interval
          })
        }
      },

      // Getters
      getCurrentSessionDuration: () => {
        const state = get()
        if (!state.sessionStartTime) return 0
        return Date.now() - state.sessionStartTime
      },

      getTotalUsageTime: () => {
        const state = get()
        const currentSession = state.getCurrentSessionDuration()
        return state.totalSessionTime + currentSession
      },

      isAdmin: () => {
        const state = get()
        return state.user?.role === USER_ROLES.ADMIN
      },

      isUser: () => {
        const state = get()
        return state.user?.role === USER_ROLES.USER
      },

      isGuestMode: () => {
        const state = get()
        return state.isGuest && !state.isAuthenticated
      },

      needsAreaSelection: () => {
        const state = get()
        return !state.selectedArea && !state.isAuthenticated && !state.isGuest
      },

      // Permissions
      canAccessAdminPanel: () => {
        const state = get()
        return state.isAuthenticated && state.user?.role === USER_ROLES.ADMIN
      },

      canAccessUserFeatures: () => {
        const state = get()
        return state.isAuthenticated || state.isGuest
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        selectedArea: state.selectedArea,
        isGuest: state.isGuest,
        deviceId: state.deviceId,
        totalSessionTime: state.totalSessionTime,
        preferences: state.preferences,
      }),
    }
  )
)

export default useAuthStore