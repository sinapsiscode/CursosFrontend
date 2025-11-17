import { useState, useEffect, useCallback } from 'react'
import { useAdminStore } from '../store'
import { apiService } from '../services/api'
import { TIME_RANGES, LOG_MESSAGES, ANALYTICS_CONFIG } from '../constants/adminDashboardConstants'

export const useAdminAnalytics = () => {
  const {
    analytics,
    users,
    courses,
    updateAnalytics,
    calculateAnalytics,
    getTopCourses,
    getRecentUsers
  } = useAdminStore()

  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(ANALYTICS_CONFIG.defaultTimeRange)
  const [refreshInterval, setRefreshInterval] = useState(null)

  // Calcular métricas derivadas
  const derivedMetrics = {
    totalUsers: analytics.totalUsers || users.length,
    totalCourses: analytics.totalCourses || courses.length,
    totalHours: analytics.totalHours || 0,
    revenueThisMonth: analytics.revenueThisMonth || 0,
    newUsersThisWeek: analytics.newUsersThisWeek || 0,
    topCourses: getTopCourses?.() || [],
    recentUsers: getRecentUsers?.() || []
  }

  // Cargar datos de analytics
  const loadAnalytics = useCallback(async () => {
    try {
      console.log(LOG_MESSAGES.LOADING_DASHBOARD)
      setLoading(true)

      // Cargar usuarios, cursos y analytics en paralelo
      const [usersData, coursesData, analyticsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getCourses(),
        apiService.getAnalytics()
      ])

      console.log('📊 Datos cargados:', {
        usuarios: usersData?.length || 0,
        cursos: coursesData?.length || 0,
        analytics: analyticsData
      })

      // Actualizar el store con los datos
      const store = useAdminStore.getState()
      store.setUsers(usersData || [])
      store.setCourses(coursesData || [])
      updateAnalytics(analyticsData)

      // Recalcular analytics basado en los datos reales
      calculateAnalytics()

      console.log(LOG_MESSAGES.DASHBOARD_LOADED, {
        totalUsers: usersData?.length || 0,
        totalCourses: coursesData?.length || 0
      })

    } catch (error) {
      console.error(LOG_MESSAGES.LOADING_ERROR, error)
      console.error(LOG_MESSAGES.ERROR_DETAILS, error)
    } finally {
      setLoading(false)
      console.log(LOG_MESSAGES.LOADING_COMPLETED)
    }
  }, [updateAnalytics, calculateAnalytics])

  // Cambiar rango de tiempo
  const changeTimeRange = useCallback((newRange) => {
    if (Object.values(TIME_RANGES).includes(newRange)) {
      setTimeRange(newRange)
      loadAnalytics() // Recargar datos con nuevo rango
    }
  }, [loadAnalytics])

  // Configurar auto-refresh
  const setupAutoRefresh = useCallback(() => {
    const interval = setInterval(() => {
      loadAnalytics()
    }, ANALYTICS_CONFIG.refreshInterval)

    setRefreshInterval(interval)
    return interval
  }, [loadAnalytics])

  // Limpiar auto-refresh
  const clearAutoRefresh = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }
  }, [refreshInterval])

  // Obtener datos de gráfico de usuarios (simulado)
  const getUserChartData = () => {
    return [65, 45, 80, 35, 90, 55, 75].map((height, index) => ({
      day: ['L', 'M', 'X', 'J', 'V', 'S', 'D'][index],
      value: height,
      height: `${height}%`
    }))
  }

  // Cargar datos inicialmente
  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  // Configurar auto-refresh al montar
  useEffect(() => {
    const interval = setInterval(() => {
      loadAnalytics()
    }, ANALYTICS_CONFIG.refreshInterval)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return {
    // Estado
    loading,
    timeRange,

    // Métricas
    metrics: derivedMetrics,

    // Datos de gráficos
    userChartData: getUserChartData(),

    // Acciones
    loadAnalytics,
    changeTimeRange,
    setupAutoRefresh,
    clearAutoRefresh
  }
}