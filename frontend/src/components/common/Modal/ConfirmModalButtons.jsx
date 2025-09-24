import { CONFIRM_MODAL_STYLES, CONFIRM_MODAL_VARIANTS } from '../../../constants/modalConstants.jsx'

const ConfirmModalButtons = ({
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  confirmVariant
}) => {
  return (
    <div className={CONFIRM_MODAL_STYLES.buttonContainer}>
      <button
        onClick={onClose}
        className={CONFIRM_MODAL_STYLES.cancelButton}
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className={`${CONFIRM_MODAL_STYLES.confirmButton} ${CONFIRM_MODAL_VARIANTS[confirmVariant]}`}
      >
        {confirmText}
      </button>
    </div>
  )
}

export default ConfirmModalButtons