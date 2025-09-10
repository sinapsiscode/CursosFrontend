import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import analyticsService from '../../services/analyticsService'
import { Card, Button } from '../../components/ui'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { showError, loading, setLoading } = useUIStore()
  
  const [metrics, setMetrics] = useState(null)
  const [leadAnalytics, setLeadAnalytics] = useState(null)
  const [courseAnalytics, setCourseAnalytics] = useState(null)
  const [whatsappAnalytics, setWhatsappAnalytics] = useState(null)
  const [examAnalytics, setExamAnalytics] = useState(null)
  const [realTimeMetrics, setRealTimeMetrics] = useState(null)
  
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshInterval, setRefreshInterval] = useState(null)

  useEffect(() => {
    loadDashboardData()
    
    // Actualización en tiempo real cada 30 segundos
    const interval = setInterval(() => {
      loadRealTimeMetrics()
    }, 30000)
    
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [selectedPeriod])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [
        dashboardMetrics,
        leads,
        courses,
        whatsapp,
        exams,
        realTime
      ] = await Promise.all([
        analyticsService.getDashboardMetrics(selectedPeriod),
        analyticsService.getLeadAnalytics(),
        analyticsService.getCourseAnalytics(),
        analyticsService.getWhatsAppAnalytics(),
        analyticsService.getExamAnalytics(),
        analyticsService.getRealTimeMetrics()
      ])

      setMetrics(dashboardMetrics)
      setLeadAnalytics(leads)
      setCourseAnalytics(courses)
      setWhatsappAnalytics(whatsapp)
      setExamAnalytics(exams)
      setRealTimeMetrics(realTime)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      showError('Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadRealTimeMetrics = async () => {
    try {
      const realTime = await analyticsService.getRealTimeMetrics()
      setRealTimeMetrics(realTime)
    } catch (error) {
      console.error('Error loading real-time metrics:', error)
    }
  }

  const exportReport = async (type) => {
    try {
      const report = await analyticsService.generateReport(type, {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        format: 'detailed'
      })
      
      // Convertir a JSON y descargar
      const dataStr = JSON.stringify(report, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `report-${type}-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      console.error('Error exporting report:', error)
      showError('Error al exportar el reporte')
    }
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num?.toString() || '0'
  }

  const formatPercentage = (num) => `${num}%`

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-text-secondary">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Dashboard Analytics
            </h1>
            <p className="text-text-secondary">
              Bienvenido, {user?.name} • {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Period Selector */}
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary"
            >
              <option value="day">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Último trimestre</option>
              <option value="year">Último año</option>
            </select>

            {/* Export Options */}
            <div className="relative group">
              <Button variant="secondary">
                Exportar Reporte
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button 
                  onClick={() => exportReport('weekly')}
                  className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
                >
                  Reporte Semanal
                </button>
                <button 
                  onClick={() => exportReport('monthly')}
                  className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
                >
                  Reporte Mensual
                </button>
                <button 
                  onClick={() => exportReport('custom')}
                  className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-gray-700"
                >
                  Reporte Personalizado
                </button>
              </div>
            </div>

            <Button onClick={loadDashboardData}>
              Actualizar
            </Button>
          </div>
        </div>

        {/* Real-time Alerts */}
        {realTimeMetrics?.alerts?.length > 0 && (
          <div className="mt-4 space-y-2">
            {realTimeMetrics.alerts.map((alert, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border ${
                  alert.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                  'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <nav className="flex space-x-8">
          {['overview', 'leads', 'courses', 'whatsapp', 'exams', 'users'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Total Leads</p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    {formatNumber(metrics?.overview?.totalLeads || 0)}
                  </p>
                  <p className="text-sm mt-2">
                    <span className={`${metrics?.trends?.leadsGrowth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics?.trends?.leadsGrowth > 0 ? '↑' : '↓'} {Math.abs(metrics?.trends?.leadsGrowth || 0)}%
                    </span>
                    <span className="text-text-secondary ml-1">vs período anterior</span>
                  </p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Tasa de Conversión</p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    {formatPercentage(metrics?.overview?.conversionRate || 0)}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="text-green-400">Meta: 25%</span>
                  </p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Cursos Activos</p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    {formatNumber(metrics?.overview?.totalCourses || 0)}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="text-text-secondary">{metrics?.overview?.totalAreas || 0} áreas</span>
                  </p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm">Rating Promedio</p>
                  <p className="text-3xl font-bold text-text-primary mt-1">
                    {metrics?.overview?.avgRating || 0} ⭐
                  </p>
                  <p className="text-sm mt-2">
                    <span className="text-text-secondary">De reviews aprobadas</span>
                  </p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
            </Card>
          </div>

          {/* Real-time Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Actividad en Tiempo Real
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-text-secondary text-sm">Usuarios Activos</p>
                <p className="text-2xl font-bold text-accent">
                  {realTimeMetrics?.activeUsers || 0}
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Nuevos Leads (24h)</p>
                <p className="text-2xl font-bold text-green-400">
                  {realTimeMetrics?.newLeads || 0}
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-sm">Tasa de Conversión (Hoy)</p>
                <p className="text-2xl font-bold text-blue-400">
                  {realTimeMetrics?.conversionRate || 0}%
                </p>
              </div>
            </div>

            {/* Activity Stream */}
            {realTimeMetrics?.currentActivity?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-text-secondary mb-3">
                  Actividad Reciente
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {realTimeMetrics.currentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-text-primary">{activity.type}</span>
                      <span className="text-text-secondary">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Lead Conversion Funnel */}
          {leadAnalytics?.conversionFunnel && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Funnel de Conversión
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(leadAnalytics.conversionFunnel).map(([stage, count]) => ({
                  stage,
                  count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="stage" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'leads' && leadAnalytics && (
        <div className="space-y-6">
          {/* Lead Sources Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Distribución por Fuente
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(leadAnalytics.bySource || {}).map(([source, count]) => ({
                      name: source,
                      value: count
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(leadAnalytics.bySource || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Por Área de Interés
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(leadAnalytics.byArea || {}).map(([area, count]) => ({
                  area,
                  count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="area" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Lead Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Timeline de Leads
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Object.entries(leadAnalytics.timeline || {}).map(([date, count]) => ({
                date,
                count
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Interested Courses */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Cursos Más Solicitados
            </h3>
            <div className="space-y-3">
              {leadAnalytics.topCourses?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-text-primary">{item.course}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${(item.count / leadAnalytics.topCourses[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-text-secondary text-sm w-10 text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'courses' && courseAnalytics && (
        <div className="space-y-6">
          {/* Top Performing Courses */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Cursos Top Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-text-secondary">Curso</th>
                    <th className="text-center py-2 text-text-secondary">Rating</th>
                    <th className="text-center py-2 text-text-secondary">Reviews</th>
                    <th className="text-center py-2 text-text-secondary">Leads</th>
                    <th className="text-center py-2 text-text-secondary">Conversión</th>
                    <th className="text-center py-2 text-text-secondary">Popularidad</th>
                  </tr>
                </thead>
                <tbody>
                  {courseAnalytics.topPerformers?.map((course, idx) => (
                    <tr key={idx} className="border-b border-gray-800">
                      <td className="py-3 text-text-primary">{course.title}</td>
                      <td className="text-center py-3">
                        <span className="text-yellow-400">{course.rating} ⭐</span>
                      </td>
                      <td className="text-center py-3 text-text-secondary">{course.reviewCount}</td>
                      <td className="text-center py-3 text-text-secondary">{course.leadCount}</td>
                      <td className="text-center py-3">
                        <span className={`${course.conversionRate > 20 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {course.conversionRate}%
                        </span>
                      </td>
                      <td className="text-center py-3">
                        <div className="w-20 bg-gray-700 rounded-full h-2 mx-auto">
                          <div 
                            className="bg-accent h-2 rounded-full"
                            style={{ width: `${Math.min(course.popularity / 10, 100)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Price Analysis */}
          {courseAnalytics.priceAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <p className="text-text-secondary text-sm">Precio Promedio</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  ${courseAnalytics.priceAnalysis.avg}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-text-secondary text-sm">Precio Mínimo</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  ${courseAnalytics.priceAnalysis.min}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-text-secondary text-sm">Precio Máximo</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  ${courseAnalytics.priceAnalysis.max}
                </p>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === 'whatsapp' && whatsappAnalytics && (
        <div className="space-y-6">
          {/* WhatsApp Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <p className="text-text-secondary text-sm">Total Interacciones</p>
              <p className="text-3xl font-bold text-text-primary mt-1">
                {formatNumber(whatsappAnalytics.totalInteractions)}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-text-secondary text-sm">Tasa de Respuesta</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {whatsappAnalytics.responseRate}%
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-text-secondary text-sm">Campañas Activas</p>
              <p className="text-3xl font-bold text-text-primary mt-1">
                {whatsappAnalytics.campaignPerformance?.length || 0}
              </p>
            </Card>
          </div>

          {/* Peak Hours */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Horas Pico de Actividad
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={whatsappAnalytics.peakHours || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="count" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Popular Messages */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Mensajes Más Frecuentes
            </h3>
            <div className="space-y-3">
              {whatsappAnalytics.popularMessages?.map((msg, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-text-primary text-sm">{msg.message}</span>
                  <span className="text-text-secondary">{msg.count} veces</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'exams' && examAnalytics && (
        <div className="space-y-6">
          {/* Exam Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-text-secondary text-sm">Total Exámenes</p>
              <p className="text-3xl font-bold text-text-primary mt-1">
                {examAnalytics.totalExams}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-text-secondary text-sm">Puntaje Promedio</p>
              <p className="text-3xl font-bold text-text-primary mt-1">
                {examAnalytics.avgScore}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-text-secondary text-sm">Tasa Completación</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                {examAnalytics.completionRate}%
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-text-secondary text-sm">Conversión Post-Examen</p>
              <p className="text-3xl font-bold text-accent mt-1">
                {examAnalytics.conversionAfterExam}%
              </p>
            </Card>
          </div>

          {/* Score Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Distribución de Puntajes
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(examAnalytics.scoreDistribution || {}).map(([range, count]) => ({
                range,
                count
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              Análisis de Usuarios (Próximamente)
            </h3>
            <p className="text-text-secondary">
              Esta sección mostrará análisis detallado del comportamiento de usuarios, 
              retención, y valor de vida del cliente.
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Dashboard