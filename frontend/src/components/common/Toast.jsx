import { TOAST_STYLES } from '../../constants/toastConstants.jsx'
import { useToast } from '../../hooks/useToast'
import { getToastStyles } from '../../utils/toastUtils'
import ToastContent from './Toast/ToastContent'

const Toast = () => {
  const { toast, hideToast, isVisible } = useToast()

  if (!isVisible) return null

  return (
    <div className={TOAST_STYLES.container}>
      <div className={`${TOAST_STYLES.toast} ${getToastStyles(toast.type)}`}>
        <ToastContent toast={toast} onClose={hideToast} />
      </div>
    </div>
  )
}

export default Toast