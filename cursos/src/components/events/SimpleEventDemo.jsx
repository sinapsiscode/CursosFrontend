import { useState } from 'react'
import { useUIStore } from '../../store'

const SimpleEventDemo = ({ event, onClose }) => {
  const { showToast } = useUIStore()
  const [step, setStep] = useState(0)

  const steps = [
    { title: "24 horas antes", message: "📅 Recordatorio: Evento mañana", type: "info" },
    { title: "1 hora antes", message: "⚡ El evento comienza en 1 hora", type: "warning" },
    { title: "10 minutos antes", message: "🔔 ¡Últimos 10 minutos!", type: "warning" },
    { title: "Inicio del evento", message: "🔴 ¡Evento EN VIVO!", type: "success" },
    { title: "Cambio de ponente", message: "👤 Dr. María González está presentando", type: "info" },
    { title: "Sesión Q&A", message: "❓ Envía tus preguntas ahora", type: "info" },
    { title: "Fin del evento", message: "🎉 ¡Gracias por asistir!", type: "success" }
  ]

  const runDemo = async () => {
    for (let i = 0; i < steps.length; i++) {
      setStep(i + 1)
      const current = steps[i]
      showToast(current.message, current.type, 3000)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    setStep(0)
    onClose()
  }

  const runSingleStep = (index) => {
    const current = steps[index]
    showToast(current.message, current.type, 5000)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Demo de Notificaciones</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg text-white mb-2">{event.title}</h3>
          <p className="text-gray-400">{event.description}</p>
        </div>

        <button
          onClick={runDemo}
          className="w-full mb-4 py-3 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
        >
          🚀 Ejecutar Demo Completo
        </button>

        <div className="space-y-2">
          {steps.map((s, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <span className="text-white">{s.title}</span>
              <button
                onClick={() => runSingleStep(index)}
                className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Mostrar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SimpleEventDemo