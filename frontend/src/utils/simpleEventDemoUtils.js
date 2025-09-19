import { TIMING_CONFIG } from '../constants/simpleEventDemoConstants'

export const createDelay = (milliseconds = TIMING_CONFIG.stepDelay) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const executeStep = (step, showToast, duration = TIMING_CONFIG.toastDuration) => {
  showToast(step.message, step.type, duration)
}

export const runStepsSequentially = async (steps, showToast, setStep, onComplete) => {
  for (let i = 0; i < steps.length; i++) {
    setStep(i + 1)
    const currentStep = steps[i]
    executeStep(currentStep, showToast, TIMING_CONFIG.toastDuration)
    await createDelay()
  }

  setStep(0)
  onComplete()
}