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
    <div className={`${!hasCapacity ? 'w-full' : 'w-full sm:w-auto'} sm:text-right`}>
      <p className={EVENTS_STYLES.eventCard.price}>
        GRATIS
      </p>

      {(event.type === 'webinar' || event.type === 'masterclass') ? (
        <div className={EVENTS_STYLES.eventCard.buttons.wrapper}>
          <button
            onClick={() => onEventDetail(event)}
            className={EVENTS_STYLES.eventCard.buttons.detail}
          >
            <span className="hidden sm:inline">📋 Ver detalles</span>
            <span className="sm:hidden">📋 Detalles</span>
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
              ? <span className="hidden sm:inline">{eventConfig.fullButtonText}</span>
              : !isAuthenticated
                ? <span className="hidden sm:inline">{eventConfig.lockedButtonText}</span>
                : <span>{eventConfig.buttonText}</span>
            }
            {isEventFull && <span className="sm:hidden">🚫 Lleno</span>}
            {!isEventFull && !isAuthenticated && <span className="sm:hidden">🔒 Iniciar Sesión</span>}
          </button>
        </div>
      ) : event.type === 'promotion' ? (
        <button
          onClick={onNavigateToCourses}
          className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 bg-accent text-background rounded-lg text-xs sm:text-sm md:text-base font-medium hover:bg-opacity-90"
        >
          {eventConfig.buttonText}
        </button>
      ) : (
        <button
          onClick={() => onNavigateToBundle(event.id)}
          className="w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2.5 bg-accent text-background rounded-lg text-xs sm:text-sm md:text-base font-medium hover:bg-opacity-90"
        >
          {eventConfig.buttonText}
        </button>
      )}
    </div>
  )
}

export default EventActions