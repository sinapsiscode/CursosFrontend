import { useState, useEffect, useCallback, useMemo } from 'react'
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

  // Calcular métricas derivadas - RECALCULA cuando users, courses o analytics cambien
  const derivedMetrics = useMemo(() => {
    return {
      totalUsers: analytics.totalUsers || users.length,
      totalCourses: analytics.totalCourses || courses.length,
      totalHours: analytics.totalHours || 0,
      revenueThisMonth: analytics.revenueThisMonth || 0,
      newUsersThisWeek: analytics.newUsersThisWeek || 0,
      topCourses: getTopCourses?.(5) || [],
      recentUsers: getRecentUsers?.(5) || []
    }
  }, [users, courses, analytics, getTopCourses, getRecentUsers])

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

      // Actualizar el store con los datos
      const store = useAdminStore.getState()
      store.setUsers(usersData || [])
      store.setCourses(coursesData || [])
      updateAnalytics(analyticsData)

      // Recalcular analytics basado en los datos reales con el rango de tiempo actual
      calculateAnalytics(timeRange)

      console.log(LOG_MESSAGES.DASHBOARD_LOADED, {
        totalUsers: usersData?.length || 0,
        totalCourses: coursesData?.length || 0,
        timeRange
      })

    } catch (error) {
      console.error(LOG_MESSAGES.LOADING_ERROR, error)
      console.error(LOG_MESSAGES.ERROR_DETAILS, error)
    } finally {
      setLoading(false)
      console.log(LOG_MESSAGES.LOADING_COMPLETED)
    }
  }, [updateAnalytics, calculateAnalytics, timeRange])

  // Cambiar rango de tiempo
  const changeTimeRange = useCallback((newRange) => {
    if (Object.values(TIME_RANGES).includes(newRange)) {
      console.log('📅 Cambiando rango de tiempo a:', newRange)
      setTimeRange(newRange)
      // Recalcular analytics con el nuevo rango
      calculateAnalytics(newRange)
    }
  }, [calculateAnalytics])

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

  // Obtener datos de gráfico de usuarios basados en datos reales
  const userChartData = useMemo(() => {
    if (!users || users.length === 0) {
      return [65, 45, 80, 35, 90, 55, 75].map((height, index) => ({
        day: ['L', 'M', 'X', 'J', 'V', 'S', 'D'][index],
        value: height,
        height: `${height}%`
      }))
    }

    // Calcular distribución de usuarios según el rango de tiempo
    const TIME_RANGE_DAYS = {
      week: 7,
      month: 30,
      semester: 180,
      year: 365
    }

    const days = TIME_RANGE_DAYS[timeRange] || 30
    const now = new Date()
    const segments = timeRange === 'week' ? 7 : timeRange === 'month' ? 7 : timeRange === 'semester' ? 6 : 12
    const segmentDays = Math.floor(days / segments)

    // Crear segmentos de tiempo
    const segmentCounts = new Array(segments).fill(0)
    const segmentLabels = []

    // Generar etiquetas según el rango
    if (timeRange === 'week') {
      segmentLabels.push(...['L', 'M', 'X', 'J', 'V', 'S', 'D'])
    } else if (timeRange === 'month') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() - (6 - i) * 4)
        segmentLabels.push(date.getDate().toString())
      }
    } else if (timeRange === 'semester') {
      const months = ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        segmentLabels.push(months[date.getMonth()])
      }
    } else { // year
      const months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        segmentLabels.push(months[date.getMonth()])
      }
    }

    // Contar usuarios por segmento
    users.forEach(user => {
      const userDate = new Date(user.fechaCreacion || user.createdAt)
      const daysDiff = Math.floor((now - userDate) / (1000 * 60 * 60 * 24))

      if (daysDiff >= 0 && daysDiff < days) {
        const segmentIndex = Math.floor(daysDiff / segmentDays)
        if (segmentIndex < segments) {
          segmentCounts[segments - 1 - segmentIndex]++
        }
      }
    })

    // Encontrar el máximo para normalizar las alturas
    const maxCount = Math.max(...segmentCounts, 1)

    // Generar datos del gráfico
    return segmentCounts.map((count, index) => ({
      day: segmentLabels[index],
      value: count,
      height: `${Math.round((count / maxCount) * 100)}%`
    }))
  }, [users, timeRange])

  // Cargar datos inicialmente
  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  // Configurar auto-refresh al montar
  useEffect(() => {
    const interval = setInterval(() => {
      const store = useAdminStore.getState()
      apiService.getUsers().then(users => store.setUsers(users || []))
      apiService.getCourses().then(courses => store.setCourses(courses || []))
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
    userChartData,

    // Acciones
    loadAnalytics,
    changeTimeRange,
    setupAutoRefresh,
    clearAutoRefresh
  }
}