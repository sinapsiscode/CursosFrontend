import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../../store'
import { LeadCaptureForm } from '../forms'

const LeadMagnet = ({ 
  trigger = 'scroll_time',
  showAfterSeconds = 30,
  showAfterScrollPercent = 50,
  message = "¿Necesitas orientación sobre qué curso elegir?",
  buttonText = "Recibir Asesoramiento Gratuito",
  position = 'bottom-right'
}) => {
  const { isAuthenticated, guestMode } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // No mostrar si el usuario está autenticado
    if (isAuthenticated) return

    // No mostrar si ya fue dismisseado
    if (isDismissed) return

    let timer
    let scrollHandler

    if (trigger === 'scroll_time' || trigger === 'time') {
      // Mostrar después de X segundos
      timer = setTimeout(() => {
        setIsVisible(true)
      }, showAfterSeconds * 1000)
    }

    if (trigger === 'scroll_time' || trigger === 'scroll') {
      // Mostrar después de scroll X%
      scrollHandler = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPercent = (scrollTop / scrollHeight) * 100

        if (scrollPercent >= showAfterScrollPercent) {
          setIsVisible(true)
        }
      }

      window.addEventListener('scroll', scrollHandler)
    }

    return () => {
      if (timer) clearTimeout(timer)
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
    }
  }, [isAuthenticated, isDismissed, trigger, showAfterSeconds, showAfterScrollPercent])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
  }

  const handleOpenForm = () => {
    setShowLeadForm(true)
  }

  const handleCloseForm = () => {
    setShowLeadForm(false)
    setIsVisible(false)
    setIsDismissed(true)
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  if (!isVisible || isAuthenticated) return null

  return (
    <>
      {/* Lead Magnet Card */}
      <div className={`fixed ${positionClasses[position]} z-40 max-w-sm bg-surface border border-accent rounded-lg shadow-2xl p-4 animate-slide-in-up`}>
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white text-xs transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center">
            <span className="text-2xl">🎓</span>
          </div>
          
          <div className="flex-1">
            {/* Message */}
            <h4 className="text-lg font-semibold text-text-primary mb-2">
              {message}
            </h4>
            
            <p className="text-sm text-text-secondary mb-4">
              Nuestros asesores te ayudarán a elegir el curso ideal para tu perfil profesional.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleOpenForm}
              className="w-full bg-accent hover:bg-accent/90 text-black font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {buttonText}
            </button>

            {/* Benefits */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center text-xs text-text-secondary">
                <span className="text-green-400 mr-2">✓</span>
                Asesoramiento sin costo
              </div>
              <div className="flex items-center text-xs text-text-secondary">
                <span className="text-green-400 mr-2">✓</span>
                Respuesta en menos de 2 horas
              </div>
              <div className="flex items-center text-xs text-text-secondary">
                <span className="text-green-400 mr-2">✓</span>
                Plan de estudios personalizado
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Capture Form */}
      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={handleCloseForm}
        trigger="lead_magnet"
      />
    </>
  )
}

export default LeadMagnet