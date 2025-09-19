import { SPINNER_STYLES, DEFAULT_LOADING_MESSAGE } from '../../../constants/uiConstants'
import BaseSpinner from './BaseSpinner'

const FullPageSpinner = ({ message = DEFAULT_LOADING_MESSAGE }) => {
  return (
    <div className={SPINNER_STYLES.fullPageContainer}>
      <div className={SPINNER_STYLES.fullPageContent}>
        <BaseSpinner size="large" />
        <p className={SPINNER_STYLES.fullPageMessage}>{message}</p>
      </div>
    </div>
  )
}

export default FullPageSpinner