import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const EventsHeader = ({
  isAuthenticated,
  demoMode,
  onToggleDemoMode
}) => {
  return (
    <div className={EVENTS_STYLES.header.container}>
      <div className={EVENTS_STYLES.header.wrapper}>
        <div>
          <h1 className={EVENTS_STYLES.header.title}>
            {EVENTS_MESSAGES.title}
          </h1>
          <p className={EVENTS_STYLES.header.subtitle}>
            {EVENTS_MESSAGES.subtitle}
            {isAuthenticated && EVENTS_MESSAGES.subtitleAuthenticated}
          </p>
        </div>

        {/* Demo Mode Button */}
        <button
          onClick={onToggleDemoMode}
          className={
            demoMode
              ? EVENTS_STYLES.header.demoButton.active
              : EVENTS_STYLES.header.demoButton.inactive
          }
        >
          {demoMode
            ? EVENTS_MESSAGES.demoMode.active
            : EVENTS_MESSAGES.demoMode.inactive
          }
        </button>
      </div>
    </div>
  )
}

export default EventsHeader