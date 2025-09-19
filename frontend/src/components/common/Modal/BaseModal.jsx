import { createPortal } from 'react-dom'
import { MODAL_SIZES, MODAL_STYLES } from '../../../constants/modalConstants'
import { useModalEffects } from '../../../hooks/useModal'
import ModalOverlay from './ModalOverlay'
import ModalHeader from './ModalHeader'
import ModalContent from './ModalContent'

const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  useModalEffects(isOpen, onClose)

  if (!isOpen) return null

  const hasHeader = title || showCloseButton

  const modalContent = (
    <div className={MODAL_STYLES.overlay}>
      <ModalOverlay onClose={onClose} closeOnOverlayClick={closeOnOverlayClick} />

      <div className={MODAL_STYLES.container}>
        <div
          className={`${MODAL_STYLES.modal} ${MODAL_SIZES[size]} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader
            title={title}
            showCloseButton={showCloseButton}
            onClose={onClose}
          />

          <ModalContent hasHeader={hasHeader}>
            {children}
          </ModalContent>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default BaseModal