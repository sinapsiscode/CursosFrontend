import { TOAST_STYLES } from '../../../constants/toastConstants'
import { getToastIcon } from '../../../utils/toastUtils'
import ToastCloseButton from './ToastCloseButton'

const ToastContent = ({ toast, onClose }) => {
  return (
    <div className={TOAST_STYLES.content}>
      <div className={TOAST_STYLES.iconContainer}>
        {getToastIcon(toast.type)}
      </div>
      <div className={TOAST_STYLES.messageContainer}>
        <p className={TOAST_STYLES.message}>{toast.message}</p>
      </div>
      <ToastCloseButton onClick={onClose} />
    </div>
  )
}

export default ToastContent