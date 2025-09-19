import { useSimpleEventDemo } from '../../hooks/useSimpleEventDemo'
import { DEMO_STYLES } from '../../constants/simpleEventDemoConstants'
import DemoHeader from './SimpleEventDemo/DemoHeader'
import EventInfo from './SimpleEventDemo/EventInfo'
import RunDemoButton from './SimpleEventDemo/RunDemoButton'
import DemoStepsList from './SimpleEventDemo/DemoStepsList'

const SimpleEventDemo = ({ event, onClose }) => {
  const { runDemo, runSingleStep } = useSimpleEventDemo(onClose)

  return (
    <div className={DEMO_STYLES.overlay}>
      <div className={DEMO_STYLES.modal}>
        <DemoHeader onClose={onClose} />

        <EventInfo event={event} />

        <RunDemoButton onRunDemo={runDemo} />

        <DemoStepsList onRunSingleStep={runSingleStep} />
      </div>
    </div>
  )
}

export default SimpleEventDemo