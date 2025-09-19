import {
  SIMULATOR_STYLES,
  SIMULATOR_LABELS
} from '../../../constants/eventSimulatorConstants'
import {
  getStepCardClassName,
  getStepNumberClassName,
  getStepNumberContent
} from '../../../utils/eventSimulatorUtils'

const SimulationStep = ({ step, stepIndex, currentStep, isRunning, onExecuteStep }) => {
  const cardClassName = `${SIMULATOR_STYLES.stepCard} ${getStepCardClassName(stepIndex, currentStep)}`
  const numberClassName = `${SIMULATOR_STYLES.stepNumber} ${getStepNumberClassName(stepIndex, currentStep)}`

  return (
    <div className={cardClassName}>
      <div className={SIMULATOR_STYLES.stepContent}>
        <div className={SIMULATOR_STYLES.stepLeft}>
          <div className={SIMULATOR_STYLES.stepInfo}>
            <div className={numberClassName}>
              {getStepNumberContent(stepIndex, currentStep)}
            </div>
            <div>
              <p className={SIMULATOR_STYLES.stepTime}>{step.time}</p>
              <p className={SIMULATOR_STYLES.stepAction}>{step.action}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => onExecuteStep(stepIndex)}
          disabled={isRunning}
          className={SIMULATOR_STYLES.executeButton}
        >
          {SIMULATOR_LABELS.executeButton}
        </button>
      </div>
    </div>
  )
}

export default SimulationStep