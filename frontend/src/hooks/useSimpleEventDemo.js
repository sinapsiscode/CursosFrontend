import { useState } from 'react'
import { useUIStore } from '../store'
import { DEMO_STEPS, TIMING_CONFIG } from '../constants/simpleEventDemoConstants'
import { executeStep, runStepsSequentially } from '../utils/simpleEventDemoUtils'

export const useSimpleEventDemo = (onClose) => {
  const { showToast } = useUIStore()
  const [step, setStep] = useState(0)

  const runDemo = async () => {
    await runStepsSequentially(DEMO_STEPS, showToast, setStep, onClose)
  }

  const runSingleStep = (index) => {
    const currentStep = DEMO_STEPS[index]
    executeStep(currentStep, showToast, TIMING_CONFIG.singleStepToastDuration)
  }

  return {
    step,
    runDemo,
    runSingleStep
  }
}