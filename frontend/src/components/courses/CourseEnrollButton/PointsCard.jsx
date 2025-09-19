import { ENROLLMENT_STYLES, ENROLLMENT_TEXTS } from '../../../constants/enrollmentConstants'

const PointsCard = ({ pointsToEarn }) => {
  return (
    <div className={ENROLLMENT_STYLES.pointsCard}>
      <div className={ENROLLMENT_STYLES.pointsContainer}>
        <span className={ENROLLMENT_STYLES.pointsLabel}>
          {ENROLLMENT_TEXTS.pointsToEarn}
        </span>
        <span className={ENROLLMENT_STYLES.pointsAmount}>
          +{pointsToEarn} pts
        </span>
      </div>
    </div>
  )
}

export default PointsCard