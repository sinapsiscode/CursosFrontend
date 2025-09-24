import { MODAL_STYLES, MODAL_ICONS } from '../../../constants/modalConstants.jsx'

const ModalHeader = ({ title, showCloseButton, onClose }) => {
  if (!title && !showCloseButton) return null

  return (
    <div className={MODAL_STYLES.header}>
      {title && (
        <h2 className={MODAL_STYLES.title}>
          {title}
        </h2>
      )}
      {showCloseButton && (
        <button
          onClick={onClose}
          className={MODAL_STYLES.closeButton}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {MODAL_ICONS.close}
          </svg>
        </button>
      )}
    </div>
  )
}

export default ModalHeader