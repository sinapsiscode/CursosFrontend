import { useState, useEffect } from 'react'
import { eventService } from '../../services/eventService'
import { notificationService } from '../../services/notificationService'
import { useUIStore } from '../../store'

const EventSimulator = ({ event, onClose }) => {
  const { showToast } = useUIStore()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [participants, setParticipants] = useState(event.registered || 45)
  const [isLive, setIsLive] = useState(false)

  const simulationSteps = [
    {
      id: 1,
      time: '24 horas antes',
      action: 'Recordatorio del evento',
      delay: 3000,
      notification: {
        type: 'info',
        title: '📅 Recordatorio: Evento Mañana',
        message: `${event.title} - Mañana a las ${event.time}`,
        icon: '⏰',
        persistent: true
      }
    },
    {
      id: 2,
      time: '1 hora antes',
      action: 'Preparación final',
      delay: 3000,
      notification: {
        type: 'warning',
        title: '⚡ El evento comienza en 1 hora',
        message: 'Prepara tus materiales y únete a tiempo',
        icon: '📚',
        persistent: true
      }
    },
    {
      id: 3,
      time: '10 minutos antes',
      action: 'Última llamada',
      delay: 3000,
      notification: {
        type: 'warning',
        title: '🔔 ¡Últimos 10 minutos!',
        message: 'El evento está por comenzar. ¡No te lo pierdas!',
        icon: '🏃‍♂️',
        persistent: true,
        sound: true
      }
    },
    {
      id: 4,
      time: 'Inicio del evento',
      action: 'Evento EN VIVO',
      delay: 3000,
      notification: {
        type: 'success',
        title: '🔴 ¡Evento EN VIVO!',
        message: `${event.title} ha comenzado. Únete ahora`,
        icon: '🎬',
        persistent: true,
        sound: true,
        actions: [
          {
            label: 'Unirse Ahora',
            url: '#',
            icon: '🚀'
          }
        ]
      }
    },
    {
      id: 5,
      time: 'Durante el evento',
      action: 'Cambio de ponente',
      delay: 4000,
      notification: {
        type: 'info',
        title: '👤 Nuevo Ponente',
        message: 'Dr. María González está presentando ahora',
        icon: '🎤',
        duration: 5000
      }
    },
    {
      id: 6,
      time: 'Sesión Q&A',
      action: 'Preguntas y respuestas',
      delay: 3000,
      notification: {
        type: 'info',
        title: '❓ Sesión de Preguntas',
        message: 'Envía tus preguntas ahora',
        icon: '💬',
        duration: 5000
      }
    },
    {
      id: 7,
      time: 'Fin del evento',
      action: 'Agradecimiento y material',
      delay: 3000,
      notification: {
        type: 'success',
        title: '🎉 ¡Gracias por asistir!',
        message: 'El material del evento estará disponible en 24 horas',
        icon: '📁',
        persistent: true,
        actions: [
          {
            label: 'Descargar Certificado',
            url: '#',
            icon: '📜'
          }
        ]
      }
    }
  ]

  const runSimulation = async () => {
    setIsRunning(true)
    setCurrentStep(0)
    
    // Simular inscripción inicial
    showToast('Te has inscrito exitosamente al evento', 'success')
    setParticipants(prev => prev + 1)
    
    await new Promise(resolve => setTimeout(resolve, 2000))

    for (let i = 0; i < simulationSteps.length; i++) {
      setCurrentStep(i + 1)
      const step = simulationSteps[i]
      
      // Crear notificación
      notificationService.createNotification({
        ...step.notification,
        actions: step.notification.actions?.map(action => ({
          ...action,
          callback: () => showToast('Acción ejecutada', 'info')
        }))
      })

      // Efectos especiales para ciertos pasos
      if (step.id === 4) {
        setIsLive(true)
        // Simular más personas uniéndose
        const interval = setInterval(() => {
          setParticipants(prev => prev + Math.floor(Math.random() * 3) + 1)
        }, 1000)
        setTimeout(() => clearInterval(interval), 5000)
      }
      
      if (step.id === 7) {
        setIsLive(false)
      }

      // Esperar antes del siguiente paso
      if (i < simulationSteps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, step.delay))
      }
    }
    
    setIsRunning(false)
    showToast('Simulación completada', 'info')
  }

  const runQuickStep = (stepIndex) => {
    const step = simulationSteps[stepIndex]
    notificationService.createNotification({
      ...step.notification,
      actions: step.notification.actions?.map(action => ({
        ...action,
        callback: () => showToast('Acción ejecutada', 'info')
      }))
    })
    
    if (step.id === 4) {
      setIsLive(true)
    }
    if (step.id === 7) {
      setIsLive(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Simulador de Eventos - Modo Demo
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Información del evento */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Fecha:</span>
                <p className="text-white">{new Date(event.date).toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <span className="text-gray-400">Hora:</span>
                <p className="text-white">{event.time}</p>
              </div>
              <div>
                <span className="text-gray-400">Inscritos:</span>
                <p className="text-white">{participants}</p>
              </div>
              <div>
                <span className="text-gray-400">Estado:</span>
                <p className={`font-semibold ${isLive ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                  {isLive ? '🔴 EN VIVO' : '✅ Programado'}
                </p>
              </div>
            </div>
          </div>

          {/* Controles de simulación */}
          <div className="mb-6">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className={`w-full py-3 px-6 rounded-lg font-medium text-lg transition-all ${
                isRunning 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-accent text-background hover:bg-opacity-90'
              }`}
            >
              {isRunning ? '⏳ Simulación en progreso...' : '🚀 Iniciar Simulación Completa (30 seg)'}
            </button>
          </div>

          {/* Timeline de pasos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-3">
              Pasos de la Simulación:
            </h4>
            {simulationSteps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 transition-all ${
                  currentStep === index + 1
                    ? 'border-accent bg-accent/10'
                    : currentStep > index + 1
                    ? 'border-green-600 bg-green-600/10'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        currentStep > index + 1
                          ? 'bg-green-600 text-white'
                          : currentStep === index + 1
                          ? 'bg-accent text-background animate-pulse'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {currentStep > index + 1 ? '✓' : index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{step.time}</p>
                        <p className="text-gray-400 text-sm">{step.action}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => runQuickStep(index)}
                    disabled={isRunning}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Ejecutar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Nota para el presentador */}
          <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Nota:</strong> Puedes ejecutar pasos individuales o la simulación completa. 
              Las notificaciones aparecerán en la esquina superior derecha. 
              El contador de participantes se actualiza automáticamente durante el evento "en vivo".
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventSimulator