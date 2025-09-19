import {
  REGISTRATION_STYLES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  PRIVACY_NOTE
} from '../../../constants/eventRegistrationConstants'
import FormField from './FormField'
import EventInfoDisplay from './EventInfoDisplay'
import FormButtons from './FormButtons'

const RegistrationForm = ({
  event,
  formData,
  errors,
  isSubmitting,
  isAuthenticated,
  onSubmit,
  onChange,
  onClose
}) => {
  return (
    <form onSubmit={onSubmit} className={REGISTRATION_STYLES.form}>
      <FormField
        label={FORM_LABELS.firstName}
        name="firstName"
        value={formData.firstName}
        onChange={onChange}
        placeholder={FORM_PLACEHOLDERS.firstName}
        error={errors.firstName}
      />

      <FormField
        label={FORM_LABELS.lastName}
        name="lastName"
        value={formData.lastName}
        onChange={onChange}
        placeholder={FORM_PLACEHOLDERS.lastName}
        error={errors.lastName}
      />

      <FormField
        label={FORM_LABELS.email}
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        placeholder={FORM_PLACEHOLDERS.email}
        error={errors.email}
        readOnly={isAuthenticated}
      />

      <FormField
        label={FORM_LABELS.phone}
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={onChange}
        placeholder={FORM_PLACEHOLDERS.phone}
        error={errors.phone}
      />

      <EventInfoDisplay event={event} />

      <p className={REGISTRATION_STYLES.privacyNote}>
        {PRIVACY_NOTE}
      </p>

      <FormButtons
        onClose={onClose}
        isSubmitting={isSubmitting}
      />
    </form>
  )
}

export default RegistrationForm