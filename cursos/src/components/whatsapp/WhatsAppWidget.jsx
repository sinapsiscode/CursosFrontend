import React, { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '../../store'
import whatsappService from '../../services/whatsappService'
import apiClient from '../../api/client'

const WhatsAppWidget = () => {
  const { user, isAuthenticated } = useAuthStore()
  const { showSuccess, showError } = useUIStore()
  
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [config, setConfig] = useState(null)
  const [isBusinessHours, setIsBusinessHours] = useState(true)
  const [quickMessages, setQuickMessages] = useState([
    { id: 1, text: 'Quiero información sobre cursos', icon: '📚' },
    { id: 2, text: 'Necesito ayuda con mi inscripción', icon: '🎓' },
    { id: 3, text: 'Tengo una pregunta técnica', icon: '💻' },
    { id: 4, text: 'Quiero hablar con un asesor', icon: '👨‍💼' }
  ])

  useEffect(() => {
    loadConfig()
    checkBusinessHours()
    
    // Verificar horario cada minuto
    const interval = setInterval(checkBusinessHours, 60000)
    return () => clearInterval(interval)
  }, [])

  const loadConfig = async () => {
    try {
      const configData = await apiClient.get('/config')
      setConfig(configData.whatsapp) // configData ya contiene todo el objeto config
    } catch (error) {
      console.error('Error loading WhatsApp config:', error)
    }
  }

  const checkBusinessHours = () => {
    const isOpen = whatsappService.isBusinessHours()
    setIsBusinessHours(isOpen)
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const phone = config?.phoneNumber?.replace(/[^0-9]/g, '')
    const finalMessage = isAuthenticated && user
      ? `Hola, soy ${user.name} (${user.email})\n\n${message}`
      : message

    const whatsappUrl = whatsappService.generateWhatsAppLink(phone, finalMessage)
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank')
    
    // Registrar la interacción
    trackInteraction('widget_message', message)
    
    // Reset
    setMessage('')
    setIsOpen(false)
    showSuccess('Redirigiendo a WhatsApp...')
  }

  const handleQuickMessage = (quickMsg) => {
    const phone = config?.phoneNumber?.replace(/[^0-9]/g, '')
    const finalMessage = isAuthenticated && user
      ? `Hola, soy ${user.name} (${user.email})\n\n${quickMsg.text}`
      : quickMsg.text

    const whatsappUrl = whatsappService.generateWhatsAppLink(phone, finalMessage)
    window.open(whatsappUrl, '_blank')
    
    trackInteraction('widget_quick_message', quickMsg.text)
    setIsOpen(false)
    showSuccess('Redirigiendo a WhatsApp...')
  }

  const trackInteraction = async (type, content) => {
    try {
      await apiClient.post('/api/whatsapp/interactions', {
        type,
        content,
        userId: user?.id,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error tracking interaction:', error)
    }
  }

  if (!config?.enabled) return null

  return (
    <>
      {/* Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 animate-bounce-in"
            aria-label="Abrir WhatsApp"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 1.172c-5.963 0-10.813 4.85-10.813 10.813 0 1.897.494 3.688 1.356 5.244l-1.406 5.131 5.256-1.381c1.494.813 3.2 1.281 5.006 1.281 5.963 0 10.813-4.85 10.813-10.813s-4.85-10.813-10.813-10.813zm5.419 15.419c-.225.631-1.325 1.219-1.831 1.281-.488.063-1.1.088-1.775-.113-.4-.119-.919-.281-1.581-.55-2.781-1.131-4.594-3.994-4.731-4.175-.138-.181-1.125-1.5-1.125-2.863s.713-2.031.969-2.306c.256-.281.556-.35.744-.35.188 0 .375 0 .538.006.175.006.406-.069.638.488.231.556.781 1.913.85 2.05.069.138.113.3.025.481-.088.188-.131.3-.263.463-.131.163-.275.363-.394.488-.131.138-.269.288-.113.563.156.281.694 1.144 1.488 1.85 1.025.913 1.888 1.2 2.156 1.331.269.138.425.113.581-.069.163-.181.688-.8.869-1.075.181-.281.363-.231.606-.138.244.094 1.544.731 1.806.863.269.131.444.2.506.306.069.113.069.638-.156 1.269z" />
            </svg>
            {!isBusinessHours && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            )}
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="absolute bottom-0 right-0 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up">
            {/* Header */}
            <div className="bg-green-500 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 1.172c-5.963 0-10.813 4.85-10.813 10.813 0 1.897.494 3.688 1.356 5.244l-1.406 5.131 5.256-1.381c1.494.813 3.2 1.281 5.006 1.281 5.963 0 10.813-4.85 10.813-10.813s-4.85-10.813-10.813-10.813zm5.419 15.419c-.225.631-1.325 1.219-1.831 1.281-.488.063-1.1.088-1.775-.113-.4-.119-.919-.281-1.581-.55-2.781-1.131-4.594-3.994-4.731-4.175-.138-.181-1.125-1.5-1.125-2.863s.713-2.031.969-2.306c.256-.281.556-.35.744-.35.188 0 .375 0 .538.006.175.006.406-.069.638.488.231.556.781 1.913.85 2.05.069.138.113.3.025.481-.088.188-.131.3-.263.463-.131.163-.275.363-.394.488-.131.138-.269.288-.113.563.156.281.694 1.144 1.488 1.85 1.025.913 1.888 1.2 2.156 1.331.269.138.425.113.581-.069.163-.181.688-.8.869-1.075.181-.281.363-.231.606-.138.244.094 1.544.731 1.806.863.269.131.444.2.506.306.069.113.069.638-.156 1.269z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">MetSel Academy</h3>
                    <p className="text-xs opacity-90">
                      {isBusinessHours ? '🟢 En línea' : '🟡 Fuera de horario'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Business Hours Notice */}
            {!isBusinessHours && (
              <div className="bg-yellow-50 border-b border-yellow-200 p-3">
                <p className="text-sm text-yellow-800">
                  ⏰ Estamos fuera de horario. Te responderemos en cuanto estemos disponibles.
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Horario: Lun-Vie {config?.businessHours?.start} - {config?.businessHours?.end}
                </p>
              </div>
            )}

            {/* Chat Body */}
            <div className="p-4 bg-gray-50 h-80 overflow-y-auto">
              {/* Welcome Message */}
              <div className="mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-gray-700 text-sm">
                    {config?.welcomeMessage || '¡Hola! 👋 ¿En qué podemos ayudarte hoy?'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Mensajes rápidos:</p>
                <div className="space-y-2">
                  {quickMessages.map(msg => (
                    <button
                      key={msg.id}
                      onClick={() => handleQuickMessage(msg)}
                      className="w-full text-left bg-white hover:bg-gray-100 rounded-lg p-3 shadow-sm transition-colors flex items-center space-x-2"
                    >
                      <span className="text-xl">{msg.icon}</span>
                      <span className="text-sm text-gray-700">{msg.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">O escribe tu mensaje:</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                  rows={3}
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t">
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span>Enviar por WhatsApp</span>
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                Se abrirá WhatsApp con tu mensaje
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notification Bubble */}
      {!isOpen && isBusinessHours && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg p-3 max-w-xs animate-slide-in-right">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs"
          >
            ×
          </button>
          <p className="text-sm text-gray-700">
            💬 ¿Necesitas ayuda? Chatea con nosotros
          </p>
        </div>
      )}
    </>
  )
}

export default WhatsAppWidget