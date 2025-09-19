import {
  SIMULATOR_STYLES,
  SIMULATOR_LABELS,
  SIMULATION_STEPS
} from '../../../constants/eventSimulatorConstants'
import SimulationStep from './SimulationStep'

const SimulationTimeline = ({ currentStep, isRunning, onExecuteStep }) => {
  return (
    <div className={SIMULATOR_STYLES.stepsContainer}>
      <h4 className={SIMULATOR_STYLES.stepsTitle}>
        {SIMULATOR_LABELS.stepsTitle}
      </h4>
      {SIMULATION_STEPS.map((step, index) => (
        <SimulationStep
          key={step.id}
          step={step}
          stepIndex={index}
          currentStep={currentStep}
          isRunning={isRunning}
          onExecuteStep={onExecuteStep}
        />
      ))}
    </div>
  )
}

export default SimulationTimeline