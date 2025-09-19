import { DEMO_STYLES, DEMO_LABELS } from '../../../constants/simpleEventDemoConstants'

const RunDemoButton = ({ onRunDemo }) => {
  return (
    <button
      onClick={onRunDemo}
      className={DEMO_STYLES.runButton}
    >
      {DEMO_LABELS.runButton}
    </button>
  )
}

export default RunDemoButton