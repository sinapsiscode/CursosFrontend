import React, { useState, useEffect } from 'react'
import { useUIStore } from '../../store'
import { Button, Input } from '../../components/ui'
import apiClient from '../../api/client'

const ConfigManager = () => {
  const { showSuccess, showError } = useUIStore()
  
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'branding', name: 'Marca', icon: '🎨' },
    { id: 'loyalty', name: 'Loyalty/Puntos', icon: '🏆' },
    { id: 'payments', name: 'Pagos', icon: '💳' },
    { id: 'notifications', name: 'Notificaciones', icon: '📧' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
    { id: 'integrations', name: 'Integraciones', icon: '🔗' },
    { id: 'security', name: 'Seguridad', icon: '🔒' },
    { id: 'features', name: 'Features', icon: '🚀' }
  ]

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const configData = await apiClient.get('/config')
      setConfig(configData)
    } catch (error) {
      console.error('Error loading config:', error)
      showError('Error al cargar la configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleConfigChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleNestedConfigChange = (section, subsection, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }))
    setHasChanges(true)
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    try {
      await apiClient.put('/api/config', config)
      setHasChanges(false)
      showSuccess('Configuración guardada correctamente')
    } catch (error) {
      console.error('Error saving config:', error)
      showError('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const renderGeneralConfig = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Nombre del sitio"
          value={config.general.siteName}
          onChange={(e) => handleConfigChange('general', 'siteName', e.target.value)}
          placeholder="MetSel Academy"
        />
        <Input
          label="Email de soporte"
          type="email"
          value={config.general.supportEmail}
          onChange={(e) => handleConfigChange('general', 'supportEmail', e.target.value)}
          placeholder="soporte@metsel.edu"
        />
      </div>

      <Input
        label="Descripción del sitio"
        value={config.general.siteDescription}
        onChange={(e) => handleConfigChange('general', 'siteDescription', e.target.value)}
        placeholder="Academia especializada en Metalurgia, Minería y Geología"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Teléfono de contacto"
          value={config.general.contactPhone}
          onChange={(e) => handleConfigChange('general', 'contactPhone', e.target.value)}
          placeholder="+57 300 123 4567"
        />
        <Input
          label="Máximo cursos por usuario"
          type="number"
          value={config.general.maxCoursesPerUser}
          onChange={(e) => handleConfigChange('general', 'maxCoursesPerUser', parseInt(e.target.value))}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={config.general.maintenanceMode}
            onChange={(e) => handleConfigChange('general', 'maintenanceMode', e.target.checked)}
            className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
          />
          <label htmlFor="maintenanceMode" className="text-sm text-text-primary">
            Modo mantenimiento
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="registrationEnabled"
            checked={config.general.registrationEnabled}
            onChange={(e) => handleConfigChange('general', 'registrationEnabled', e.target.checked)}
            className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
          />
          <label htmlFor="registrationEnabled" className="text-sm text-text-primary">
            Registro habilitado
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="guestModeEnabled"
            checked={config.general.guestModeEnabled}
            onChange={(e) => handleConfigChange('general', 'guestModeEnabled', e.target.checked)}
            className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
          />
          <label htmlFor="guestModeEnabled" className="text-sm text-text-primary">
            Modo invitado habilitado
          </label>
        </div>
      </div>
    </div>
  )

  const renderBrandingConfig = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Color Primario</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={config.branding.primaryColor}
              onChange={(e) => handleConfigChange('branding', 'primaryColor', e.target.value)}
              className="w-12 h-10 rounded border border-gray-600"
            />
            <Input
              value={config.branding.primaryColor}
              onChange={(e) => handleConfigChange('branding', 'primaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Color Secundario</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={config.branding.secondaryColor}
              onChange={(e) => handleConfigChange('branding', 'secondaryColor', e.target.value)}
              className="w-12 h-10 rounded border border-gray-600"
            />
            <Input
              value={config.branding.secondaryColor}
              onChange={(e) => handleConfigChange('branding', 'secondaryColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Color de Acento</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={config.branding.accentColor}
              onChange={(e) => handleConfigChange('branding', 'accentColor', e.target.value)}
              className="w-12 h-10 rounded border border-gray-600"
            />
            <Input
              value={config.branding.accentColor}
              onChange={(e) => handleConfigChange('branding', 'accentColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="URL del Logo"
          value={config.branding.logoUrl}
          onChange={(e) => handleConfigChange('branding', 'logoUrl', e.target.value)}
          placeholder="/logo.png"
        />
        <Input
          label="URL del Favicon"
          value={config.branding.faviconUrl}
          onChange={(e) => handleConfigChange('branding', 'faviconUrl', e.target.value)}
          placeholder="/favicon.ico"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-text-primary">Redes Sociales</h4>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(config.branding.socialMediaLinks).map(([platform, url]) => (
            <Input
              key={platform}
              label={platform.charAt(0).toUpperCase() + platform.slice(1)}
              value={url}
              onChange={(e) => handleNestedConfigChange('branding', 'socialMediaLinks', platform, e.target.value)}
              placeholder={`https://${platform}.com/metselacademy`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  const renderLoyaltyConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="checkbox"
          id="loyaltyEnabled"
          checked={config.loyalty.enabled}
          onChange={(e) => handleConfigChange('loyalty', 'enabled', e.target.checked)}
          className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
        />
        <label htmlFor="loyaltyEnabled" className="text-lg font-medium text-text-primary">
          Programa de Loyalty Habilitado
        </label>
      </div>

      {config.loyalty.enabled && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Puntos por curso completado"
              type="number"
              value={config.loyalty.pointsPerCourse}
              onChange={(e) => handleConfigChange('loyalty', 'pointsPerCourse', parseInt(e.target.value))}
            />
            <Input
              label="Puntos por certificado"
              type="number"
              value={config.loyalty.pointsPerCertificate}
              onChange={(e) => handleConfigChange('loyalty', 'pointsPerCertificate', parseInt(e.target.value))}
            />
            <Input
              label="Puntos por review"
              type="number"
              value={config.loyalty.pointsPerReview}
              onChange={(e) => handleConfigChange('loyalty', 'pointsPerReview', parseInt(e.target.value))}
            />
            <Input
              label="Puntos por referido"
              type="number"
              value={config.loyalty.pointsPerReferral}
              onChange={(e) => handleConfigChange('loyalty', 'pointsPerReferral', parseInt(e.target.value))}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Niveles de Loyalty</h4>
            {Object.entries(config.loyalty.levels).map(([levelKey, level]) => (
              <div key={levelKey} className="bg-background rounded-lg p-4 border border-gray-600">
                <h5 className="font-medium text-text-primary mb-3 flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: level.color }}
                  ></div>
                  {level.name}
                </h5>
                <div className="grid md:grid-cols-4 gap-4">
                  <Input
                    label="Puntos mínimos"
                    type="number"
                    value={level.minPoints}
                    onChange={(e) => handleNestedConfigChange('loyalty', 'levels', levelKey, {
                      ...level,
                      minPoints: parseInt(e.target.value)
                    })}
                  />
                  <Input
                    label="Puntos máximos"
                    type="number"
                    value={level.maxPoints}
                    onChange={(e) => handleNestedConfigChange('loyalty', 'levels', levelKey, {
                      ...level,
                      maxPoints: parseInt(e.target.value)
                    })}
                  />
                  <Input
                    label="% Descuento"
                    type="number"
                    value={level.discountPercentage}
                    onChange={(e) => handleNestedConfigChange('loyalty', 'levels', levelKey, {
                      ...level,
                      discountPercentage: parseInt(e.target.value)
                    })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Color</label>
                    <input
                      type="color"
                      value={level.color}
                      onChange={(e) => handleNestedConfigChange('loyalty', 'levels', levelKey, {
                        ...level,
                        color: e.target.value
                      })}
                      className="w-full h-10 rounded border border-gray-600"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )

  const renderWhatsAppConfig = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <input
          type="checkbox"
          id="whatsappEnabled"
          checked={config.whatsapp.enabled}
          onChange={(e) => handleConfigChange('whatsapp', 'enabled', e.target.checked)}
          className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
        />
        <label htmlFor="whatsappEnabled" className="text-lg font-medium text-text-primary">
          WhatsApp Habilitado
        </label>
      </div>

      {config.whatsapp.enabled && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Número de WhatsApp"
              value={config.whatsapp.phoneNumber}
              onChange={(e) => handleConfigChange('whatsapp', 'phoneNumber', e.target.value)}
              placeholder="+57 300 123 4567"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoSend"
                checked={config.whatsapp.autoSend}
                onChange={(e) => handleConfigChange('whatsapp', 'autoSend', e.target.checked)}
                className="rounded border-gray-600 bg-surface text-accent focus:ring-accent"
              />
              <label htmlFor="autoSend" className="text-sm text-text-primary">
                Envío automático habilitado
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Mensaje de bienvenida
            </label>
            <textarea
              value={config.whatsapp.welcomeMessage}
              onChange={(e) => handleConfigChange('whatsapp', 'welcomeMessage', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              rows={3}
              placeholder="¡Hola! 👋 Gracias por tu interés..."
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Templates de Mensajes</h4>
            {Object.entries(config.whatsapp.templates).map(([templateKey, template]) => (
              <div key={templateKey}>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {templateKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <textarea
                  value={template}
                  onChange={(e) => handleNestedConfigChange('whatsapp', 'templates', templateKey, e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={4}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )

  const renderTabContent = () => {
    if (!config) return null

    switch (activeTab) {
      case 'general': return renderGeneralConfig()
      case 'branding': return renderBrandingConfig()
      case 'loyalty': return renderLoyaltyConfig()
      case 'whatsapp': return renderWhatsAppConfig()
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Sección en desarrollo
            </h3>
            <p className="text-text-secondary">
              Esta configuración estará disponible pronto
            </p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Configuración del Sistema
          </h1>
          <p className="text-text-secondary">
            Personaliza todos los aspectos de tu plataforma
          </p>
        </div>

        {hasChanges && (
          <Button 
            onClick={handleSaveConfig}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        )}
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 mr-8">
          <div className="bg-surface rounded-lg border border-gray-700 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-700 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-black'
                    : 'text-text-primary hover:bg-gray-800'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-surface rounded-lg border border-gray-700 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigManager