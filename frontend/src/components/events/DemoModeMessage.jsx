import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const DemoModeMessage = () => {
  return (
    <div className={EVENTS_STYLES.demoMessage.container}>
      <p className={EVENTS_STYLES.demoMessage.text}>
        <strong>🎮 {EVENTS_MESSAGES.demoMode.description}</strong>
      </p>
    </div>
  )
}

export default DemoModeMessage