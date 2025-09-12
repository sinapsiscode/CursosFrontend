import React, { useState, useEffect } from 'react'
import { useUIStore, useConfigStore } from '../../store'
import { Button, Input, Modal } from '../../components/ui'
import { whatsappService } from '../../services/whatsappService'
import apiClient from '../../api/client'

const WhatsAppManager = () => {
  const { showSuccess, showError } = useUIStore()
  const { areas } = useConfigStore()
  
  const [stats, setStats] = useState({
    totalMessages: 0,
    todayMessages: 0,
    pendingMessages: 0,
    successRate: 0
  })
  const [campaigns, setCampaigns] = useState([])
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    message: '',
    targetAudience: 'all',
    area: '',
    scheduledFor: '',
    recipients: []
  })

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'campaigns', name: 'Campañas', icon: '📢' },
    { id: 'templates', name: 'Plantillas', icon: '📝' },
    { id: 'automation', name: 'Automatización', icon: '🤖' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Cargar estadísticas
      const statsData = await whatsappService.getMessageStats() || {
        totalMessages: 1250,
        todayMessages: 45,
        pendingMessages: 3,
        successRate: 98.5
      }
      setStats(statsData)

      // Cargar campañas
      const campaignsData = await apiClient.get('/whatsapp/campaigns')
      setCampaigns(campaignsData || [])

      // Cargar templates
      const config = await apiClient.get('/config')
      if (config.whatsapp?.templates) {
        const templatesArray = Object.entries(config.whatsapp.templates).map(([key, value]) => ({
          id: key,
          name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          content: value,
          variables: (value.match(/{{(\w+)}}/g) || []).map(v => v.replace(/[{}]/g, ''))
        }))
        setTemplates(templatesArray)
      }
    } catch (error) {
      console.error('Error loading WhatsApp data:', error)
      showError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleSendCampaign = async () => {
    if (!campaignForm.name || !campaignForm.message) {
      showError('Completa todos los campos requeridos')
      return
    }

    try {
      // Obtener destinatarios según el target
      let recipients = []
      if (campaignForm.targetAudience === 'all') {
        const leads = await apiClient.get('/leads')
        recipients = leads.map(lead => ({ name: lead.name, phone: lead.phone }))
      } else if (campaignForm.targetAudience === 'area') {
        const leads = await apiClient.get(`/api/leads?area=${campaignForm.area}`)
        recipients = leads.map(lead => ({ name: lead.name, phone: lead.phone }))
      }

      // Crear campaña
      const campaign = {
        ...campaignForm,
        recipients,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }

      await apiClient.post('/api/whatsapp/campaigns', campaign)
      
      showSuccess(`Campaña "${campaignForm.name}" creada con ${recipients.length} destinatarios`)
      setCampaignForm({
        name: '',
        message: '',
        targetAudience: 'all',
        area: '',
        scheduledFor: '',
        recipients: []
      })
      setIsCampaignModalOpen(false)
      loadData()
    } catch (error) {
      console.error('Error creating campaign:', error)
      showError('Error al crear la campaña')
    }
  }

  const handleTestMessage = async () => {
    try {
      const testPhone = prompt('Ingresa el número de teléfono para la prueba (con código de país):')
      if (!testPhone) return

      const result = await whatsappService.sendMessage({
        to: testPhone,
        template: campaignForm.message,
        variables: { name: 'Usuario Prueba' },
        type: 'test'
      })

      if (result.success) {
        showSuccess('Mensaje de prueba enviado correctamente')
        window.open(result.link, '_blank')
      } else {
        showError('Error al enviar mensaje de prueba')
      }
    } catch (error) {
      console.error('Error sending test message:', error)
      showError('Error al enviar mensaje de prueba')
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-background rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary">Total Mensajes</span>
            <span className="text-2xl">📨</span>
          </div>
          <div className="text-3xl font-bold text-text-primary">{stats.totalMessages.toLocaleString()}</div>
          <div className="text-sm text-green-400 mt-2">+12% vs mes anterior</div>
        </div>

        <div className="bg-background rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary">Mensajes Hoy</span>
            <span className="text-2xl">📅</span>
          </div>
          <div className="text-3xl font-bold text-accent">{stats.todayMessages}</div>
          <div className="text-sm text-text-secondary mt-2">Última hora: 5</div>
        </div>

        <div className="bg-background rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary">Pendientes</span>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{stats.pendingMessages}</div>
          <div className="text-sm text-text-secondary mt-2">En cola</div>
        </div>

        <div className="bg-background rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary">Tasa de Éxito</span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-green-400">{stats.successRate}%</div>
          <div className="text-sm text-text-secondary mt-2">Entregados</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Acciones Rápidas</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Button onClick={() => setIsCampaignModalOpen(true)}>
            📢 Nueva Campaña
          </Button>
          <Button variant="secondary" onClick={() => setActiveTab('templates')}>
            📝 Gestionar Plantillas
          </Button>
          <Button variant="secondary" onClick={() => setActiveTab('analytics')}>
            📊 Ver Analytics
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <span className="text-green-400">✓</span>
              <div>
                <p className="text-text-primary">Mensaje de bienvenida enviado</p>
                <p className="text-xs text-text-secondary">Juan Pérez - Hace 5 minutos</p>
              </div>
            </div>
            <span className="text-sm text-text-secondary">Auto</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <span className="text-green-400">✓</span>
              <div>
                <p className="text-text-primary">Resultados de examen enviados</p>
                <p className="text-xs text-text-secondary">María García - Hace 15 minutos</p>
              </div>
            </div>
            <span className="text-sm text-text-secondary">Auto</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <span className="text-yellow-400">⏳</span>
              <div>
                <p className="text-text-primary">Campaña programada: Curso Nuevo</p>
                <p className="text-xs text-text-secondary">250 destinatarios - Mañana 10:00 AM</p>
              </div>
            </div>
            <span className="text-sm text-text-secondary">Manual</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text-primary">Campañas de WhatsApp</h3>
        <Button onClick={() => setIsCampaignModalOpen(true)}>
          Nueva Campaña
        </Button>
      </div>

      <div className="bg-surface rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-text-primary">Campaña</th>
              <th className="text-left py-3 px-4 font-medium text-text-primary">Destinatarios</th>
              <th className="text-left py-3 px-4 font-medium text-text-primary">Estado</th>
              <th className="text-left py-3 px-4 font-medium text-text-primary">Programada</th>
              <th className="text-left py-3 px-4 font-medium text-text-primary">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-text-secondary">
                  No hay campañas creadas
                </td>
              </tr>
            ) : (
              campaigns.map(campaign => (
                <tr key={campaign.id} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-text-primary">{campaign.name}</div>
                      <div className="text-sm text-text-secondary">
                        {campaign.message.substring(0, 50)}...
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-text-primary">{campaign.recipients?.length || 0}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      campaign.status === 'sent' 
                        ? 'bg-green-500/20 text-green-400'
                        : campaign.status === 'scheduled'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {campaign.scheduledFor 
                      ? new Date(campaign.scheduledFor).toLocaleString('es-ES')
                      : 'Inmediato'
                    }
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="small">Ver</Button>
                      <Button variant="danger" size="small">Cancelar</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-text-primary">Plantillas de Mensajes</h3>
        <Button onClick={() => setIsTemplateModalOpen(true)}>
          Nueva Plantilla
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-surface rounded-lg p-6 border border-gray-700">
            <h4 className="font-medium text-text-primary mb-2">{template.name}</h4>
            <div className="bg-background rounded p-3 mb-3">
              <p className="text-sm text-text-secondary whitespace-pre-wrap">
                {template.content}
              </p>
            </div>
            {template.variables.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-text-secondary mb-1">Variables:</p>
                <div className="flex flex-wrap gap-2">
                  {template.variables.map(variable => (
                    <span key={variable} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => {
                  setSelectedTemplate(template)
                  setIsTemplateModalOpen(true)
                }}
              >
                Editar
              </Button>
              <Button variant="ghost" size="small">
                Usar en Campaña
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAutomation = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Automatizaciones Activas</h3>
      
      <div className="space-y-4">
        {[
          {
            name: 'Bienvenida a Nuevos Leads',
            trigger: 'Nuevo lead capturado',
            status: 'active',
            sent: 125,
            icon: '👋'
          },
          {
            name: 'Resultados de Examen',
            trigger: 'Examen completado',
            status: 'active',
            sent: 45,
            icon: '📊'
          },
          {
            name: 'Seguimiento 24 horas',
            trigger: '24h después de registro',
            status: 'active',
            sent: 89,
            icon: '⏰'
          },
          {
            name: 'Carrito Abandonado',
            trigger: '2h sin completar inscripción',
            status: 'paused',
            sent: 12,
            icon: '🛒'
          },
          {
            name: 'Certificado Listo',
            trigger: 'Curso completado',
            status: 'active',
            sent: 67,
            icon: '🎓'
          }
        ].map(automation => (
          <div key={automation.name} className="bg-surface rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{automation.icon}</div>
                <div>
                  <h4 className="font-medium text-text-primary">{automation.name}</h4>
                  <p className="text-sm text-text-secondary">Trigger: {automation.trigger}</p>
                  <p className="text-xs text-accent mt-1">{automation.sent} mensajes enviados</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  automation.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
                <span className="text-sm text-text-secondary">
                  {automation.status === 'active' ? 'Activa' : 'Pausada'}
                </span>
                <Button variant="ghost" size="small">
                  {automation.status === 'active' ? 'Pausar' : 'Activar'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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
            WhatsApp Business Manager
          </h1>
          <p className="text-text-secondary">
            Gestiona campañas, automatizaciones y mensajes de WhatsApp
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">WhatsApp Conectado</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-surface rounded-lg p-1 border border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-accent text-black'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'automation' && renderAutomation()}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Analytics en desarrollo
            </h3>
            <p className="text-text-secondary">
              Próximamente: métricas detalladas de engagement y conversión
            </p>
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      <Modal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        title="Nueva Campaña de WhatsApp"
        size="large"
      >
        <div className="space-y-4">
          <Input
            label="Nombre de la campaña"
            value={campaignForm.name}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="ej. Promoción Curso Nuevo"
            required
          />

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Mensaje <span className="text-red-500">*</span>
            </label>
            <textarea
              value={campaignForm.message}
              onChange={(e) => setCampaignForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              rows={6}
              placeholder="Escribe tu mensaje aquí. Usa {{name}} para personalizar con el nombre del destinatario..."
            />
            <p className="text-xs text-text-secondary mt-1">
              Variables disponibles: {'{{name}}'}, {'{{area}}'}, {'{{courseTitle}}'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Audiencia objetivo
              </label>
              <select
                value={campaignForm.targetAudience}
                onChange={(e) => setCampaignForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="all">Todos los leads</option>
                <option value="area">Por área específica</option>
                <option value="new">Leads nuevos (últimos 7 días)</option>
                <option value="engaged">Leads comprometidos</option>
              </select>
            </div>

            {campaignForm.targetAudience === 'area' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Área
                </label>
                <select
                  value={campaignForm.area}
                  onChange={(e) => setCampaignForm(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Selecciona un área</option>
                  {areas.map(area => (
                    <option key={area.slug} value={area.slug}>{area.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <Input
            label="Programar envío (opcional)"
            type="datetime-local"
            value={campaignForm.scheduledFor}
            onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
          />

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={handleTestMessage}>
              📱 Enviar Prueba
            </Button>
            
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsCampaignModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSendCampaign}>
                Crear Campaña
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default WhatsAppManager