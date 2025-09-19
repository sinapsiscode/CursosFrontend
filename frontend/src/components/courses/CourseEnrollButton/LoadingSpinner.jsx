import { ENROLLMENT_STYLES, ENROLLMENT_ICONS } from '../../../constants/enrollmentConstants'

const LoadingSpinner = () => {
  return (
    <svg className={ENROLLMENT_STYLES.loadingSpinner} viewBox="0 0 24 24">
      <circle
        className={ENROLLMENT_ICONS.spinner.circle}
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className={ENROLLMENT_ICONS.spinner.path}
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export default LoadingSpinner