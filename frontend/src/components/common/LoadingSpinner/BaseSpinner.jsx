import { SPINNER_SIZES, SPINNER_COLORS, SPINNER_STYLES } from '../../../constants/uiConstants'

const BaseSpinner = ({ size = 'medium', color = 'accent', className = '' }) => {
  return (
    <div
      className={`${SPINNER_STYLES.base} ${SPINNER_SIZES[size]} ${SPINNER_COLORS[color]} ${className}`}
    ></div>
  )
}

export default BaseSpinner