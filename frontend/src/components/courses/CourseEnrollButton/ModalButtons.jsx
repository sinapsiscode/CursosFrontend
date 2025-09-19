import { ENROLLMENT_STYLES, ENROLLMENT_TEXTS } from '../../../constants/enrollmentConstants'

const ModalButtons = ({ enrolling, onClose, onConfirm }) => {
  return (
    <div className={ENROLLMENT_STYLES.buttonContainer}>
      <button
        onClick={onClose}
        className={ENROLLMENT_STYLES.cancelButton}
      >
        {ENROLLMENT_TEXTS.cancel}
      </button>
      <button
        onClick={onConfirm}
        disabled={enrolling}
        className={ENROLLMENT_STYLES.confirmButton}
      >
        {enrolling ? ENROLLMENT_TEXTS.enrolling : ENROLLMENT_TEXTS.confirmPurchase}
      </button>
    </div>
  )
}

export default ModalButtons