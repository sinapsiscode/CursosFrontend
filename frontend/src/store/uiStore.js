import { create } from 'zustand'

export const useUIStore = create((set, get) => ({
  theme: 'dark',
  notifications: [],
  modals: {
    areaSelection: false,
    login: false,
    register: false,
    coursePreview: false,
    subscription: false,
    certificatePreview: false
  },
  loading: {
    global: false,
    courses: false,
    video: false
  },
  toast: {
    show: false,
    message: '',
    type: 'info' // info, success, warning, error
  },
  sidebarOpen: false,
  searchQuery: '',
  activeTab: 'inicio',

  setTheme: (theme) => set({ theme }),
  
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'dark' ? 'light' : 'dark'
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }]
  })),

  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    )
  })),

  clearNotifications: () => set({ notifications: [] }),

  openModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: true }
  })),

  closeModal: (modalName) => set((state) => ({
    modals: { ...state.modals, [modalName]: false }
  })),

  closeAllModals: () => set((state) => {
    const modals = {}
    Object.keys(state.modals).forEach(key => {
      modals[key] = false
    })
    return { modals }
  }),

  setLoading: (key, value) => set((state) => ({
    loading: { ...state.loading, [key]: value }
  })),

  showToast: (message, type = 'info', duration = 3000) => {
    set({ toast: { show: true, message, type } })
    setTimeout(() => {
      set({ toast: { show: false, message: '', type: 'info' } })
    }, duration)
  },

  hideToast: () => set({ toast: { show: false, message: '', type: 'info' } }),


  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  getUnreadNotifications: () => get().notifications.filter(notif => !notif.read),
  
  getNotificationCount: () => get().notifications.filter(notif => !notif.read).length,

  isModalOpen: (modalName) => get().modals[modalName],
  
  isLoading: (key) => get().loading[key],

  getCurrentTheme: () => get().theme
}))