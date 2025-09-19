import { DEMO_STYLES, DEMO_LABELS, ICON_PATHS } from '../../../constants/simpleEventDemoConstants'

const DemoHeader = ({ onClose }) => {
  return (
    <div className={DEMO_STYLES.header}>
      <h2 className={DEMO_STYLES.title}>
        {DEMO_LABELS.title}
      </h2>
      <button onClick={onClose} className={DEMO_STYLES.closeButton}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICON_PATHS.close} />
        </svg>
      </button>
    </div>
  )
}

export default DemoHeader