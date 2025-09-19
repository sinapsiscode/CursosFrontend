import { useEventRegistrationForm } from '../../hooks/useEventRegistrationForm'
import { REGISTRATION_STYLES } from '../../constants/eventRegistrationConstants'
import RegistrationHeader from './EventRegistrationModal/RegistrationHeader'
import RegistrationForm from './EventRegistrationModal/RegistrationForm'

const EventRegistrationModal = ({ event, onClose, onSuccess }) => {
  const {
    formData,
    errors,
    isSubmitting,
    isAuthenticated,
    handleChange,
    handleSubmit
  } = useEventRegistrationForm(event, onSuccess, onClose)

  return (
    <div className={REGISTRATION_STYLES.overlay}>
      <div className={REGISTRATION_STYLES.modal}>
        <RegistrationHeader event={event} onClose={onClose} />

        <RegistrationForm
          event={event}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          isAuthenticated={isAuthenticated}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

export default EventRegistrationModal