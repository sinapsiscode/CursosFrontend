import { ENROLLMENT_STYLES, ENROLLMENT_TEXTS } from '../../../constants/enrollmentConstants'
import LoadingSpinner from './LoadingSpinner'

const EnrollButton = ({ enrolling, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={enrolling}
      className={ENROLLMENT_STYLES.button}
    >
      {enrolling ? (
        <span className={ENROLLMENT_STYLES.loadingContainer}>
          <LoadingSpinner />
          {ENROLLMENT_TEXTS.processing}
        </span>
      ) : (
        ENROLLMENT_TEXTS.acquireCourse
      )}
    </button>
  )
}

export default EnrollButton