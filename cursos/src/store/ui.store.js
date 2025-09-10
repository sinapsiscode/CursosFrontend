import { create } from 'zustand'

/**
 * Store para estado de UI global
 * Maneja modales, loading states, notificaciones, etc.
 */
export const useUIStore = create((set, get) => ({
  // Modales
  modals: {
    login: false,
    register: false,
    coursePreview: false,
    examResult: false,
    confirmDialog: false,
  },
  
  // Loading states
  loading: {
    global: false,
    courses: false,
    auth: false,
    config: false,
  },

  // Toast notifications
  toasts: [],

  // Sidebar/drawer states
  sidebarOpen: false,
  adminSidebarOpen: true,

  // Current view/filter states
  currentView: 'grid', // grid, list
  currentFilter: null,
  currentSort: 'newest',

  // Search state
  searchTerm: '',
  searchResults: [],

  // Actions para modales
  openModal: (modalName, data = null) => set((state) => ({
    modals: {
      ...state.modals,
      [modalName]: data || true
    }
  })),

  closeModal: (modalName) => set((state) => ({
    modals: {
      ...state.modals,
      [modalName]: false
    }
  })),

  closeAllModals: () => set((state) => ({
    modals: Object.keys(state.modals).reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {})
  })),

  // Actions para loading states
  setLoading: (key, value) => set((state) => ({
    loading: {
      ...state.loading,
      [key]: value
    }
  })),

  setGlobalLoading: (value) => set((state) => ({
    loading: {
      ...state.loading,
      global: value
    }
  })),

  // Actions para toasts
  addToast: (toast) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2)
    const newToast = {
      id,
      type: 'info',
      duration: 4000,
      ...toast,
      timestamp: Date.now(),
    }

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))

    // Auto remove toast
    if (newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, newToast.duration)
    }

    return id
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(toast => toast.id !== id)
  })),

  clearAllToasts: () => set({ toasts: [] }),

  // Helper methods para toasts comunes
  showSuccess: (message, options = {}) => {
    return get().addToast({
      type: 'success',
      message,
      ...options
    })
  },

  showError: (message, options = {}) => {
    return get().addToast({
      type: 'error',
      message,
      duration: 6000, // Errores duran más
      ...options
    })
  },

  showWarning: (message, options = {}) => {
    return get().addToast({
      type: 'warning',
      message,
      ...options
    })
  },

  showInfo: (message, options = {}) => {
    return get().addToast({
      type: 'info',
      message,
      ...options
    })
  },

  // Actions para sidebar
  toggleSidebar: () => set((state) => ({
    sidebarOpen: !state.sidebarOpen
  })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleAdminSidebar: () => set((state) => ({
    adminSidebarOpen: !state.adminSidebarOpen
  })),

  setAdminSidebarOpen: (open) => set({ adminSidebarOpen: open }),

  // Actions para view states
  setCurrentView: (view) => set({ currentView: view }),
  setCurrentFilter: (filter) => set({ currentFilter: filter }),
  setCurrentSort: (sort) => set({ currentSort: sort }),

  // Actions para search
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchResults: (results) => set({ searchResults: results }),
  clearSearch: () => set({ searchTerm: '', searchResults: [] }),

  // Getters
  isModalOpen: (modalName) => {
    const state = get()
    return !!state.modals[modalName]
  },

  getModalData: (modalName) => {
    const state = get()
    const modalState = state.modals[modalName]
    return typeof modalState === 'object' ? modalState : null
  },

  isLoading: (key) => {
    const state = get()
    return key ? state.loading[key] : state.loading.global
  },

  hasActiveToasts: () => {
    const state = get()
    return state.toasts.length > 0
  },

  getToastsByType: (type) => {
    const state = get()
    return state.toasts.filter(toast => toast.type === type)
  },

  // Reset store
  reset: () => set({
    modals: {
      login: false,
      register: false,
      coursePreview: false,
      examResult: false,
      confirmDialog: false,
    },
    loading: {
      global: false,
      courses: false,
      auth: false,
      config: false,
    },
    toasts: [],
    sidebarOpen: false,
    adminSidebarOpen: true,
    currentView: 'grid',
    currentFilter: null,
    currentSort: 'newest',
    searchTerm: '',
    searchResults: [],
  }),
}))

export default useUIStore