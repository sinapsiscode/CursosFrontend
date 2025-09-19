import { TIMING_CONFIG } from '../constants/eventSimulatorConstants'

export const formatEventDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

export const createNotificationWithCallback = (notification, showToast) => {
  return {
    ...notification,
    actions: notification.actions?.map(action => ({
      ...action,
      callback: () => showToast('Acción ejecutada', 'info')
    }))
  }
}

export const createParticipantUpdateInterval = (setParticipants) => {
  return setInterval(() => {
    setParticipants(prev => prev + Math.floor(Math.random() * TIMING_CONFIG.participantIncrement.max) + TIMING_CONFIG.participantIncrement.min)
  }, TIMING_CONFIG.participantUpdateInterval)
}

export const getStepCardClassName = (stepIndex, currentStep) => {
  if (currentStep === stepIndex + 1) {
    return 'border-accent bg-accent/10'
  }
  if (currentStep > stepIndex + 1) {
    return 'border-green-600 bg-green-600/10'
  }
  return 'border-gray-700'
}

export const getStepNumberClassName = (stepIndex, currentStep) => {
  if (currentStep > stepIndex + 1) {
    return 'bg-green-600 text-white'
  }
  if (currentStep === stepIndex + 1) {
    return 'bg-accent text-background animate-pulse'
  }
  return 'bg-gray-700 text-gray-400'
}

export const getStepNumberContent = (stepIndex, currentStep) => {
  if (currentStep > stepIndex + 1) {
    return '✓'
  }
  return stepIndex + 1
}

export const createDelay = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const handleSpecialStepEffects = (stepId, setIsLive, setParticipants) => {
  if (stepId === 4) {
    setIsLive(true)
    const interval = createParticipantUpdateInterval(setParticipants)
    setTimeout(() => clearInterval(interval), TIMING_CONFIG.participantUpdateDuration)
  }

  if (stepId === 7) {
    setIsLive(false)
  }
}