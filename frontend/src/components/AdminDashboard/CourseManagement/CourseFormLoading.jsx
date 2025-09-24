import {
  COURSE_MANAGEMENT_STYLES,
  COURSE_MANAGEMENT_LABELS
} from '../../../constants/courseManagementConstants.jsx'

const CourseFormLoading = ({ onClose }) => {
  return (
    <div className={COURSE_MANAGEMENT_STYLES.loadingOverlay}>
      <div className={COURSE_MANAGEMENT_STYLES.loadingModal}>
        <div className={COURSE_MANAGEMENT_STYLES.loadingSpinner}></div>
        <p className={COURSE_MANAGEMENT_STYLES.loadingTitle}>
          {COURSE_MANAGEMENT_LABELS.loadingTitle}
        </p>
        <p className={COURSE_MANAGEMENT_STYLES.loadingSubtitle}>
          {COURSE_MANAGEMENT_LABELS.loadingSubtitle}
        </p>
        <button
          onClick={onClose}
          className={COURSE_MANAGEMENT_STYLES.cancelButton}
        >
          {COURSE_MANAGEMENT_LABELS.cancelButton}
        </button>
      </div>
    </div>
  )
}

export default CourseFormLoading