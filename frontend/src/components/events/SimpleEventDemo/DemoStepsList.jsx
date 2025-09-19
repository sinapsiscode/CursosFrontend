import { DEMO_STYLES, DEMO_STEPS } from '../../../constants/simpleEventDemoConstants'
import DemoStepItem from './DemoStepItem'

const DemoStepsList = ({ onRunSingleStep }) => {
  return (
    <div className={DEMO_STYLES.stepsList}>
      {DEMO_STEPS.map((step, index) => (
        <DemoStepItem
          key={index}
          step={step}
          index={index}
          onRunSingleStep={onRunSingleStep}
        />
      ))}
    </div>
  )
}

export default DemoStepsList