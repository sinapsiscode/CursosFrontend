import { RATING_RANGE, FORM_STYLES } from '../../../constants/reviewConstants'
import { getRatingText } from '../../../utils/reviewFormUtils'

const RatingStars = ({
  rating,
  hoveredRating,
  onRatingClick,
  onRatingHover,
  onRatingLeave,
  error
}) => {
  return (
    <div className="space-y-2">
      <label className={FORM_STYLES.label}>
        Calificación *
      </label>
      <div className={FORM_STYLES.starContainer}>
        {RATING_RANGE.map((starRating) => (
          <button
            key={starRating}
            type="button"
            onClick={() => onRatingClick(starRating)}
            onMouseEnter={() => onRatingHover(starRating)}
            onMouseLeave={onRatingLeave}
            className={FORM_STYLES.starButton}
          >
            <svg
              className={`w-8 h-8 ${
                starRating <= (hoveredRating || rating)
                  ? FORM_STYLES.starActive
                  : FORM_STYLES.starInactive
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
        ))}
      </div>
      <p className={FORM_STYLES.ratingText}>
        {getRatingText(hoveredRating || rating)}
      </p>
      {error && (
        <p className={FORM_STYLES.errorCenter}>{error}</p>
      )}
    </div>
  )
}

export default RatingStars