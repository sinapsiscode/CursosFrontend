import { CONFIRM_MODAL_STYLES, CONFIRM_MODAL_DEFAULTS } from '../../../constants/modalConstants'
import { useConfirmModal } from '../../../hooks/useModal'
import BaseModal from './BaseModal'
import ConfirmModalButtons from './ConfirmModalButtons'

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = CONFIRM_MODAL_DEFAULTS.title,
  message,
  confirmText = CONFIRM_MODAL_DEFAULTS.confirmText,
  cancelText = CONFIRM_MODAL_DEFAULTS.cancelText,
  confirmVariant = CONFIRM_MODAL_DEFAULTS.confirmVariant
}) => {
  const { handleConfirm } = useConfirmModal(onConfirm, onClose)

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className={CONFIRM_MODAL_STYLES.container}>
        <p className={CONFIRM_MODAL_STYLES.message}>
          {message}
        </p>

        <ConfirmModalButtons
          onClose={onClose}
          onConfirm={handleConfirm}
          confirmText={confirmText}
          cancelText={cancelText}
          confirmVariant={confirmVariant}
        />
      </div>
    </BaseModal>
  )
}

export default ConfirmModal