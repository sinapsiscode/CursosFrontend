import { EVENTS_STYLES } from '../../constants/eventsConstants.jsx'

const EventsHeader = ({ isAuthenticated }) => {
  return (
    <div className={EVENTS_STYLES.header.container}>
      <div className={EVENTS_STYLES.header.wrapper}>
        <div>
          <h1 className={EVENTS_STYLES.header.title}>
            Eventos y Promociones
          </h1>
          <p className={EVENTS_STYLES.header.subtitle}>
            Descubre webinars, masterclasses y ofertas especiales
            {isAuthenticated && ' personalizadas para ti'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default EventsHeader