import { MODAL_STYLES } from '../../../constants/modalConstants.jsx'

const ModalOverlay = ({ onClose, closeOnOverlayClick }) => {
  return (
    <div
      className={MODAL_STYLES.backdrop}
      onClick={closeOnOverlayClick ? onClose : undefined}
    />
  )
}

export default ModalOverlay