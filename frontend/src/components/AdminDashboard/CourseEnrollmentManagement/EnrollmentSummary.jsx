import {
  ENROLLMENT_STYLES,
  ENROLLMENT_LABELS
} from '../../../constants/courseEnrollmentManagementConstants'

const EnrollmentSummary = ({ enrollmentData }) => {
  return (
    <div className={ENROLLMENT_STYLES.summaryGrid}>
      <div className={ENROLLMENT_STYLES.summaryCard}>
        <p className={ENROLLMENT_STYLES.summaryLabel}>
          {ENROLLMENT_LABELS.summary.totalEnrolled}
        </p>
        <p className={ENROLLMENT_STYLES.summaryValue}>
          {enrollmentData.totalEnrolled.toLocaleString()}
        </p>
      </div>
      <div className={ENROLLMENT_STYLES.summaryCard}>
        <p className={ENROLLMENT_STYLES.summaryLabel}>
          {ENROLLMENT_LABELS.summary.averageRate}
        </p>
        <p className={ENROLLMENT_STYLES.summaryValueAccent}>
          {enrollmentData.averageEnrollmentRate}%
        </p>
      </div>
      <div className={ENROLLMENT_STYLES.summaryCard}>
        <p className={ENROLLMENT_STYLES.summaryLabel}>
          {ENROLLMENT_LABELS.summary.coursesShown}
        </p>
        <p className={ENROLLMENT_STYLES.summaryValue}>
          {enrollmentData.coursesCount}
        </p>
      </div>
    </div>
  )
}

export default EnrollmentSummary