import { DEMO_STYLES, DEMO_LABELS } from '../../../constants/simpleEventDemoConstants'

const DemoStepItem = ({ step, index, onRunSingleStep }) => {
  return (
    <div className={DEMO_STYLES.stepItem}>
      <span className={DEMO_STYLES.stepTitle}>{step.title}</span>
      <button
        onClick={() => onRunSingleStep(index)}
        className={DEMO_STYLES.stepButton}
      >
        {DEMO_LABELS.showButton}
      </button>
    </div>
  )
}

export default DemoStepItem