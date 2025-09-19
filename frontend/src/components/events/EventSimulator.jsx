import { useEventSimulator } from '../../hooks/useEventSimulator'
import { SIMULATOR_STYLES } from '../../constants/eventSimulatorConstants'
import SimulatorHeader from './EventSimulator/SimulatorHeader'
import EventInfoPanel from './EventSimulator/EventInfoPanel'
import SimulationControls from './EventSimulator/SimulationControls'
import SimulationTimeline from './EventSimulator/SimulationTimeline'
import SimulatorNote from './EventSimulator/SimulatorNote'

const EventSimulator = ({ event, onClose }) => {
  const {
    isRunning,
    currentStep,
    participants,
    isLive,
    runSimulation,
    runQuickStep
  } = useEventSimulator(event)

  return (
    <div className={SIMULATOR_STYLES.overlay}>
      <div className={SIMULATOR_STYLES.modal}>
        <SimulatorHeader onClose={onClose} />

        <div className={SIMULATOR_STYLES.content}>
          <EventInfoPanel
            event={event}
            participants={participants}
            isLive={isLive}
          />

          <SimulationControls
            isRunning={isRunning}
            onRunSimulation={runSimulation}
          />

          <SimulationTimeline
            currentStep={currentStep}
            isRunning={isRunning}
            onExecuteStep={runQuickStep}
          />

          <SimulatorNote />
        </div>
      </div>
    </div>
  )
}

export default EventSimulator