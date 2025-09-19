import {
  SIMULATOR_STYLES,
  SIMULATOR_LABELS
} from '../../../constants/eventSimulatorConstants'

const SimulatorNote = () => {
  return (
    <div className={SIMULATOR_STYLES.noteContainer}>
      <p className={SIMULATOR_STYLES.noteText}>
        <strong>{SIMULATOR_LABELS.noteTitle}</strong> {SIMULATOR_LABELS.noteDescription}
      </p>
    </div>
  )
}

export default SimulatorNote