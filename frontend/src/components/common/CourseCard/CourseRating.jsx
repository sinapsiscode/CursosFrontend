import { CARD_STYLES } from '../../../constants/courseConstants'
import { formatStudentCount } from '../../../utils/courseUtils'

const CourseRating = ({ rating, students }) => {
  return (
    <div className={CARD_STYLES.ratingContainer}>
      <div className={CARD_STYLES.ratingStars}>
        <div className="flex items-center">
          <svg className={CARD_STYLES.star} viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <span className="text-white text-sm ml-1">{rating}</span>
        </div>
        <span className="text-secondary text-sm">
          ({formatStudentCount(students)} estudiantes)
        </span>
      </div>
    </div>
  )
}

export default CourseRating