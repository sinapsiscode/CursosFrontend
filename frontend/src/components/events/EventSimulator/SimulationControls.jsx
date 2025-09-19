import {
  SIMULATOR_STYLES,
  SIMULATOR_LABELS
} from '../../../constants/eventSimulatorConstants'

const SimulationControls = ({ isRunning, onRunSimulation }) => {
  const buttonClassName = `${SIMULATOR_STYLES.startButton} ${
    isRunning
      ? SIMULATOR_STYLES.startButtonDisabled
      : SIMULATOR_STYLES.startButtonActive
  }`

  return (
    <div className={SIMULATOR_STYLES.controlsContainer}>
      <button
        onClick={onRunSimulation}
        disabled={isRunning}
        className={buttonClassName}
      >
        {isRunning ? SIMULATOR_LABELS.runningButton : SIMULATOR_LABELS.startButton}
      </button>
    </div>
  )
}

export default SimulationControls