import { SPINNER_STYLES } from '../../../constants/uiConstants'
import BaseSpinner from './BaseSpinner'

const InlineSpinner = ({ message, size = 'small' }) => {
  return (
    <div className={SPINNER_STYLES.inlineContainer}>
      <BaseSpinner size={size} />
      {message && <span className={SPINNER_STYLES.inlineMessage}>{message}</span>}
    </div>
  )
}

export default InlineSpinner