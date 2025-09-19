export const DEMO_LABELS = {
  title: 'Demo de Notificaciones',
  runButton: '🚀 Ejecutar Demo Completo',
  showButton: 'Mostrar'
}

export const DEMO_STEPS = [
  { title: "24 horas antes", message: "📅 Recordatorio: Evento mañana", type: "info" },
  { title: "1 hora antes", message: "⚡ El evento comienza en 1 hora", type: "warning" },
  { title: "10 minutos antes", message: "🔔 ¡Últimos 10 minutos!", type: "warning" },
  { title: "Inicio del evento", message: "🔴 ¡Evento EN VIVO!", type: "success" },
  { title: "Cambio de ponente", message: "👤 Dr. María González está presentando", type: "info" },
  { title: "Sesión Q&A", message: "❓ Envía tus preguntas ahora", type: "info" },
  { title: "Fin del evento", message: "🎉 ¡Gracias por asistir!", type: "success" }
]

export const DEMO_STYLES = {
  overlay: 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4',
  modal: 'bg-surface rounded-xl max-w-2xl w-full p-6',
  header: 'flex justify-between items-center mb-6',
  title: 'text-xl font-bold text-white',
  closeButton: 'text-gray-400 hover:text-white',
  eventInfo: 'mb-6',
  eventTitle: 'text-lg text-white mb-2',
  eventDescription: 'text-gray-400',
  runButton: 'w-full mb-4 py-3 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90',
  stepsList: 'space-y-2',
  stepItem: 'flex justify-between items-center p-3 bg-gray-700 rounded-lg',
  stepTitle: 'text-white',
  stepButton: 'px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700'
}

export const TIMING_CONFIG = {
  toastDuration: 3000,
  singleStepToastDuration: 5000,
  stepDelay: 2000
}

export const ICON_PATHS = {
  close: 'M6 18L18 6M6 6l12 12'
}