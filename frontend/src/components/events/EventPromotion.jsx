import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const EventPromotion = ({ event }) => {
  return (
    <div className={EVENTS_STYLES.promotion.container}>
      <div className={EVENTS_STYLES.promotion.discountWrapper}>
        <span className={EVENTS_STYLES.promotion.discount}>
          -{event.discount}%
        </span>
        <span className={EVENTS_STYLES.promotion.code}>
          Código:{' '}
          <span className={EVENTS_STYLES.promotion.codeValue}>
            {event.promoCode}
          </span>
        </span>
      </div>
      <p className={EVENTS_STYLES.promotion.validity}>
        Válido hasta:{' '}
        {new Date(event.endDate).toLocaleDateString('es-ES')}
      </p>
    </div>
  )
}

export default EventPromotion