import { REGISTRATION_STYLES, FORM_LABELS } from '../../../constants/eventRegistrationConstants'

const FormButtons = ({ onClose, isSubmitting }) => {
  return (
    <div className={REGISTRATION_STYLES.buttonContainer}>
      <button
        type="button"
        onClick={onClose}
        className={REGISTRATION_STYLES.cancelButton}
      >
        {FORM_LABELS.cancel}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className={REGISTRATION_STYLES.submitButton}
      >
        {isSubmitting ? FORM_LABELS.submitting : FORM_LABELS.submit}
      </button>
    </div>
  )
}

export default FormButtons