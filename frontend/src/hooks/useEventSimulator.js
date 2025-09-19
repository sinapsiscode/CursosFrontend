import { useState } from 'react'
import { useUIStore } from '../store'
import { notificationService } from '../services/notificationService'
import {
  SIMULATION_STEPS,
  SIMULATOR_MESSAGES,
  TIMING_CONFIG
} from '../constants/eventSimulatorConstants'
import {
  createNotificationWithCallback,
  createDelay,
  handleSpecialStepEffects
} from '../utils/eventSimulatorUtils'

export const useEventSimulator = (event) => {
  const { showToast } = useUIStore()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [participants, setParticipants] = useState(event.registered || 45)
  const [isLive, setIsLive] = useState(false)

  const runSimulation = async () => {
    setIsRunning(true)
    setCurrentStep(0)

    // Simular inscripción inicial
    showToast(SIMULATOR_MESSAGES.registrationSuccess, 'success')
    setParticipants(prev => prev + 1)

    await createDelay(TIMING_CONFIG.initialDelay)

    for (let i = 0; i < SIMULATION_STEPS.length; i++) {
      setCurrentStep(i + 1)
      const step = SIMULATION_STEPS[i]

      // Crear notificación con mensaje dinámico
      const notificationMessage = step.notification.message ||
        (step.id === 1 ? `${event.title} - Mañana a las ${event.time}` :
         step.id === 4 ? `${event.title} ha comenzado. Únete ahora` :
         step.notification.message)

      const notification = {
        ...step.notification,
        message: notificationMessage
      }

      notificationService.createNotification(
        createNotificationWithCallback(notification, showToast)
      )

      // Efectos especiales para ciertos pasos
      handleSpecialStepEffects(step.id, setIsLive, setParticipants)

      // Esperar antes del siguiente paso
      if (i < SIMULATION_STEPS.length - 1) {
        await createDelay(step.delay)
      }
    }

    setIsRunning(false)
    showToast(SIMULATOR_MESSAGES.simulationComplete, 'info')
  }

  const runQuickStep = (stepIndex) => {
    const step = SIMULATION_STEPS[stepIndex]

    // Crear notificación con mensaje dinámico
    const notificationMessage = step.notification.message ||
      (step.id === 1 ? `${event.title} - Mañana a las ${event.time}` :
       step.id === 4 ? `${event.title} ha comenzado. Únete ahora` :
       step.notification.message)

    const notification = {
      ...step.notification,
      message: notificationMessage
    }

    notificationService.createNotification(
      createNotificationWithCallback(notification, showToast)
    )

    handleSpecialStepEffects(step.id, setIsLive, setParticipants)
  }

  return {
    isRunning,
    currentStep,
    participants,
    isLive,
    runSimulation,
    runQuickStep
  }
}