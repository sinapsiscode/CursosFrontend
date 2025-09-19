import { useEventRegistration } from '../../hooks/useEventRegistration'
import { EVENT_STYLES } from '../../constants/eventDetailConstants'
import EventHeader from './EventDetailModal/EventHeader'
import EventTitleSection from './EventDetailModal/EventTitleSection'
import EventDetails from './EventDetailModal/EventDetails'
import EventResources from './EventDetailModal/EventResources'
import EventBenefits from './EventDetailModal/EventBenefits'
import RegistrationButton from './EventDetailModal/RegistrationButton'
import LoginPrompt from './EventDetailModal/LoginPrompt'

const EventDetailModal = ({ event, onClose, onSuccess }) => {
  const { isRegistering, handleRegister } = useEventRegistration(event, onSuccess, onClose)

  return (
    <div className={EVENT_STYLES.overlay}>
      <div className={EVENT_STYLES.modal}>
        <EventHeader event={event} onClose={onClose} />

        <div className={EVENT_STYLES.content}>
          <EventTitleSection event={event} />

          <div className={EVENT_STYLES.detailsGrid}>
            <EventDetails event={event} />
            <EventResources event={event} />
          </div>

          <EventBenefits benefits={event.benefits} />

          <RegistrationButton
            isRegistering={isRegistering}
            onRegister={handleRegister}
          />

          <LoginPrompt />
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal