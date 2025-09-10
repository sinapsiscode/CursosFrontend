import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      selectedArea: null,
      isGuest: false,
      deviceId: null,
      sessionStartTime: null,
      totalSessionTime: 0,
      preferences: {
        theme: 'dark',
        language: 'es',
        notifications: true
      },

      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
          isGuest: false,
          sessionStartTime: Date.now()
        })
        
        // Inicializar progreso del usuario
        import('../store/progressStore').then(({ useProgressStore }) => {
          useProgressStore.getState().initializeUserProgress(userData)
        })
      },

      logout: () => {
        const state = get()
        if (state.sessionStartTime) {
          const sessionDuration = Date.now() - state.sessionStartTime
          const newTotalTime = state.totalSessionTime + sessionDuration
          
          // Guardar tiempo de sesión en el perfil del usuario
          if (state.user) {
            const updatedUser = {
              ...state.user,
              totalUsageTime: (state.user.totalUsageTime || 0) + sessionDuration
            }
            
            // Actualizar en localStorage para persistencia
            try {
              const existingUsers = JSON.parse(localStorage.getItem('userData') || '[]')
              const userIndex = existingUsers.findIndex(u => u.id === state.user.id)
              if (userIndex >= 0) {
                existingUsers[userIndex] = updatedUser
                localStorage.setItem('userData', JSON.stringify(existingUsers))
              }
            } catch (error) {
              console.error('Error saving user session time:', error)
            }
          }
          
          set({
            user: null,
            isAuthenticated: false,
            isGuest: false,
            sessionStartTime: null,
            totalSessionTime: newTotalTime
          })
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isGuest: false,
            sessionStartTime: null
          })
        }
      },

      setGuest: (deviceId) => set({
        isGuest: true,
        deviceId,
        isAuthenticated: false,
        user: null
      }),

      setSelectedArea: (area) => set({ selectedArea: area }),

      updatePreferences: (newPreferences) => set((state) => ({
        preferences: { ...state.preferences, ...newPreferences }
      })),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      generateDeviceId: () => {
        const deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        set({ deviceId })
        return deviceId
      },

      getUser: () => get().user,
      getSelectedArea: () => get().selectedArea,
      isUserAuthenticated: () => get().isAuthenticated,
      isGuestMode: () => get().isGuest,

      // Session Time Tracking
      startSession: () => set({ sessionStartTime: Date.now() }),
      
      getCurrentSessionDuration: () => {
        const state = get()
        return state.sessionStartTime ? Date.now() - state.sessionStartTime : 0
      },
      
      getTotalUsageTime: () => {
        const state = get()
        const currentSession = state.sessionStartTime ? Date.now() - state.sessionStartTime : 0
        return state.totalSessionTime + currentSession
      },

      // Actualizar tiempo de actividad (llamar periódicamente)
      updateActivityTime: () => {
        const state = get()
        if (state.sessionStartTime && state.user) {
          const sessionDuration = Date.now() - state.sessionStartTime
          const updatedUser = {
            ...state.user,
            totalUsageTime: (state.user.totalUsageTime || 0) + sessionDuration
          }
          
          // Reiniciar contador de sesión
          set({
            user: updatedUser,
            sessionStartTime: Date.now(),
            totalSessionTime: state.totalSessionTime + sessionDuration
          })
          
          // Guardar en localStorage
          try {
            const existingUsers = JSON.parse(localStorage.getItem('userData') || '[]')
            const userIndex = existingUsers.findIndex(u => u.id === state.user.id)
            if (userIndex >= 0) {
              existingUsers[userIndex] = updatedUser
              localStorage.setItem('userData', JSON.stringify(existingUsers))
            }
          } catch (error) {
            console.error('Error updating user session time:', error)
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedArea: state.selectedArea,
        isGuest: state.isGuest,
        deviceId: state.deviceId,
        sessionStartTime: state.sessionStartTime,
        totalSessionTime: state.totalSessionTime,
        preferences: state.preferences
      })
    }
  )
)