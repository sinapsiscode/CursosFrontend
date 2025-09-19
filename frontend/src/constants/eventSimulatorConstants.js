export const SIMULATOR_LABELS = {
  title: 'Simulador de Eventos - Modo Demo',
  startButton: '🚀 Iniciar Simulación Completa (30 seg)',
  runningButton: '⏳ Simulación en progreso...',
  executeButton: 'Ejecutar',
  stepsTitle: 'Pasos de la Simulación:',
  noteTitle: 'Nota:',
  noteDescription: 'Puedes ejecutar pasos individuales o la simulación completa. Las notificaciones aparecerán en la esquina superior derecha. El contador de participantes se actualiza automáticamente durante el evento "en vivo".'
}

export const SIMULATOR_MESSAGES = {
  registrationSuccess: 'Te has inscrito exitosamente al evento',
  simulationComplete: 'Simulación completada',
  actionExecuted: 'Acción ejecutada'
}

export const EVENT_INFO_LABELS = {
  date: 'Fecha:',
  time: 'Hora:',
  registered: 'Inscritos:',
  status: 'Estado:',
  live: '🔴 EN VIVO',
  scheduled: '✅ Programado'
}

export const SIMULATION_STEPS = [
  {
    id: 1,
    time: '24 horas antes',
    action: 'Recordatorio del evento',
    delay: 3000,
    notification: {
      type: 'info',
      title: '📅 Recordatorio: Evento Mañana',
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

export const SIMULATOR_STYLES = {
  overlay: 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4',
  modal: 'bg-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto',
  header: 'p-6 border-b border-gray-700',
  headerContent: 'flex items-center justify-between',
  title: 'text-2xl font-bold text-white',
  closeButton: 'text-gray-400 hover:text-white',
  content: 'p-6',
  eventInfo: 'bg-gray-800 rounded-lg p-4 mb-6',
  eventTitle: 'text-lg font-semibold text-white mb-2',
  eventGrid: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-sm',
  eventFieldLabel: 'text-gray-400',
  eventFieldValue: 'text-white',
  statusLive: 'font-semibold text-red-500 animate-pulse',
  statusScheduled: 'font-semibold text-green-400',
  controlsContainer: 'mb-6',
  startButton: 'w-full py-3 px-6 rounded-lg font-medium text-lg transition-all',
  startButtonActive: 'bg-accent text-background hover:bg-opacity-90',
  startButtonDisabled: 'bg-gray-700 text-gray-400 cursor-not-allowed',
  stepsContainer: 'space-y-4',
  stepsTitle: 'text-lg font-semibold text-white mb-3',
  stepCard: 'border rounded-lg p-4 transition-all',
  stepCardActive: 'border-accent bg-accent/10',
  stepCardCompleted: 'border-green-600 bg-green-600/10',
  stepCardPending: 'border-gray-700',
  stepContent: 'flex items-center justify-between',
  stepLeft: 'flex-1',
  stepInfo: 'flex items-center gap-3',
  stepNumber: 'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
  stepNumberCompleted: 'bg-green-600 text-white',
  stepNumberActive: 'bg-accent text-background animate-pulse',
  stepNumberPending: 'bg-gray-700 text-gray-400',
  stepTime: 'text-white font-medium',
  stepAction: 'text-gray-400 text-sm',
  executeButton: 'px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50',
  noteContainer: 'mt-6 p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg',
  noteText: 'text-sm text-blue-300'
}

export const ICON_PATHS = {
  close: 'M6 18L18 6M6 6l12 12'
}

export const TIMING_CONFIG = {
  initialDelay: 2000,
  participantUpdateInterval: 1000,
  participantUpdateDuration: 5000,
  participantIncrement: { min: 1, max: 3 }
}