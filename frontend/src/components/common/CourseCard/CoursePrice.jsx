import { CARD_STYLES } from '../../../constants/courseConstants'
import { formatPrice, getDefaultPoints } from '../../../utils/courseUtils'

const CoursePrice = ({ course }) => {
  return (
    <div className={CARD_STYLES.priceContainer}>
      <div className={CARD_STYLES.priceSection}>
        <div className={CARD_STYLES.priceText}>
          {course.price === 0 ? (
            <span className="text-accent">Gratis</span>
          ) : (
            <span>{formatPrice(course.price)}</span>
          )}
        </div>

        {course.points && (
          <div className={CARD_STYLES.pointsContainer}>
            <span className="text-purple-400 text-sm">🏆</span>
            <span className={CARD_STYLES.pointsText}>
              +{course.points || getDefaultPoints()} pts
            </span>
          </div>
        )}
      </div>

      {course.isDemo && (
        <span className={CARD_STYLES.demoLabel}>
          Vista previa
        </span>
      )}
    </div>
  )
}

export default CoursePrice