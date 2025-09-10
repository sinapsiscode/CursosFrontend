import { useState, useEffect } from 'react'
import { useUIStore } from '../../store'
import { whatsappService } from '../../services/whatsappService'
import { notificationService } from '../../services/notificationService'

const WhatsAppManagement = () => {
  const { showToast } = useUIStore()
  
  // Estado para configuraciones
  const [whatsappConfig, setWhatsappConfig] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('controls') // controls, triggers, templates, stats

  // Cargar configuraciones al montar
  useEffect(() => {
    loadConfigurations()
  }, [])

  const loadConfigurations = () => {
    try {
      // Cargar configuración de WhatsApp
      const config = whatsappService.getStoredConfig()
      setWhatsappConfig(config)

      // Cargar estado de notificaciones (simular config global)
      const notifConfig = localStorage.getItem('notifications_global_config')
      if (notifConfig) {
        const parsed = JSON.parse(notifConfig)
        setNotificationsEnabled(parsed.enabled !== false)
      }
    } catch (error) {
      console.error('Error loading configurations:', error)
      showToast('Error al cargar configuraciones', 'error')
    }
  }

  // Actualizar configuración de WhatsApp
  const updateWhatsAppConfig = async (updates) => {
    setSaving(true)
    try {
      const newConfig = { ...whatsappConfig, ...updates }
      whatsappService.updateConfig(newConfig)
      setWhatsappConfig(newConfig)
      showToast('Configuración de WhatsApp actualizada', 'success')
    } catch (error) {
      console.error('Error updating WhatsApp config:', error)
      showToast('Error al actualizar configuración', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Actualizar configuración global de notificaciones
  const updateNotificationsConfig = async (enabled) => {
    setSaving(true)
    try {
      const config = { enabled, updatedAt: new Date().toISOString() }
      localStorage.setItem('notifications_global_config', JSON.stringify(config))
      setNotificationsEnabled(enabled)
      showToast(`Notificaciones ${enabled ? 'activadas' : 'desactivadas'} globalmente`, 'success')
    } catch (error) {
      console.error('Error updating notifications config:', error)
      showToast('Error al actualizar notificaciones', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Probar mensaje de WhatsApp
  const testWhatsAppMessage = async (type) => {
    setSaving(true)
    try {
      await whatsappService.testMessage(type)
      showToast('Mensaje de prueba enviado', 'success')
    } catch (error) {
      console.error('Error testing message:', error)
      showToast('Error al enviar mensaje de prueba', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!whatsappConfig) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Cargando configuraciones...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Gestión de WhatsApp y Notificaciones</h2>
        <p className="text-gray-400">
          Controla el sistema de WhatsApp automático y notificaciones desde aquí
        </p>
      </div>

      {/* Navegación de secciones */}
      <div className="bg-surface rounded-xl p-4">
        <div className="flex space-x-1">
          {[
            { id: 'controls', label: 'Controles', icon: '🎛️' },
            { id: 'enrollment', label: 'Inscripciones', icon: '🎓' },
            { id: 'triggers', label: 'Eventos', icon: '⚡' },
            { id: 'templates', label: 'Mensajes', icon: '💬' },
            { id: 'stats', label: 'Estadísticas', icon: '📊' }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-accent text-background'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sección: Controles Principales */}
      {activeSection === 'controls' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Control WhatsApp */}
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📱</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">WhatsApp Automático</h3>
                  <p className="text-sm text-gray-400">Sistema de lead generation</p>
                </div>
              </div>
              <button
                onClick={() => updateWhatsAppConfig({ autoSend: !whatsappConfig.autoSend })}
                disabled={saving}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  whatsappConfig.autoSend ? 'bg-green-600' : 'bg-gray-600'
                } ${saving ? 'opacity-50' : ''}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    whatsappConfig.autoSend ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`font-medium ${whatsappConfig.autoSend ? 'text-green-400' : 'text-red-400'}`}>
                  {whatsappConfig.autoSend ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mensajes enviados:</span>
                <span className="text-white">{whatsappConfig.statistics?.totalSent || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Número:</span>
                <span className="text-white font-mono text-xs">{whatsappConfig.phoneNumber}</span>
              </div>
            </div>

            {whatsappConfig.autoSend && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => testWhatsAppMessage('welcome')}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Enviando...' : 'Probar Mensaje'}
                </button>
              </div>
            )}
          </div>

          {/* Control Notificaciones */}
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🔔</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
                  <p className="text-sm text-gray-400">Sistema global de notificaciones</p>
                </div>
              </div>
              <button
                onClick={() => updateNotificationsConfig(!notificationsEnabled)}
                disabled={saving}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-blue-600' : 'bg-gray-600'
                } ${saving ? 'opacity-50' : ''}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`font-medium ${notificationsEnabled ? 'text-blue-400' : 'text-red-400'}`}>
                  {notificationsEnabled ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Notificaciones activas:</span>
                <span className="text-white">{notificationService.getActiveNotifications().length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sin leer:</span>
                <span className="text-white">{notificationService.getUnreadCount()}</span>
              </div>
            </div>

            {notificationsEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    notificationService.createNotification({
                      type: 'info',
                      title: 'Prueba de Notificación',
                      message: 'Esta es una notificación de prueba desde el admin',
                      icon: '🧪'
                    })
                    showToast('Notificación de prueba creada', 'success')
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Probar Notificación
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sección: Configuración de Inscripciones */}
      {activeSection === 'enrollment' && (
        <div className="space-y-6">
          {/* Configuración de WhatsApp para inscripciones */}
          <div className="bg-surface rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl">🎓</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">WhatsApp para Inscripciones</h3>
                <p className="text-gray-400">Configura el número de WhatsApp donde se enviarán las solicitudes de inscripción</p>
              </div>
            </div>

            {/* Configuración del número principal */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número de WhatsApp para Inscripciones
                  </label>
                  <input
                    type="text"
                    value={whatsappConfig.phoneNumber || ''}
                    onChange={(e) => updateWhatsAppConfig({ phoneNumber: e.target.value })}
                    placeholder="+57 300 123 4567"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: +código país + número (ej: +57 300 123 4567)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mensaje de bienvenida para inscripciones
                  </label>
                  <textarea
                    value={whatsappConfig.welcomeMessage || ''}
                    onChange={(e) => updateWhatsAppConfig({ welcomeMessage: e.target.value })}
                    placeholder="¡Hola! 👋 Gracias por tu interés en nuestros cursos..."
                    rows="4"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Vista previa y pruebas */}
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-3">Vista Previa del Proceso</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">1.</span>
                      <span className="text-gray-300">Estudiante hace clic en "Adquirir curso completo"</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">2.</span>
                      <span className="text-gray-300">Se inscribe automáticamente en el curso</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">3.</span>
                      <span className="text-gray-300">Se redirige a WhatsApp con información del curso</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-400">4.</span>
                      <span className="text-gray-300">Administrador recibe solicitud completa</span>
                    </div>
                  </div>
                </div>

                {/* Botones de prueba */}
                <div className="space-y-3">
                  <button
                    onClick={() => testWhatsAppMessage('courseInterest')}
                    disabled={saving}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {saving ? 'Probando...' : '🧪 Probar Mensaje de Inscripción'}
                  </button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Esto abrirá WhatsApp con un mensaje de prueba usando el número configurado
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas de inscripciones */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="font-medium text-white mb-3">Estadísticas de Inscripciones</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {whatsappConfig.statistics?.courseViewTriggers || 0}
                  </div>
                  <div className="text-sm text-gray-400">Solicitudes enviadas</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {whatsappConfig.statistics?.totalSent || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total mensajes</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(((whatsappConfig.statistics?.courseViewTriggers || 0) / Math.max(whatsappConfig.statistics?.totalSent || 1, 1)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-400">Tasa de conversión</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sección: Configuración de Eventos/Triggers */}
      {activeSection === 'triggers' && (
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Configuración de Eventos WhatsApp</h3>
          <div className="space-y-4">
            {Object.entries(whatsappConfig.triggers || {}).map(([trigger, config]) => (
              <div key={trigger} className="flex items-center justify-between p-4 bg-background rounded-lg">
                <div>
                  <h4 className="font-medium text-white capitalize">
                    {trigger.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h4>
                  <p className="text-sm text-gray-400">Delay: {config.delay}ms</p>
                </div>
                <button
                  onClick={() => {
                    const newTriggers = {
                      ...whatsappConfig.triggers,
                      [trigger]: { ...config, enabled: !config.enabled }
                    }
                    updateWhatsAppConfig({ triggers: newTriggers })
                  }}
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    config.enabled ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      config.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección: Templates de Mensajes */}
      {activeSection === 'templates' && (
        <div className="bg-surface rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Templates de Mensajes</h3>
          <div className="space-y-4">
            {Object.entries(whatsappConfig.templates || {}).map(([template, message]) => (
              <div key={template} className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 capitalize">
                  {template.replace(/([A-Z])/g, ' $1')}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => {
                    const newTemplates = {
                      ...whatsappConfig.templates,
                      [template]: e.target.value
                    }
                    updateWhatsAppConfig({ templates: newTemplates })
                  }}
                  rows={3}
                  className="w-full px-3 py-2 bg-background border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            ))}
            
            <button
              onClick={() => updateWhatsAppConfig(whatsappConfig)}
              disabled={saving}
              className="bg-accent text-background px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Templates'}
            </button>
          </div>
        </div>
      )}

      {/* Sección: Estadísticas */}
      {activeSection === 'stats' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Estadísticas WhatsApp</h3>
            <div className="space-y-3">
              {Object.entries(whatsappConfig.statistics || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}:
                  </span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Estadísticas Notificaciones</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total activas:</span>
                <span className="text-white font-medium">{notificationService.getActiveNotifications().length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sin leer:</span>
                <span className="text-white font-medium">{notificationService.getUnreadCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estado global:</span>
                <span className={`font-medium ${notificationsEnabled ? 'text-green-400' : 'text-red-400'}`}>
                  {notificationsEnabled ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WhatsAppManagement
