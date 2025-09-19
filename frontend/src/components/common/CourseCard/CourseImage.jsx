import { CARD_STYLES } from '../../../constants/courseConstants'
import { formatDuration } from '../../../utils/courseUtils'
import CourseBadges from './CourseBadges'
import FavoriteButton from './FavoriteButton'

const CourseImage = ({
  course,
  imageLoaded,
  onImageLoad,
  onImageError,
  onFavoriteClick,
  isAuthenticated,
  isFavorite
}) => {
  return (
    <div className={CARD_STYLES.imageContainer}>
      {!imageLoaded && (
        <div className={CARD_STYLES.loadingSpinner}>
          <div className={CARD_STYLES.spinner}></div>
        </div>
      )}
      <img
        src={course.thumbnail}
        alt={course.title}
        className={`${CARD_STYLES.image} ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={onImageLoad}
        onError={onImageError}
      />

      <CourseBadges course={course} />

      <FavoriteButton
        onClick={onFavoriteClick}
        isAuthenticated={isAuthenticated}
        isFavorite={isFavorite}
      />

      <div className={CARD_STYLES.duration}>
        {formatDuration(course.duration)}
      </div>
    </div>
  )
}

export default CourseImage