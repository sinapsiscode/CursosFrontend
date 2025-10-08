import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const EventActions = ({
  event,
  eventConfig,
  isAuthenticated,
  hasCapacity,
  onEventDetail,
  onNavigateToCourses,
  onNavigateToBundle,
  onNavigateToLogin
}) => {
  const isEventFull = event.capacity && event.registered >= event.capacity

  return (
    <div className={`${!hasCapacity ? 'w-full' : ''} text-right`}>
      <p className={EVENTS_STYLES.eventCard.price}>
        GRATIS
      </p>

      {(event.type === 'webinar' || event.type === 'masterclass') ? (
        <div className={EVENTS_STYLES.eventCard.buttons.wrapper}>
          <button
            onClick={() => onEventDetail(event)}
            className={EVENTS_STYLES.eventCard.buttons.detail}
          >
            📋 Ver detalles
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                onNavigateToLogin()
                return
              }
              onEventDetail(event)
            }}
            disabled={isEventFull}
            className={`${EVENTS_STYLES.eventCard.buttons.register} ${
              isEventFull
                ? EVENTS_STYLES.eventCard.buttons.registerDisabled
                : EVENTS_STYLES.eventCard.buttons.registerActive
            }`}
            title={!isAuthenticated ? 'Inicia sesión para inscribirte' : ''}
          >
            {isEventFull
              ? eventConfig.fullButtonText
              : !isAuthenticated
                ? eventConfig.lockedButtonText
                : eventConfig.buttonText
            }
          </button>
        </div>
      ) : event.type === 'promotion' ? (
        <button
          onClick={onNavigateToCourses}
          className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
        >
          {eventConfig.buttonText}
        </button>
      ) : (
        <button
          onClick={() => onNavigateToBundle(event.id)}
          className="px-4 py-2 bg-accent text-background rounded-lg font-medium hover:bg-opacity-90"
        >
          {eventConfig.buttonText}
        </button>
      )}
    </div>
  )
}

export default EventActions