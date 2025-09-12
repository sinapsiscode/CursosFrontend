import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import { Button, Card } from '../../components/ui'
import apiClient from '../../api/client'
import { whatsappService } from '../../services/whatsappService'
import analyticsService from '../../services/analyticsService'
import hardcodedValuesService from '../../services/hardcodedValuesService'

const SystemCheck = () => {
  const { user } = useAuthStore()
  const { showSuccess, showError, loading, setLoading } = useUIStore()
  
  const [checks, setChecks] = useState({
    api: { status: 'pending', message: '', details: null },
    database: { status: 'pending', message: '', details: null },
    whatsapp: { status: 'pending', message: '', details: null },
    analytics: { status: 'pending', message: '', details: null },
    storage: { status: 'pending', message: '', details: null },
    performance: { status: 'pending', message: '', details: null }
  })
  
  const [isRunning, setIsRunning] = useState(false)
  const [report, setReport] = useState(null)
  const [hardcodedValues, setHardcodedValues] = useState(null)

  useEffect(() => {
    const loadHardcodedValues = async () => {
      try {
        const values = await hardcodedValuesService.getValues()
        setHardcodedValues(values)
      } catch (error) {
        console.error('Error loading hardcoded values:', error)
      }
    }
    loadHardcodedValues()
    runSystemCheck()
  }, [])

  const runSystemCheck = async () => {
    setIsRunning(true)
    setLoading(true)
    
    const results = { ...checks }
    
    // 1. Check API Connection
    try {
      const startTime = Date.now()
      const config = await apiClient.get('/config')
      const responseTime = Date.now() - startTime
      
      results.api = {
        status: responseTime < 1000 ? 'success' : 'warning',
        message: `API respondiendo en ${responseTime}ms`,
        details: {
          responseTime,
          configLoaded: !!config,
          endpoint: hardcodedValues?.urls?.apiUrl || 'http://localhost:4002'
        }
      }
    } catch (error) {
      results.api = {
        status: 'error',
        message: 'No se puede conectar con la API',
        details: { error: error.message }
      }
    }
    
    // 2. Check Database
    try {
      const [areas, courses, leads] = await Promise.all([
        apiClient.get('/areas'),
        apiClient.get('/courses'),
        apiClient.get('/leads')
      ])
      
      results.database = {
        status: 'success',
        message: 'Base de datos operativa',
        details: {
          areas: areas.length,
          courses: courses.length,
          leads: leads.length,
          totalRecords: areas.length + courses.length + leads.length
        }
      }
    } catch (error) {
      results.database = {
        status: 'error',
        message: 'Error al acceder a la base de datos',
        details: { error: error.message }
      }
    }
    
    // 3. Check WhatsApp Service
    try {
      const isBusinessHours = whatsappService.isBusinessHours()
      const config = await apiClient.get('/config')
      const whatsappEnabled = config?.whatsapp?.enabled
      
      results.whatsapp = {
        status: whatsappEnabled ? 'success' : 'warning',
        message: whatsappEnabled 
          ? `WhatsApp ${isBusinessHours ? 'en horario laboral' : 'fuera de horario'}`
          : 'WhatsApp deshabilitado',
        details: {
          enabled: whatsappEnabled,
          businessHours: isBusinessHours,
          phoneNumber: config?.whatsapp?.phoneNumber
        }
      }
    } catch (error) {
      results.whatsapp = {
        status: 'error',
        message: 'Error en servicio WhatsApp',
        details: { error: error.message }
      }
    }
    
    // 4. Check Analytics
    try {
      const metrics = await analyticsService.getDashboardMetrics('day')
      
      results.analytics = {
        status: 'success',
        message: 'Analytics funcionando correctamente',
        details: {
          totalLeads: metrics?.overview?.totalLeads || 0,
          conversionRate: metrics?.overview?.conversionRate || 0,
          dataCollected: true
        }
      }
    } catch (error) {
      results.analytics = {
        status: 'warning',
        message: 'Analytics con datos limitados',
        details: { error: error.message }
      }
    }
    
    // 5. Check Storage
    try {
      const testKey = 'system_check_' + Date.now()
      localStorage.setItem(testKey, 'test')
      const value = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)
      
      const usage = await estimateStorageUsage()
      
      results.storage = {
        status: usage.percentage < 80 ? 'success' : 'warning',
        message: `Storage al ${usage.percentage}% de capacidad`,
        details: {
          used: usage.used,
          quota: usage.quota,
          percentage: usage.percentage,
          localStorage: value === 'test'
        }
      }
    } catch (error) {
      results.storage = {
        status: 'error',
        message: 'Error en almacenamiento local',
        details: { error: error.message }
      }
    }
    
    // 6. Check Performance
    try {
      const perfData = getPerformanceMetrics()
      const score = calculatePerformanceScore(perfData)
      
      results.performance = {
        status: score > 70 ? 'success' : score > 40 ? 'warning' : 'error',
        message: `Performance score: ${score}/100`,
        details: perfData
      }
    } catch (error) {
      results.performance = {
        status: 'warning',
        message: 'Métricas de performance no disponibles',
        details: { error: error.message }
      }
    }
    
    setChecks(results)
    generateReport(results)
    setIsRunning(false)
    setLoading(false)
  }

  const estimateStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const percentage = Math.round((estimate.usage / estimate.quota) * 100)
      return {
        used: formatBytes(estimate.usage),
        quota: formatBytes(estimate.quota),
        percentage
      }
    }
    return { used: 'N/A', quota: 'N/A', percentage: 0 }
  }

  const getPerformanceMetrics = () => {
    const perfData = {}
    
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      perfData.pageLoadTime = timing.loadEventEnd - timing.navigationStart
      perfData.domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart
      perfData.firstPaintTime = timing.responseEnd - timing.fetchStart
    }
    
    if (window.performance && window.performance.memory) {
      perfData.memoryUsed = formatBytes(window.performance.memory.usedJSHeapSize)
      perfData.memoryTotal = formatBytes(window.performance.memory.totalJSHeapSize)
      perfData.memoryLimit = formatBytes(window.performance.memory.jsHeapSizeLimit)
    }
    
    return perfData
  }

  const calculatePerformanceScore = (perfData) => {
    let score = 100
    
    // Penalizar por tiempo de carga lento
    if (perfData.pageLoadTime > 3000) score -= 30
    else if (perfData.pageLoadTime > 2000) score -= 15
    else if (perfData.pageLoadTime > 1000) score -= 5
    
    // Penalizar por uso excesivo de memoria
    if (perfData.memoryUsed && perfData.memoryLimit) {
      const memoryUsage = parseFloat(perfData.memoryUsed) / parseFloat(perfData.memoryLimit)
      if (memoryUsage > 0.8) score -= 20
      else if (memoryUsage > 0.6) score -= 10
    }
    
    return Math.max(0, score)
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const generateReport = (results) => {
    const totalChecks = Object.keys(results).length
    const successCount = Object.values(results).filter(r => r.status === 'success').length
    const warningCount = Object.values(results).filter(r => r.status === 'warning').length
    const errorCount = Object.values(results).filter(r => r.status === 'error').length
    
    const healthScore = Math.round((successCount / totalChecks) * 100)
    
    setReport({
      timestamp: new Date().toISOString(),
      healthScore,
      summary: {
        total: totalChecks,
        success: successCount,
        warning: warningCount,
        error: errorCount
      },
      recommendations: generateRecommendations(results),
      details: results
    })
  }

  const generateRecommendations = (results) => {
    const recommendations = []
    
    if (results.api.status === 'error') {
      recommendations.push({
        priority: 'high',
        area: 'API',
        message: `Verificar que el servidor backend esté ejecutándose en ${hardcodedValues?.urls?.apiUrl || 'http://localhost:4002'}`
      })
    }
    
    if (results.api.status === 'warning' && results.api.details?.responseTime > 1000) {
      recommendations.push({
        priority: 'medium',
        area: 'API',
        message: 'El tiempo de respuesta de la API es alto. Considera optimizar las consultas.'
      })
    }
    
    if (results.database.status === 'error') {
      recommendations.push({
        priority: 'high',
        area: 'Database',
        message: 'Verificar la conexión con la base de datos y que db.json esté presente'
      })
    }
    
    if (results.whatsapp.status === 'warning' && !results.whatsapp.details?.enabled) {
      recommendations.push({
        priority: 'low',
        area: 'WhatsApp',
        message: 'Considera habilitar WhatsApp para mejorar la comunicación con clientes'
      })
    }
    
    if (results.storage.details?.percentage > 80) {
      recommendations.push({
        priority: 'medium',
        area: 'Storage',
        message: 'El almacenamiento está cerca del límite. Considera limpiar datos antiguos.'
      })
    }
    
    if (results.performance.details?.pageLoadTime > 3000) {
      recommendations.push({
        priority: 'medium',
        area: 'Performance',
        message: 'El tiempo de carga es alto. Optimiza imágenes y reduce el tamaño del bundle.'
      })
    }
    
    return recommendations
  }

  const exportReport = () => {
    if (!report) return
    
    const fileName = `system-check-${new Date().toISOString().split('T')[0]}.json`
    const dataStr = JSON.stringify(report, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', fileName)
    linkElement.click()
    
    showSuccess('Reporte exportado correctamente')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-400'
      case 'warning':
        return 'text-yellow-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          System Health Check
        </h1>
        <p className="text-text-secondary">
          Verificación completa del sistema y componentes
        </p>
      </div>

      {/* Health Score */}
      {report && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Health Score
              </h2>
              <div className="text-5xl font-bold">
                <span className={
                  report.healthScore >= 80 ? 'text-green-400' :
                  report.healthScore >= 50 ? 'text-yellow-400' :
                  'text-red-400'
                }>
                  {report.healthScore}%
                </span>
              </div>
              <p className="text-text-secondary mt-2">
                {report.summary.success} exitosos, {report.summary.warning} advertencias, {report.summary.error} errores
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={runSystemCheck} disabled={isRunning}>
                {isRunning ? 'Verificando...' : 'Ejecutar Verificación'}
              </Button>
              <Button variant="secondary" onClick={exportReport}>
                Exportar Reporte
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* System Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(checks).map(([key, check]) => (
          <Card key={key} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{getStatusIcon(check.status)}</span>
                  <h3 className="text-lg font-semibold text-text-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                </div>
                <p className={`text-sm ${getStatusColor(check.status)}`}>
                  {check.message}
                </p>
                {check.details && (
                  <div className="mt-2 text-xs text-text-secondary">
                    {Object.entries(check.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-mono">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      {report?.recommendations?.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Recomendaciones
          </h2>
          <div className="space-y-3">
            {report.recommendations.map((rec, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border ${
                  rec.priority === 'high' ? 'bg-red-500/10 border-red-500/30' :
                  rec.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <span className={`text-sm font-semibold ${
                    rec.priority === 'high' ? 'text-red-400' :
                    rec.priority === 'medium' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    [{rec.area}]
                  </span>
                  <p className="text-sm text-text-primary">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Recargar Aplicación
          </Button>
          <Button 
            variant="secondary"
            onClick={() => localStorage.clear()}
          >
            Limpiar Cache
          </Button>
          <Button 
            variant="secondary"
            onClick={() => console.log('System Info:', report)}
          >
            Ver en Consola
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default SystemCheck