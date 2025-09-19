import { FORM_LABELS, FORM_STYLES } from '../../../constants/reviewConstants'

const InfoFooter = () => {
  return (
    <div className={FORM_STYLES.infoFooter}>
      <div className={FORM_STYLES.infoContent}>
        <svg
          className={FORM_STYLES.infoIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className={FORM_STYLES.infoText}>
          <p className={FORM_STYLES.infoTitle}>
            {FORM_LABELS.infoTitle}
          </p>
          <p>{FORM_LABELS.infoDescription}</p>
        </div>
      </div>
    </div>
  )
}

export default InfoFooter