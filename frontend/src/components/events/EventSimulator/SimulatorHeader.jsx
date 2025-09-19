import { SIMULATOR_STYLES, SIMULATOR_LABELS, ICON_PATHS } from '../../../constants/eventSimulatorConstants'

const SimulatorHeader = ({ onClose }) => {
  return (
    <div className={SIMULATOR_STYLES.header}>
      <div className={SIMULATOR_STYLES.headerContent}>
        <h2 className={SIMULATOR_STYLES.title}>
          {SIMULATOR_LABELS.title}
        </h2>
        <button
          onClick={onClose}
          className={SIMULATOR_STYLES.closeButton}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.close} />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default SimulatorHeader