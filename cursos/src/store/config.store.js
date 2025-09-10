import { create } from 'zustand'

/**
 * Store para configuraciones de admin
 * Maneja todas las configuraciones dinámicas del sistema
 */
export const useConfigStore = create((set, get) => ({
  // Estado inicial
  areas: [], // Cargado desde API, no hardcode
  loyaltyConfig: null,
  discountConfig: null,
  whatsappConfig: null,
  generalConfig: null,
  loading: false,
  error: null,

  // Actions para áreas
  setAreas: (areas) => set({ areas }),
  
  addArea: (area) => set((state) => ({
    areas: [...state.areas, area]
  })),
  
  updateArea: (areaId, updates) => set((state) => ({
    areas: state.areas.map(area => 
      area.id === areaId ? { ...area, ...updates } : area
    )
  })),
  
  removeArea: (areaId) => set((state) => ({
    areas: state.areas.filter(area => area.id !== areaId)
  })),

  // Actions para configuración de loyalty
  setLoyaltyConfig: (config) => set({ loyaltyConfig: config }),
  
  updateLoyaltyLevel: (levelId, updates) => set((state) => ({
    loyaltyConfig: {
      ...state.loyaltyConfig,
      levels: {
        ...state.loyaltyConfig.levels,
        [levelId]: {
          ...state.loyaltyConfig.levels[levelId],
          ...updates
        }
      }
    }
  })),

  // Actions para configuración de descuentos  
  setDiscountConfig: (config) => set({ discountConfig: config }),
  
  updateDiscountRule: (ruleId, updates) => set((state) => ({
    discountConfig: {
      ...state.discountConfig,
      rules: state.discountConfig.rules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    }
  })),

  // Actions para configuración de WhatsApp
  setWhatsappConfig: (config) => set({ whatsappConfig: config }),
  
  updateWhatsappTemplate: (templateKey, content) => set((state) => ({
    whatsappConfig: {
      ...state.whatsappConfig,
      templates: {
        ...state.whatsappConfig.templates,
        [templateKey]: content
      }
    }
  })),

  // Actions para configuración general
  setGeneralConfig: (config) => set({ generalConfig: config }),
  
  updateGeneralSetting: (key, value) => set((state) => ({
    generalConfig: {
      ...state.generalConfig,
      [key]: value
    }
  })),

  // Loading and error states
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Getters
  getAreaById: (areaId) => {
    const state = get()
    return state.areas.find(area => area.id === areaId)
  },
  
  getAreaBySlug: (slug) => {
    const state = get()
    return state.areas.find(area => area.slug === slug)
  },

  getLoyaltyLevelByPoints: (points) => {
    const state = get()
    if (!state.loyaltyConfig?.levels) return null
    
    const levels = Object.values(state.loyaltyConfig.levels)
    return levels.find(level => 
      points >= level.minPoints && points <= level.maxPoints
    )
  },

  getDiscountForUser: (userPoints, userLevel) => {
    const state = get()
    if (!state.discountConfig?.rules) return 0
    
    // Lógica para calcular descuento basado en puntos/nivel
    const applicableRules = state.discountConfig.rules.filter(rule => {
      if (rule.type === 'points') return userPoints >= rule.minPoints
      if (rule.type === 'level') return rule.levels.includes(userLevel)
      return false
    })
    
    // Retornar el mayor descuento aplicable
    return Math.max(...applicableRules.map(rule => rule.discount), 0)
  },

  // Validation helpers
  isConfigurationComplete: () => {
    const state = get()
    return !!(
      state.areas.length > 0 &&
      state.loyaltyConfig &&
      state.generalConfig
    )
  },

  getRequiredConfigurations: () => {
    const state = get()
    const missing = []
    
    if (state.areas.length === 0) missing.push('areas')
    if (!state.loyaltyConfig) missing.push('loyalty')
    if (!state.generalConfig) missing.push('general')
    
    return missing
  },

  // Reset store
  reset: () => set({
    areas: [],
    loyaltyConfig: null,
    discountConfig: null,
    whatsappConfig: null,
    generalConfig: null,
    loading: false,
    error: null,
  }),
}))

export default useConfigStore