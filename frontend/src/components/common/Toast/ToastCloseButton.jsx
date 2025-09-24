import { TOAST_STYLES, CLOSE_ICON } from '../../../constants/toastConstants.jsx'

const ToastCloseButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={TOAST_STYLES.closeButton}
    >
      {CLOSE_ICON}
    </button>
  )
}

export default ToastCloseButton