import apiClient from '../api/client'

class AnalyticsService {
  // Métricas generales del dashboard
  async getDashboardMetrics(period = 'month') {
    try {
      const [leads, courses, areas, reviews] = await Promise.all([
        apiClient.get('/leads'),
        apiClient.get('/courses'),
        apiClient.get('/areas'),
        apiClient.get('/reviews')
      ])

      const now = new Date()
      const periodStart = this.getPeriodStart(now, period)

      // Filtrar datos por período
      const periodLeads = leads.filter(l => 
        new Date(l.createdAt) >= periodStart
      )

      const periodReviews = reviews.filter(r => 
        new Date(r.createdAt) >= periodStart
      )

      return {
        overview: {
          totalLeads: leads.length,
          periodLeads: periodLeads.length,
          conversionRate: this.calculateConversionRate(periodLeads),
          totalCourses: courses.length,
          totalAreas: areas.length,
          avgRating: this.calculateAvgRating(reviews.filter(r => r.status === 'approved'))
        },
        trends: {
          leadsGrowth: this.calculateGrowth(leads, period),
          revenueGrowth: this.calculateRevenueGrowth(periodLeads),
          engagementGrowth: this.calculateEngagementGrowth(periodReviews)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error)
      throw error
    }
  }

  // Análisis de leads
  async getLeadAnalytics(filters = {}) {
    try {
      const leads = await apiClient.get('/leads')
      
      return {
        bySource: this.groupByProperty(leads, 'source'),
        byArea: this.groupByProperty(leads, 'area'),
        byStatus: this.groupByProperty(leads, 'status'),
        conversionFunnel: this.buildConversionFunnel(leads),
        timeline: this.buildTimeline(leads, 'day'),
        topCourses: this.getTopInterestedCourses(leads),
        responseTime: this.calculateAvgResponseTime(leads)
      }
    } catch (error) {
      console.error('Error fetching lead analytics:', error)
      throw error
    }
  }

  // Análisis de WhatsApp
  async getWhatsAppAnalytics() {
    try {
      const [interactions, campaigns] = await Promise.all([
        apiClient.get('/whatsapp/interactions').catch(() => []),
        apiClient.get('/whatsapp/campaigns').catch(() => [])
      ])

      return {
        totalInteractions: interactions.length,
        interactionsByType: this.groupByProperty(interactions, 'type'),
        campaignPerformance: this.analyzeCampaigns(campaigns),
        peakHours: this.findPeakHours(interactions),
        responseRate: this.calculateWhatsAppResponseRate(interactions),
        popularMessages: this.getPopularMessages(interactions)
      }
    } catch (error) {
      console.error('Error fetching WhatsApp analytics:', error)
      return this.getEmptyWhatsAppAnalytics()
    }
  }

  // Análisis de cursos
  async getCourseAnalytics() {
    try {
      const [courses, reviews, leads] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/reviews'),
        apiClient.get('/leads')
      ])

      const courseStats = courses.map(course => {
        const courseReviews = reviews.filter(r => 
          r.courseId === course.id && r.status === 'approved'
        )
        const courseLeads = leads.filter(l => 
          l.courseId === course.id || l.interestedIn?.includes(course.title)
        )

        return {
          ...course,
          rating: this.calculateAvgRating(courseReviews),
          reviewCount: courseReviews.length,
          leadCount: courseLeads.length,
          conversionRate: this.calculateCourseConversion(courseLeads),
          popularity: this.calculatePopularity(courseReviews, courseLeads)
        }
      })

      return {
        topPerformers: courseStats.sort((a, b) => b.popularity - a.popularity).slice(0, 5),
        byArea: this.groupCoursesByArea(courseStats),
        priceAnalysis: this.analyzePricing(courseStats),
        completionRates: this.estimateCompletionRates(courseStats)
      }
    } catch (error) {
      console.error('Error fetching course analytics:', error)
      throw error
    }
  }

  // Análisis de exámenes
  async getExamAnalytics() {
    try {
      const examResults = await apiClient.get('/examResults')
      
      return {
        totalExams: examResults.length,
        avgScore: this.calculateAvgScore(examResults),
        scoreDistribution: this.buildScoreDistribution(examResults),
        discountImpact: this.analyzeDiscountImpact(examResults),
        completionRate: this.calculateExamCompletionRate(examResults),
        conversionAfterExam: this.calculatePostExamConversion(examResults)
      }
    } catch (error) {
      console.error('Error fetching exam analytics:', error)
      return this.getEmptyExamAnalytics()
    }
  }

  // Análisis de usuarios
  async getUserAnalytics() {
    try {
      const [leads, reviews, interactions] = await Promise.all([
        apiClient.get('/leads'),
        apiClient.get('/reviews'),
        apiClient.get('/whatsapp/interactions').catch(() => [])
      ])

      return {
        acquisition: {
          sources: this.analyzeAcquisitionSources(leads),
          channels: this.analyzeChannels(leads)
        },
        behavior: {
          engagementRate: this.calculateEngagementRate(interactions, reviews),
          activityHeatmap: this.buildActivityHeatmap(interactions),
          preferredContact: this.analyzeContactPreferences(leads)
        },
        retention: {
          cohortAnalysis: this.buildCohortAnalysis(leads),
          churnRate: this.calculateChurnRate(leads),
          lifetime: this.estimateLifetimeValue(leads)
        }
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      throw error
    }
  }

  // Reportes personalizados
  async generateReport(type, filters = {}) {
    const { startDate, endDate, format = 'summary' } = filters

    try {
      let data
      switch (type) {
        case 'weekly':
          data = await this.generateWeeklyReport(startDate)
          break
        case 'monthly':
          data = await this.generateMonthlyReport(startDate)
          break
        case 'custom':
          data = await this.generateCustomReport(startDate, endDate)
          break
        default:
          throw new Error('Invalid report type')
      }

      return format === 'detailed' ? this.formatDetailedReport(data) : data
    } catch (error) {
      console.error('Error generating report:', error)
      throw error
    }
  }

  // Métricas en tiempo real
  async getRealTimeMetrics() {
    try {
      const now = new Date()
      const last24Hours = new Date(now - 24 * 60 * 60 * 1000)
      const lastHour = new Date(now - 60 * 60 * 1000)

      const [leads, interactions] = await Promise.all([
        apiClient.get('/leads'),
        apiClient.get('/whatsapp/interactions').catch(() => [])
      ])

      const recentLeads = leads.filter(l => new Date(l.createdAt) >= last24Hours)
      const recentInteractions = interactions.filter(i => new Date(i.timestamp) >= lastHour)

      return {
        activeUsers: this.countActiveUsers(recentInteractions),
        newLeads: recentLeads.length,
        conversionRate: this.calculateConversionRate(recentLeads),
        currentActivity: this.getCurrentActivity(recentInteractions),
        alerts: this.generateAlerts(recentLeads, recentInteractions)
      }
    } catch (error) {
      console.error('Error fetching real-time metrics:', error)
      throw error
    }
  }

  // Métodos auxiliares
  getPeriodStart(date, period) {
    const d = new Date(date)
    switch (period) {
      case 'day':
        d.setHours(0, 0, 0, 0)
        break
      case 'week':
        d.setDate(d.getDate() - 7)
        break
      case 'month':
        d.setMonth(d.getMonth() - 1)
        break
      case 'quarter':
        d.setMonth(d.getMonth() - 3)
        break
      case 'year':
        d.setFullYear(d.getFullYear() - 1)
        break
    }
    return d
  }

  calculateConversionRate(leads) {
    if (!leads.length) return 0
    const converted = leads.filter(l => l.status === 'converted').length
    return Math.round((converted / leads.length) * 100)
  }

  calculateAvgRating(reviews) {
    if (!reviews.length) return 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  calculateGrowth(data, period) {
    const now = new Date()
    const currentPeriod = this.getPeriodStart(now, period)
    const previousPeriod = this.getPeriodStart(currentPeriod, period)

    const current = data.filter(d => {
      const date = new Date(d.createdAt || d.timestamp)
      return date >= currentPeriod
    }).length

    const previous = data.filter(d => {
      const date = new Date(d.createdAt || d.timestamp)
      return date >= previousPeriod && date < currentPeriod
    }).length

    if (!previous) return 100
    return Math.round(((current - previous) / previous) * 100)
  }

  groupByProperty(data, property) {
    return data.reduce((acc, item) => {
      const key = item[property] || 'unknown'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }

  buildTimeline(data, interval) {
    const timeline = {}
    data.forEach(item => {
      const date = new Date(item.createdAt || item.timestamp)
      const key = this.getTimelineKey(date, interval)
      timeline[key] = (timeline[key] || 0) + 1
    })
    return timeline
  }

  getTimelineKey(date, interval) {
    switch (interval) {
      case 'hour':
        return `${date.getHours()}:00`
      case 'day':
        return date.toLocaleDateString()
      case 'week':
        const week = Math.ceil(date.getDate() / 7)
        return `Week ${week}`
      case 'month':
        return date.toLocaleString('default', { month: 'short' })
      default:
        return date.toISOString().split('T')[0]
    }
  }

  buildConversionFunnel(leads) {
    const funnel = {
      'Nuevo': 0,
      'Contactado': 0,
      'Interesado': 0,
      'Negociando': 0,
      'Convertido': 0
    }

    leads.forEach(lead => {
      const status = this.mapLeadStatus(lead.status)
      if (funnel[status] !== undefined) {
        funnel[status]++
      }
    })

    return funnel
  }

  mapLeadStatus(status) {
    const mapping = {
      'new': 'Nuevo',
      'contacted': 'Contactado',
      'interested': 'Interesado',
      'negotiating': 'Negociando',
      'converted': 'Convertido'
    }
    return mapping[status] || 'Nuevo'
  }

  calculateAvgScore(examResults) {
    if (!examResults.length) return 0
    const sum = examResults.reduce((acc, r) => acc + (r.totalPoints || 0), 0)
    return Math.round(sum / examResults.length)
  }

  buildScoreDistribution(examResults) {
    const distribution = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    }

    examResults.forEach(result => {
      const score = result.totalPoints || 0
      if (score <= 20) distribution['0-20']++
      else if (score <= 40) distribution['21-40']++
      else if (score <= 60) distribution['41-60']++
      else if (score <= 80) distribution['61-80']++
      else distribution['81-100']++
    })

    return distribution
  }

  getEmptyWhatsAppAnalytics() {
    return {
      totalInteractions: 0,
      interactionsByType: {},
      campaignPerformance: [],
      peakHours: [],
      responseRate: 0,
      popularMessages: []
    }
  }

  getEmptyExamAnalytics() {
    return {
      totalExams: 0,
      avgScore: 0,
      scoreDistribution: {},
      discountImpact: 0,
      completionRate: 0,
      conversionAfterExam: 0
    }
  }

  // Métodos adicionales para cálculos complejos
  calculateRevenueGrowth(leads) {
    // Simulación basada en leads convertidos
    const converted = leads.filter(l => l.status === 'converted').length
    return converted * 15 // 15% de crecimiento estimado por lead convertido
  }

  calculateEngagementGrowth(reviews) {
    return reviews.length * 8 // 8% de crecimiento por review
  }

  getTopInterestedCourses(leads) {
    const interests = {}
    leads.forEach(lead => {
      if (lead.interestedIn) {
        interests[lead.interestedIn] = (interests[lead.interestedIn] || 0) + 1
      }
    })
    return Object.entries(interests)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([course, count]) => ({ course, count }))
  }

  calculateAvgResponseTime(leads) {
    // Simulación: tiempo promedio en horas
    return 2.5
  }

  analyzeCampaigns(campaigns) {
    return campaigns.map(campaign => ({
      ...campaign,
      openRate: Math.random() * 100,
      clickRate: Math.random() * 50,
      conversionRate: Math.random() * 20
    }))
  }

  findPeakHours(interactions) {
    const hours = {}
    interactions.forEach(i => {
      const hour = new Date(i.timestamp).getHours()
      hours[hour] = (hours[hour] || 0) + 1
    })
    return Object.entries(hours)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
  }

  calculateWhatsAppResponseRate(interactions) {
    // Simulación de tasa de respuesta
    return 78
  }

  getPopularMessages(interactions) {
    const messages = {}
    interactions.forEach(i => {
      if (i.content) {
        messages[i.content] = (messages[i.content] || 0) + 1
      }
    })
    return Object.entries(messages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }))
  }

  calculateCourseConversion(leads) {
    if (!leads.length) return 0
    const converted = leads.filter(l => l.status === 'converted').length
    return Math.round((converted / leads.length) * 100)
  }

  calculatePopularity(reviews, leads) {
    const reviewScore = reviews.length * 10
    const leadScore = leads.length * 5
    const avgRating = this.calculateAvgRating(reviews)
    return reviewScore + leadScore + (avgRating * 20)
  }

  groupCoursesByArea(courses) {
    const byArea = {}
    courses.forEach(course => {
      const area = course.area || 'General'
      if (!byArea[area]) {
        byArea[area] = []
      }
      byArea[area].push(course)
    })
    return byArea
  }

  analyzePricing(courses) {
    const prices = courses.map(c => c.price).filter(p => p > 0)
    if (!prices.length) return { avg: 0, min: 0, max: 0 }
    
    return {
      avg: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }

  estimateCompletionRates(courses) {
    // Simulación de tasas de finalización
    return courses.reduce((acc, course) => {
      acc[course.id] = Math.round(50 + Math.random() * 40) // 50-90%
      return acc
    }, {})
  }

  analyzeDiscountImpact(examResults) {
    const withDiscount = examResults.filter(r => r.discount > 0)
    if (!examResults.length) return 0
    return Math.round((withDiscount.length / examResults.length) * 100)
  }

  calculateExamCompletionRate(examResults) {
    // Asumiendo que algunos exámenes no se completan
    const completed = examResults.filter(r => r.completed !== false).length
    return Math.round((completed / examResults.length) * 100)
  }

  calculatePostExamConversion(examResults) {
    // Simulación: conversión después del examen
    const highScorers = examResults.filter(r => r.totalPoints > 60).length
    if (!examResults.length) return 0
    return Math.round((highScorers / examResults.length) * 100 * 0.7) // 70% de high scorers convierten
  }

  analyzeAcquisitionSources(leads) {
    const sources = this.groupByProperty(leads, 'source')
    const total = leads.length
    return Object.entries(sources).map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / total) * 100)
    }))
  }

  analyzeChannels(leads) {
    // Análisis de canales basado en metadata
    const channels = {
      organic: 0,
      paid: 0,
      social: 0,
      direct: 0
    }
    
    leads.forEach(lead => {
      if (lead.source?.includes('google')) channels.organic++
      else if (lead.source?.includes('ad')) channels.paid++
      else if (lead.source?.includes('social')) channels.social++
      else channels.direct++
    })
    
    return channels
  }

  calculateEngagementRate(interactions, reviews) {
    const totalActivity = interactions.length + reviews.length
    if (!totalActivity) return 0
    // Simulación de tasa de engagement
    return Math.min(Math.round(totalActivity / 10), 100)
  }

  buildActivityHeatmap(interactions) {
    const heatmap = Array(7).fill(null).map(() => Array(24).fill(0))
    
    interactions.forEach(interaction => {
      const date = new Date(interaction.timestamp)
      const day = date.getDay()
      const hour = date.getHours()
      heatmap[day][hour]++
    })
    
    return heatmap
  }

  analyzeContactPreferences(leads) {
    return this.groupByProperty(leads, 'preferredContact')
  }

  buildCohortAnalysis(leads) {
    // Análisis de cohortes por mes
    const cohorts = {}
    
    leads.forEach(lead => {
      const date = new Date(lead.createdAt)
      const cohortKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      if (!cohorts[cohortKey]) {
        cohorts[cohortKey] = {
          size: 0,
          converted: 0,
          active: 0
        }
      }
      
      cohorts[cohortKey].size++
      if (lead.status === 'converted') cohorts[cohortKey].converted++
      if (lead.lastActivity && new Date(lead.lastActivity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
        cohorts[cohortKey].active++
      }
    })
    
    return cohorts
  }

  calculateChurnRate(leads) {
    const total = leads.length
    if (!total) return 0
    
    const inactive = leads.filter(lead => {
      if (!lead.lastActivity) return true
      const daysSinceActivity = (Date.now() - new Date(lead.lastActivity)) / (1000 * 60 * 60 * 24)
      return daysSinceActivity > 30
    }).length
    
    return Math.round((inactive / total) * 100)
  }

  estimateLifetimeValue(leads) {
    // Estimación simplificada del valor de vida del cliente
    const converted = leads.filter(l => l.status === 'converted').length
    if (!converted) return 0
    
    const avgCourseValue = 500 // Valor promedio estimado
    const avgCoursesPerCustomer = 2.5 // Promedio de cursos por cliente
    
    return Math.round(avgCourseValue * avgCoursesPerCustomer)
  }

  countActiveUsers(interactions) {
    const uniqueUsers = new Set()
    interactions.forEach(i => {
      if (i.userId) uniqueUsers.add(i.userId)
    })
    return uniqueUsers.size
  }

  getCurrentActivity(interactions) {
    return interactions.slice(-10).map(i => ({
      type: i.type,
      timestamp: i.timestamp,
      user: i.userId || 'Anonymous'
    }))
  }

  generateAlerts(leads, interactions) {
    const alerts = []
    
    // Alert: Spike in new leads
    if (leads.length > 10) {
      alerts.push({
        type: 'success',
        message: `${leads.length} nuevos leads en las últimas 24 horas`,
        priority: 'high'
      })
    }
    
    // Alert: Low interaction
    if (interactions.length < 5) {
      alerts.push({
        type: 'warning',
        message: 'Baja actividad de WhatsApp en la última hora',
        priority: 'medium'
      })
    }
    
    return alerts
  }

  async generateWeeklyReport(startDate) {
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)
    
    return this.generateCustomReport(startDate, endDate)
  }

  async generateMonthlyReport(startDate) {
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)
    
    return this.generateCustomReport(startDate, endDate)
  }

  async generateCustomReport(startDate, endDate) {
    const [leads, courses, reviews, examResults] = await Promise.all([
      apiClient.get('/leads'),
      apiClient.get('/courses'),
      apiClient.get('/reviews'),
      apiClient.get('/examResults')
    ])
    
    const filteredLeads = leads.filter(l => {
      const date = new Date(l.createdAt)
      return date >= startDate && date <= endDate
    })
    
    const filteredReviews = reviews.filter(r => {
      const date = new Date(r.createdAt)
      return date >= startDate && date <= endDate
    })
    
    const filteredExams = examResults.filter(e => {
      const date = new Date(e.completedAt)
      return date >= startDate && date <= endDate
    })
    
    return {
      period: { start: startDate, end: endDate },
      summary: {
        newLeads: filteredLeads.length,
        conversions: filteredLeads.filter(l => l.status === 'converted').length,
        newReviews: filteredReviews.length,
        examsCompleted: filteredExams.length
      },
      details: {
        leadsBySource: this.groupByProperty(filteredLeads, 'source'),
        leadsByArea: this.groupByProperty(filteredLeads, 'area'),
        avgExamScore: this.calculateAvgScore(filteredExams),
        topCourses: this.getTopInterestedCourses(filteredLeads)
      }
    }
  }

  formatDetailedReport(data) {
    return {
      ...data,
      formatted: true,
      generatedAt: new Date().toISOString(),
      charts: {
        leadTrend: this.prepareChartData(data.details.leadsBySource),
        conversionFunnel: this.prepareChartData(data.details.leadsByArea)
      }
    }
  }

  prepareChartData(data) {
    return {
      labels: Object.keys(data),
      values: Object.values(data)
    }
  }
}

export default new AnalyticsService()