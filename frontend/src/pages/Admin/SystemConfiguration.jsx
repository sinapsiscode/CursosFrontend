import { useState, useEffect } from 'react'
import systemConfigService from '../../services/systemConfigService'
import Swal from 'sweetalert2'

export default function SystemConfiguration() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('loyalty')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      setLoading(true)
      const data = await systemConfigService.getConfig(true) // force refresh
      setConfig(data)
    } catch (error) {
      console.error('Error cargando configuración:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la configuración del sistema'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await systemConfigService.updateConfig(config)

      Swal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'Configuración actualizada correctamente',
        timer: 2000,
        showConfirmButton: false
      })

      // Recargar para asegurar sincronización
      await loadConfig()
    } catch (error) {
      console.error('Error guardando configuración:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la configuración'
      })
    } finally {
      setSaving(false)
    }
  }

  const updateLoyaltyField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      loyalty: {
        ...prev.loyalty,
        [field]: value
      }
    }))
  }

  const updateExamField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      exams: {
        ...prev.exams,
        [field]: value
      }
    }))
  }

  const updateLevel = (index, field, value) => {
    setConfig(prev => {
      const newLevels = [...prev.loyalty.levels]
      newLevels[index] = {
        ...newLevels[index],
        [field]: value
      }
      return {
        ...prev,
        loyalty: {
          ...prev.loyalty,
          levels: newLevels
        }
      }
    })
  }

  const updateRange = (index, field, value) => {
    setConfig(prev => {
      const newRanges = [...prev.exams.ranges]
      newRanges[index] = {
        ...newRanges[index],
        [field]: value
      }
      return {
        ...prev,
        exams: {
          ...prev.exams,
          ranges: newRanges
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">⚠️ Error al cargar configuración</p>
          <button
            onClick={loadConfig}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">⚙️ Configuración del Sistema</h1>
            <p className="text-gray-400">Administra las reglas de negocio de la plataforma</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-4 py-2 ${activeTab === 'loyalty' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
          >
            💎 Fidelización
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 ${activeTab === 'exams' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
          >
            📝 Exámenes
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
          >
            🔧 General
          </button>
        </div>

        {/* Loyalty Tab */}
        {activeTab === 'loyalty' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Configuración de Puntos</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Puntos por curso completado</label>
                  <input
                    type="number"
                    value={config.loyalty.pointsPerCourse}
                    onChange={(e) => updateLoyaltyField('pointsPerCourse', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bonus primer curso</label>
                  <input
                    type="number"
                    value={config.loyalty.firstCourseBonus}
                    onChange={(e) => updateLoyaltyField('firstCourseBonus', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Niveles de Fidelización</h2>

              <div className="space-y-4">
                {config.loyalty.levels.map((level, index) => (
                  <div key={level.key} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{level.icon} {level.name}</h3>
                      <span className="text-sm text-gray-400">Key: {level.key}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Puntos Min</label>
                        <input
                          type="number"
                          value={level.minPoints}
                          onChange={(e) => updateLevel(index, 'minPoints', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Puntos Max</label>
                        <input
                          type="number"
                          value={level.maxPoints || ''}
                          onChange={(e) => updateLevel(index, 'maxPoints', e.target.value === '' ? null : parseInt(e.target.value))}
                          placeholder="Sin límite"
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Descuento (%)</label>
                        <input
                          type="number"
                          value={level.discountPercentage}
                          onChange={(e) => updateLevel(index, 'discountPercentage', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Color</label>
                        <input
                          type="text"
                          value={level.color}
                          onChange={(e) => updateLevel(index, 'color', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Configuración de Exámenes</h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Puntuación Máxima</label>
                  <input
                    type="number"
                    value={config.exams.maxScore}
                    onChange={(e) => updateExamField('maxScore', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Puntuación Mínima (Aprobar)</label>
                  <input
                    type="number"
                    value={config.exams.passingScore}
                    onChange={(e) => updateExamField('passingScore', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tiempo Límite (min)</label>
                  <input
                    type="number"
                    value={config.exams.timeLimit}
                    onChange={(e) => updateExamField('timeLimit', parseInt(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Rangos de Calificación</h2>

              <div className="space-y-4">
                {config.exams.ranges.map((range, index) => (
                  <div key={range.key} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold capitalize">{range.key}</h3>
                      <span className={`px-3 py-1 rounded text-sm bg-${range.color}-600`}>
                        {range.message}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Puntuación Min</label>
                        <input
                          type="number"
                          value={range.min}
                          onChange={(e) => updateRange(index, 'min', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Puntuación Max</label>
                        <input
                          type="number"
                          value={range.max}
                          onChange={(e) => updateRange(index, 'max', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Descuento (%)</label>
                        <input
                          type="number"
                          value={range.discount}
                          onChange={(e) => updateRange(index, 'discount', parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Mensaje</label>
                        <input
                          type="text"
                          value={range.message}
                          onChange={(e) => updateRange(index, 'message', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-600 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Configuración General</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nombre del Sitio</label>
                  <input
                    type="text"
                    value={config.general.siteName}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      general: { ...prev.general, siteName: e.target.value }
                    }))}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Puntos por defecto para nuevos cursos</label>
                  <input
                    type="number"
                    value={config.general.defaultCoursePoints}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      general: { ...prev.general, defaultCoursePoints: parseInt(e.target.value) }
                    }))}
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.general.maintenanceMode}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        general: { ...prev.general, maintenanceMode: e.target.checked }
                      }))}
                      className="w-5 h-5"
                    />
                    <span>Modo Mantenimiento</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.general.allowRegistrations}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        general: { ...prev.general, allowRegistrations: e.target.checked }
                      }))}
                      className="w-5 h-5"
                    />
                    <span>Permitir Registros</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.general.allowGuestAccess}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        general: { ...prev.general, allowGuestAccess: e.target.checked }
                      }))}
                      className="w-5 h-5"
                    />
                    <span>Permitir Acceso de Invitados</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">📊 Metadata</h2>
              <div className="text-sm text-gray-400 space-y-2">
                <p><strong>Última actualización:</strong> {new Date(config.updatedAt).toLocaleString('es-ES')}</p>
                <p><strong>Actualizado por:</strong> Usuario ID {config.updatedBy}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
