import { EVENTS_STYLES, EVENTS_MESSAGES } from '../../constants/eventsConstants.jsx'

const EventPromotion = ({ event }) => {
  return (
    <div className={EVENTS_STYLES.promotion.container}>
      <div className={EVENTS_STYLES.promotion.discountWrapper}>
        <span className={EVENTS_STYLES.promotion.discount}>
          -{event.discount}%
        </span>
        <span className={EVENTS_STYLES.promotion.code}>
          {EVENTS_MESSAGES.eventDetails.promoCode}{' '}
          <span className={EVENTS_STYLES.promotion.codeValue}>
            {event.promoCode}
          </span>
        </span>
      </div>
      <p className={EVENTS_STYLES.promotion.validity}>
        {EVENTS_MESSAGES.eventDetails.validUntil}{' '}
        {new Date(event.endDate).toLocaleDateString('es-ES')}
      </p>
    </div>
  )
}

export default EventPromotion