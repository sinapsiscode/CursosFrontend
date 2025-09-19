import { FORM_LABELS, FORM_STYLES } from '../../../constants/reviewConstants'
import LoadingSpinner from './LoadingSpinner'

const FormButtons = ({ onCancel, isSubmitting }) => {
  return (
    <div className={FORM_STYLES.buttonContainer}>
      <button
        type="button"
        onClick={onCancel}
        className={FORM_STYLES.cancelButton}
      >
        {FORM_LABELS.cancel}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className={FORM_STYLES.submitButton}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner />
            <span>{FORM_LABELS.submitting}</span>
          </>
        ) : (
          <span>{FORM_LABELS.submit}</span>
        )}
      </button>
    </div>
  )
}

export default FormButtons